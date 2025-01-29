class GetAllUsers {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(search) {
      return await this.userRepository.getByEmail(search);
    }
  }
  
  export default GetAllUsers;
  