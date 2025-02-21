// import jwt from 'jsonwebtoken';
import User from "../../domain/entities/User.js";

class LoginUser {
  constructor(userRepository, notificationService) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validateOtp(otp) {
    return otp && otp.length === 4;
  }
  async execute(email, otp) {
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!this.validateOtp(otp)) {
      throw new Error("Invalid OTP format");
    }
    let user;
    user = await this.userRepository.findByEmail(email);

    if (!user) {
      const neUser = new User({ email });
      user = await this.userRepository.create(neUser);
    } else {
      if (user.isBlock) {
        throw new Error("User is blocked");
      }
    }
    await this.notificationService.sendNotification(
      email,
      "notificationDetails.subject",
      otp
    );

    return user;
  }
}

export default LoginUser;
