const ClientRequest = require("./ClientRequest.js");
const EventTracker = require("./EventTracker.js");
const User = require("./User.js");
const ContentCreator = require("./ContentCreator.js");
const { VastBuilder } = require("../utils/vast-maker");
const { VmapBuilder } = require("../utils/vmap-maker");
const { v4: uuid } = require("uuid");
const constants = require("../utils/constants");
const Publication = require("./Publication.js");
const DOMParser = require('xmldom').DOMParser;

class Session {
  // Public Fields
  sessionId;
  adBreakDuration;
  created;
  host;
  responseFormat;
  // Private Fields
  #clientRequest;
  #user;
  #vastXml;
  #vmapXml;
  #eventTracker;
  #contentCreator;
  #publication;

  constructor(params) {
    if (params) {
      // Take a time stamp.
      const timeStamp = new Date().toISOString();

      this.created = timeStamp;
      this.sessionId = uuid();
      this.host = params.host || null;
      this.responseFormat = params.rf || constants.RESPONSE_FORMATS.VAST;
      this.#user = new User(params.uid || "unknown");
      this.#contentCreator = new ContentCreator(params.cc || "unknown");
      this.#publication = new Publication(params.pi || 'unknown')

      this.#clientRequest = new ClientRequest(params);
      this.#eventTracker = new EventTracker();

      if (this.responseFormat === constants.RESPONSE_FORMATS.VMAP) {
        // Create VMAP object. 
        let vmapObj;
        vmapObj = VmapBuilder({
          breakpoints: params.bp || "",
          preroll: params.prr === "true",
          postroll: params.por === "true",
          generalVastConfigs: {
            sessionId: this.sessionId,
            desiredDuration: params.dur || "0",
            adserverHostname: this.host,
            maxPodDuration: params.max || null,
            minPodDuration: params.min || null,
            podSize: params.ps || null,
            adCollection: params.coll || null,
          },
        });
        this.#vmapXml = vmapObj.xml;
        this.adBreakDuration = vmapObj.durations;
      } else {
        // Create VAST object.
        const vastObj = VastBuilder({
          sessionId: this.sessionId,
          desiredDuration: params.dur || "0",
          adserverHostname: this.host,
          maxPodDuration: params.max || null,
          minPodDuration: params.min || null,
          podSize: params.ps || null,
          adCollection: params.coll || null,
          adList: params.adList
        });
        // console.log(vastObj)
        this.#vastXml = vastObj.xml;
        this.adBreakDuration = vastObj.duration;
      }
    }
  }

  getUser() {
    return this.#user.getUserId();
  }

  getXmlResponse() {
    if (this.#vastXml) {
      return this.getVastXml();
    }
    if (this.#vmapXml) {
      return this.getVmapXml();
    }
    return "";
  }

  getVastXml() {
    return this.#vastXml.toString();
  }

  getVmapXml() {
    return this.#vmapXml.toString();
  }

  getClientRequest() {
    return this.#clientRequest.getAllParameters();
  }

  getTrackedEvents() {
    return this.#eventTracker.getEvents();
  }

  getContentCreator() {
    return this.#contentCreator.getContentCreatorId();
  }

  getPublication() {
    return this.#publication.getPublicationId();
  }

  AddTrackedEvent(eventObj) {
    this.#eventTracker.AddEvent(eventObj);
  }

  toJSON() {
    return {
      session_id: this.sessionId,
      user_id: this.getUser(),
      ad_break_dur: this.adBreakDuration,
      created: this.created,
      host: this.host,
      cli_req: JSON.stringify(this.getClientRequest()),
      response: this.getXmlResponse().toString(),
      tracked_events: JSON.stringify(this.getTrackedEvents()),
      content_creator: this.getContentCreator(),
      publication_id: this.getPublication()
    }
  }

  // Initialize new Session from its JSON form.
  fromJSON(jsonObj) {
    this.created = jsonObj.CREATED;
    this.sessionId = jsonObj.SESSION_ID;
    this.host = jsonObj.HOST;
    this.#user = new User(jsonObj.USER_ID || "unknown");
    this.#contentCreator = new ContentCreator(jsonObj.CONTENT_CREATOR || "unknown");
    this.#publication = new Publication(jsonObj.PUBLICATION_ID || "0x0")
    this.#clientRequest = new ClientRequest(JSON.parse(jsonObj.CLI_REQ));
    this.#eventTracker = new EventTracker(JSON.parse(jsonObj.TRACKED_EVENTS)['events']);
    this.adBreakDuration = jsonObj.AD_BREAK_DUR;

    const parser = new DOMParser();
    const vastXml = parser.parseFromString(jsonObj.RESPONSE, "text/xml");
    this.#vastXml = vastXml;

  }

  toObject() {
    return {
      sessionId: this.sessionId,
      userId: this.getUser(),
      created: this.created,
      adBreakDuration: this.adBreakDuration,
      clientRequest: this.getClientRequest(),
      response: this.getXmlResponse().toString(),
      contentCreator: this.getContentCreator(),
      publicationId: this.getPublication()
    };
  }

}

module.exports = Session;
