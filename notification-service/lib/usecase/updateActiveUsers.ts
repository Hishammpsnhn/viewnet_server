import ActiveRepositoryImpl from "../infrastructure/repository/ActiveRepository";

class UpdateActiveUser {
  private activeUser: ActiveRepositoryImpl;

  constructor(activeUser: ActiveRepositoryImpl) {
    this.activeUser = activeUser;
  }

  async execute(count:number): Promise<any[]> {
  

    const res = await this.activeUser.update(count);
    return res;
  }
}

export default UpdateActiveUser;
