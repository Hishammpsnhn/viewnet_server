class Profile {
    constructor({ isAdult, username, profilePic, watchHistory,id }) {
      this.setIsAdult(isAdult);
      this.setUsername(username);
      this.setProfilePic(profilePic);
      this.id = id || null;
      this.watchHistory = watchHistory || null;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    setIsAdult(isAdult) {
      if (typeof isAdult !== "boolean") {
        throw new Error("isAdult must be a boolean");
      }
      this.isAdult = isAdult;
    }
  
    setUsername(username) {
      if (!username || username.length < 3 || username.length > 50) {
        throw new Error("Username must be between 3 and 50 characters");
      }
      this.username = username.trim();
    }
  
    setProfilePic(profilePic) {
      if (!profilePic ) {
        throw new Error("Invalid profile picture URL");
      }
      this.profilePic = profilePic;
    }
  
    updateProfile({ isAdult, username, profilePic }) {
      if (isAdult !== undefined) {
        this.setIsAdult(isAdult);
      }
      if (username !== undefined) {
        this.setUsername(username);
      }
      if (profilePic !== undefined) {
        this.setProfilePic(profilePic);
      }
      this.updatedAt = new Date();
    }
  }
  
  export default Profile;
  