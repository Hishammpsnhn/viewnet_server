class LoginUser {
  constructor(
    userRepository,
    subscriptionGateway,
    sessionRepository
  ) {
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
    console.log("plan Details ++++++", planDetails);
    const activeSessions = await this.sessionRepository.getSessionsByEmail(
      email
    );
    if (planDetails[0]?.status === "active") {
      if (
        activeSessions.length >= planDetails[0]?.sessionLimit &&
        !user.isAdmin
      ) {
        throw new Error(
          "You have reached the maximum number of active devices."
        );
      }
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
