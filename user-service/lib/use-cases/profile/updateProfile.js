import Profile from "../../domain/entities/Profile.js";

class UpdateProfile {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(id,  updatedProfileData) {
    const updatedProfile = new Profile(updatedProfileData);
    return await this.profileRepository.updateProfile(id,  updatedProfile);
  }
}
export default UpdateProfile;
