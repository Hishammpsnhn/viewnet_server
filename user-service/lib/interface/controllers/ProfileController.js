import ProfileRepository from "../../infrastructure/repositories/ProfileRepository.js";
import CreateProfile from "../../use-cases/profile/CreateProfile.js";
import UpdateProfile from "../../use-cases/profile/updateProfile.js";
import ChangeDefaultProfile from "../../use-cases/profile/ChangeDefaultProfile.js"

const profileRepository = new ProfileRepository();

const createProfile = new CreateProfile(profileRepository);
const updateProfile = new UpdateProfile(profileRepository);
const changeDefaultProfile = new ChangeDefaultProfile(profileRepository);

export class ProfileController {
  async createProfile(req, res) {
    try {
      const { userId, profileData } = req.body;
      if (!userId || !profileData) {
        return res
          .status(400)
          .json({ message: "userId and profileData are required" });
      }
      const createdProfile = await createProfile.execute(userId, profileData);
      res.status(201).json({ success: true, user: createdProfile });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const { defaultProfile } = req.body;
      if (!id || !defaultProfile) {
        return res
          .status(400)
          .json({ message: "id and default profile are required" });
      }
      const updatedProfile = await updateProfile.execute(id, defaultProfile);
      res.status(200).json({ success: true, user: updatedProfile });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async changeDefaultProfile(req, res) {
    try {
      const { id } = req.params;
      const { defaultProfile } = req.body;
      if (!id || !defaultProfile) {
        return res
          .status(400)
          .json({ message: "id and default profile are required" });
      }
      const user = await changeDefaultProfile.execute(id, defaultProfile);
      res.status(200).json({ success: true, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default ProfileController;
