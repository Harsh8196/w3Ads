const { v4: uuid} = require("uuid");

class Ads {
  // Public Fields
  universalId;
  id;
  adsName;
  created;
  company;
  budget;
  adsDuration;
  adsStatus;
  url;
  bitrate;
  width;
  height;
  codec;
  category;
  impressionBd;
  clickBd ;

  constructor(params) {
    if (params) {
      // Take a time stamp.
      const timeStamp = new Date().toISOString();

      this.created = timeStamp;
      this.universalId = uuid();
      this.id = params.id || null;
      this.adsName = params.adsName || "unknown";
      this.company = params.company || "unknown";
      this.budget = params.budget || 0;
      this.adsDuration = params.adsDuration || 0;
      this.adsStatus = params.adsStatus || "unknown";
      this.url = params.url || "https://example.com";
      this.bitrate = params.bitrate || 0;
      this.width = params.width || 1080;
      this.height = params.height || 796;
      this.codec = params.codec || "unknown";
      this.category = params.category || "unknown";
      this.impressionBd = params.impressionBd || 0;
      this.clickBd = params.clickBd || 0;
    }
  }

  toJSON() {
    return {
      universal_id: this.universalId,
      id: this.id,
      ads_name: this.adsName,
      created: this.created,
      company: this.company,
      budget: this.budget,
      ads_duration: this.adsDuration,
      ads_status: this.adsStatus,
      url: this.url,
      bitrate: this.bitrate,
      width: this.width,
      height: this.height,
      codec: this.codec,
      category: this.category,
      impression_bd: this.impressionBd,
      click_bd: this.clickBd
    }
  }

  // Initialize new Session from its JSON form.
  fromJSON(jsonObj) {

    this.created = jsonObj.CREATED_AT;
    this.universalId = jsonObj.UNIVERSAL_ID;
    this.id = jsonObj.ID;
    this.adsName = jsonObj.ADS_NAME;
    this.company =jsonObj.COMPANY;
    this.budget = jsonObj.BUDGET_TOTAL;
    this.adsDuration = jsonObj.DURATION;
    this.adsStatus = jsonObj.ADS_STATUS;
    this.url = jsonObj.URL;
    this.bitrate = jsonObj.BITRATE;
    this.width = jsonObj.WIDTH;
    this.height = jsonObj.HEIGHT;
    this.codec = jsonObj.CODEC;
    this.category = jsonObj.CATEGORY;
    this.impressionBd = jsonObj.IMPRESSION;
    this.clickBd = jsonObj.CLICK;

  }

  toObject() {
    return {
      created:this.created,
      universalId: this.universalId,
      id: this.id,
      adsName: this.adsName,
      company: this.company,
      budget: this.budget,
      adsDuration: this.adsDuration,
      adsStatus: this.adsStatus,
      url: this.url,
      bitrate: this.bitrate,
      width: this.width,
      height: this.height,
      codec: this.codec,
      category: this.category,
      impressionBd: this.impressionBd,
      clickBd : this.clickBd
    };
  }

}

module.exports = Ads;
