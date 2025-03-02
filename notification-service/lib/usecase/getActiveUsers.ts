import ActiveUserRepository from "../infrastructure/repository/ActiveRepository";

class GetActiveUser {
  private activeUserRepository: ActiveUserRepository;

  constructor(activeUserRepository: ActiveUserRepository) {
    this.activeUserRepository = activeUserRepository;
  }

  async execute(): Promise<any[]> {
    const res = await this.activeUserRepository.getActiveUserCount();
    return res;
  }
}

export default GetActiveUser;
