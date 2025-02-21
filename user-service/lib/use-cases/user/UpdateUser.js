class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async execute(id, data) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const newUpdateData = await this.userRepository.updateById(id, data);

    return newUpdateData;
  }
}

export default UpdateUser;
