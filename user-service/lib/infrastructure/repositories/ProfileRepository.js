// data/repositories/ProfileRepository.js
import IProfileRepository from "../../domain/interfaces/IProfileRepository.js";
import UserModel from "../database/models/UserModel.js";

class ProfileRepository extends IProfileRepository {
  async createProfile(userId, profileData) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }
      const newProfile = user.profiles.create(profileData);
      user.profiles.push(newProfile);

      user.defaultProfile = newProfile._id;

      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error creating profile: ${error.message}`);
    }
  }

  // Get a profile by userId
  async getProfileByUserId(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      return user.profiles; 
    } catch (error) {
      throw new Error(`Error fetching profiles: ${error.message}`);
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: userId, "profiles._id": profileData.id },
        {
          $set: {
            "profiles.$.isAdult": profileData.isAdult,
            "profiles.$.username": profileData.username,
            "profiles.$.profilePic": profileData.profilePic,
          },
        },
        { new: true } 
      );
      if (!user) {
        throw new Error("User not found");
      }
      return {
        _id: profileData.id,
        isAdult: profileData.isAdult,
        username: profileData.username,
        profilePic: profileData.profilePic,
      };
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }
  async changeDefaultProfile(userId,profileId){
    try {
      const user = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { defaultProfile: profileId },
        { new: true }
      );
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error changing default profile: ${error.message}`);
    }
  }
}

export default ProfileRepository;
