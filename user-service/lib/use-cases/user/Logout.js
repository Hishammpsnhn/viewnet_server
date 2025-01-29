class Logout {
  constructor(sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  async execute(email, deviceId) {

    const activeSessions = await this.sessionRepository.deleteSession(
      email,
      deviceId
    );
    return true;
  }
}

export default Logout;
