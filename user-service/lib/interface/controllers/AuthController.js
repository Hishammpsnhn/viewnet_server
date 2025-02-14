import EmailVerify from "../../use-cases/user/EmailVerify.js";
import GetAllUsers from "../../use-cases/user/GetAllUser.js";
import UpdateUser from "../../use-cases/user/UpdateUser.js";
import GetUser from "../../use-cases/user/GetUser.js";
import LoginUser from "../../use-cases/user/LoginUser.js";
import Logout from "../../use-cases/user/Logout.js";
import axios from "axios";
import UserRepository from "../../infrastructure/repositories/UserRepository.js";
import NotificationService from "../../infrastructure/queue/NotificationService.js";
import SessionRepository from "../../infrastructure/repositories/SessionRepository.js";
import RedisOtpRegistry from "../../infrastructure/cache/RedisOtpRepository.js";
import OtpUseCase from "../../use-cases/user/OtpUseCase.js";
import JwtAccessTokenManager from "../../infrastructure/security/JwtAccessTokenManager.js";
import SubscriptionGateway from "../../gateway/SubscriptionGateway.js";

const userRepository = new UserRepository();
const notificationService = new NotificationService();
const redisOtpRegistry = new RedisOtpRegistry();
const jwtAccessTokenManager = new JwtAccessTokenManager();
const subscriptionGateway = new SubscriptionGateway(axios);
const sessionRepository = new SessionRepository();

const loginUser = new EmailVerify(userRepository, notificationService);
const getUser = new GetUser(
  userRepository,
  subscriptionGateway,
  sessionRepository,
  redisOtpRegistry,
);
const userLogin = new LoginUser(
  userRepository,
  subscriptionGateway,
  sessionRepository
);
const logout = new Logout(sessionRepository);
const getAllUsers = new GetAllUsers(userRepository);
const otpUseCase = new OtpUseCase(redisOtpRegistry);
const updateUser = new UpdateUser(userRepository);

class UserController {
  static async getMe(req, res) {
    console.log("get me")
    try {
    //  console.log("req.user", req.user);
      if (!req.user) {
        return res.status(400).json({ message: "Token is required" });
      }
      const { user, planDetails } = await getUser.execute(req.user.email);
      //console.log("user>>>>", user, planDetails);

      res.status(200).json({
        success: true,
        user,
        planDetails,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async validate(req, res) {
    console.log("validat")
    try {
      console.log("req.user", req.user);
      if (!req.user) {
        return res.status(400).json({ message: "Token is required" });
      }
      const data = await getUser.getByEmail(req.user.email);
      console.log("user>>>>",data);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async login(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpRes = await otpUseCase.generateAndSaveOtp(email, otp);
      let user = await loginUser.execute(email, otp);

      res.status(200).json({ message: "otp sent to email" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyOtp(req, res) {
    try {
      const { email, otp, deviceId } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const verified = await otpUseCase.verifyOtp(email, otp);
      if (verified) {
        const refreshToken = jwtAccessTokenManager.generate({ email }, "7d");
        const { user } = await userLogin.execute(email, deviceId, refreshToken);
        const payload = { email: user.email, isAdmin: user.isAdmin };
        const accessToken = jwtAccessTokenManager.generate(payload, "1h");
        const accessOptions = {
          maxAge: 15 * 60 * 1000, // 7 days
          httpOnly: false,
          secure: false,
          sameSite: "Lax",
          path: "/",
        };

        const refreshOptions = {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: false,
          secure: false,
          sameSite: "Lax",
          path: "/",
        };
        res
          .status(200)
          .cookie("accessToken", accessToken, accessOptions)
          .cookie("refreshToken", refreshToken, refreshOptions)
          .json({
            success: true,
            accessToken,
            refreshToken,
            user,
          });
      } else {
        res.status(400).json({ message: "Invalid OTP" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllUsers(req, res) {
    const { page, limit, search,isBlock } = req.query;
    console.log("reqparams", req.query);
    const numericLimit = parseInt(limit, 10);
    try {
      const users = await getAllUsers.execute(page, numericLimit, search,isBlock);
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getAllUsersBySearch(req, res) {
    const { search } = req.query;
    console.log("reqparams", req.query);
    try {
      const users = await getAllUsers.execute(page, limit);
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async UpdateUser(req, res) {
    try {
      const { id } = req.params;

      const updatedUser = await updateUser.execute(id, req.body.newData);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const decoded = jwtAccessTokenManager.decode(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const user = await getUser.getByEmail(decoded.email);
    const payload = { email: decoded.email, isAdmin: user.isAdmin };
    const accessToken = jwtAccessTokenManager.generate(payload, "1h");
    const accessOptions = {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      path: "/",
    };
    res.status(200).cookie("accessToken", accessToken, accessOptions).json({
      success: true,
      accessToken,
    });
  }
  static async logOut(req, res) {
    try {
      const refreshToken = req.params.token;
      const response = await logout.execute(req.user.email, refreshToken);

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserController;
