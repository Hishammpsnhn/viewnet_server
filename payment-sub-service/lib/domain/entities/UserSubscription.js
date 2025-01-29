export default class UserSubscriptionType {
  constructor({
    id = null,
    userId,
    plan,
    startDate,
    endDate,
    status,
    sessionLimit,
    ads,
    live,
    uhd,
  }) {
    this.id = id;
    this.userId = userId;
    this.plan = plan;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.sessionLimit = sessionLimit;
    this.ads = ads;
    this.live = live;
    this.uhd = uhd;
    this.createdAt = new Date();
  }
  isExpired(currentDate) {
    return this.status === "active" && this.endDate < currentDate;
  }

  canBeActivated(currentDate) {
    return this.status === "queued" && this.startDate <= currentDate;
  }
}
