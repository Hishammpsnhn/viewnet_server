export default class SubscriptionType {
  constructor(
    id = null,
    name,
    description,
    price,
    sessionLimit,
    duration,
    isActive,
    ads,
    live,
    uhd
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sessionLimit = sessionLimit;
    this.duration = duration;
    this.isActive = isActive;
    this.ads = ads;
    this.live = live;
    this.uhd = uhd;
    this.createdAt = new Date();
    this._modifiedFields = {};
  }

  setName(name) {
    if (name === this.name) return;
    this.name = name;

    this._modifiedFields.name = true;
  }
  setActive(isActive) {
    if (isActive === this.isActive) return;
    this.isActive = isActive;
    this._modifiedFields.isActive = true;
  }

  setDescription(description) {
    if (description === this.description) return;
    this.description = description;

    this._modifiedFields.description = true;
  }

  setPrice(price) {
    if (price === this.price) return;
    this.price = price;

    this._modifiedFields.price = true;
  }

  setSessionLimit(limit) {
    if (limit === this.sessionLimit) return;
    this.sessionLimit = limit;

    this._modifiedFields.sessionLimit = true;
  }

  setAds(ads) {
    if (ads === this.ads) return;
    this.ads = ads;
    this._modifiedFields.ads = true;
  }
  setLive(live) {
    if (live === this.live) return;
    this.live = live;
    this._modifiedFields.live = true;
  }
  setUhd(uhd) {
    if (uhd === this.uhd) return;
    this.uhd = uhd;
    this._modifiedFields.uhd = true;
  }

  setDuration(duration) {
    if (duration === this.duration) return;
    this.duration = duration;

    this._modifiedFields.duration = true;
  }

  setFeatures(features) {
    if (JSON.stringify(features) === JSON.stringify(this.features)) return;
    this.features = features;

    this._modifiedFields.features = true;
  }

  activate() {
    if (this.isActive) return;
    this.isActive = true;

    this._modifiedFields.isActive = true;
  }

  getModifiedFields() {
    return this._modifiedFields;
  }

  clearModifiedFields() {
    this._modifiedFields = {};
  }
}
