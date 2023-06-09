class Publication {
    #PublicationId;
  
    constructor(PublicationId) {
      // Assign uid
      this.#PublicationId = PublicationId;
    }
  
    getPublicationId() {
      return this.#PublicationId;
    }
  }
  
  module.exports = Publication;
  