import Profile from "../../domain/entities/Profile.js";

class CreateProfile {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(userId, profileData) {
    const profile = new Profile(profileData);
    return await this.profileRepository.createProfile(userId, profile);
  }
}

export default CreateProfile;
