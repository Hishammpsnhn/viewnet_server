class GetUser {
  constructor(
    userRepository,
    subscriptionGateway,
    sessionRepository,
    cacheRepository
  ) {
    this.userRepository = userRepository;
    this.subscriptionGateway = subscriptionGateway;
    this.sessionRepository = sessionRepository;
    this.cacheRepository = cacheRepository;
  }

  async execute(email) {
    let user = await this.cacheRepository.get(email);
    if (!user) {
      user = await this.userRepository.findByEmail(email);
      if (user) {
        await this.cacheRepository.save(user.email, user, 3600); // Cache for 1 hour
      }
    }

    let planDetails = await this.cacheRepository.get(`plan_${user._id}`);

    if (!planDetails) {

      planDetails = await this.subscriptionGateway.fetchSubscriptionDetails(
        user._id
      );
      if (planDetails) {
        await this.cacheRepository.save(`plan_${user._id}`, planDetails, 3600); // Cache for 1 hour
      }
    }
    return { user, planDetails };
  }
  async getByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }
}

export default GetUser;
