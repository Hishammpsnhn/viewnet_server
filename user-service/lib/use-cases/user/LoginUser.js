class LoginUser {
  constructor(userRepository, subscriptionGateway, sessionRepository) {
    this.userRepository = userRepository;
    this.subscriptionGateway = subscriptionGateway;
    this.sessionRepository = sessionRepository;
  }

  async execute(email, deviceId, refreshToken) {
    console.log(email, deviceId, refreshToken);
    const user = await this.userRepository.findByEmail(email);
    if (user.isBlock) {
      throw new Error("User is blocked.");
    }
    const planDetails = await this.subscriptionGateway.fetchSubscriptionDetails(
      user._id
    );
    const activeSessions = await this.sessionRepository.getSessionsByEmail(
      email
    );
    if (activeSessions.length >= planDetails?.sessionLimit) {
      throw new Error("You have reached the maximum number of active devices.");
    }
    const newSession = await this.sessionRepository.save({
      email,
      deviceId,
      refreshToken,
    });
    return { user, planDetails, newSession };
  }
}

export default LoginUser;
