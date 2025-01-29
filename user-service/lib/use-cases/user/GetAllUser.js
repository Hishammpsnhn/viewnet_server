class GetAllUsers {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(page,limit,search) {
      return await this.userRepository.getAll(page,limit,search);
    }
  }
  
  export default GetAllUsers;
  