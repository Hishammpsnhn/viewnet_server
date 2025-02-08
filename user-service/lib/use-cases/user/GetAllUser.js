class GetAllUsers {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(page,limit,search,isBlock) {
      return await this.userRepository.getAll(page,limit,search,{isBlock});
    }
  }
  
  export default GetAllUsers;
  