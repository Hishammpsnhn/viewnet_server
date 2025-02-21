class User {
  constructor({id, email, profiles, defaultProfile, isAdmin, isBlocked}) {
    this.id = id;
    this.email = email;
    this.profiles = profiles || [];
    this.defaultProfile = defaultProfile || null;
    this.isAdmin = isAdmin || false;
    this.isBlocked = isBlocked || false;
  }

  setDefaultProfile(profileId) {
    this.defaultProfile = profileId;
  }

  addProfile(profile) {
    this.profiles.push(profile);
  }
}

export default User;
