class CreateProfile{
    constructor(profileRepository) {
      this.profileRepository = profileRepository;
    }
  
    async execute(userId, profileId) {
      return await this.profileRepository.changeDefaultProfile(userId, profileId);
    }
  }
  
  export default CreateProfile;
  