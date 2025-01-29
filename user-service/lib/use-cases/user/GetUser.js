class GetUser {
  constructor(userRepository, subscriptionGateway, sessionRepository) {
    this.userRepository = userRepository;
    this.subscriptionGateway = subscriptionGateway;
    this.sessionRepository = sessionRepository;
  }

  async execute(email) {
    const user = await this.userRepository.findByEmail(email);
    const planDetails = await this.subscriptionGateway.fetchSubscriptionDetails(
      user._id
    );

    return { user, planDetails };
  }
  async getByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }
}

export default GetUser;
