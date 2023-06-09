class ContentCreator {
  #ContentCreatorId;

  constructor(ContentCreatorId) {
    // Assign uid
    this.#ContentCreatorId = ContentCreatorId;
  }

  getContentCreatorId() {
    return this.#ContentCreatorId;
  }
}

module.exports = ContentCreator;
