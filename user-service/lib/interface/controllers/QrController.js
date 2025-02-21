import UserRepository from "../../infrastructure/repositories/UserRepository.js";
import RedisOtpRegistry from "../../infrastructure/cache/RedisOtpRepository.js";
import OtpUseCase from "../../use-cases/user/OtpUseCase.js";
import JwtAccessTokenManager from "../../infrastructure/security/JwtAccessTokenManager.js";
import LoginUser from "../../use-cases/user/LoginUser.js";
import axios from "axios";
import SubscriptionGateway from "../../gateway/SubscriptionGateway.js";
import SessionRepository from "../../infrastructure/repositories/SessionRepository.js";

const subscriptionGateway = new SubscriptionGateway(axios);
const userRepository = new UserRepository();
const redisOtpRegistry = new RedisOtpRegistry();
const jwtAccessTokenManager = new JwtAccessTokenManager();
const sessionRepository = new SessionRepository();

const userLogin = new LoginUser(
  userRepository,
  subscriptionGateway,
  sessionRepository
);
const otpUseCase = new OtpUseCase(redisOtpRegistry);

class QrController {
  static async storeQR(req, res) {
    try {
      const { random } = req.body;
      if (!random) {
        return res.status(400).json({ message: "Random Number is needed" });
      }

      await otpUseCase.generateAndSaveOtp(random, false);

      res.status(200).json({ message: "stored email" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async validateQr(req, res) {
    try {
      const { id } = req.params;

      // Set headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const sendPing = setInterval(() => {
        res.write("event: ping\n");
        res.write(`data: {}\n\n`);
      }, 10000);

      // Continuously check QR validation status
      const intervalId = setInterval(async () => {
        try {
          const verified = await otpUseCase.verifyKey(id);

          if (verified && verified !== "false") {
            const deviceId = "Linux-Guest";
            const refreshToken = jwtAccessTokenManager.generate(
              { email: verified },
              "7d"
            );
            const { user } = await userLogin.execute(
              verified,
              deviceId,
              refreshToken
            );
            const payload = { email: verified, isAdmin: user.isAdmin };
            const accessToken = jwtAccessTokenManager.generate(payload, "1h");

            res.write("event: validated\n");
            res.write(
              `data: ${JSON.stringify({
                success: true,
                accessToken,
                refreshToken,
                user,
              })}\n\n`
            );

            clearInterval(intervalId);
            clearInterval(sendPing);
            res.end();
          }
        } catch (error) {
          // Handle errors and send an error event
          res.write("event: error\n");
          res.write(`data: { "message": "${error.message}" }\n\n`);
          clearInterval(intervalId);
          clearInterval(sendPing);
          res.end();
        }
      }, 5000); // Check every 5 seconds

      // Cleanup when the client disconnects
      req.on("close", () => {
        clearInterval(intervalId);
        clearInterval(sendPing);
        res.end();
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async scanQr(req, res) {
    try {
      const { id } = req.params;
      const verified = await otpUseCase.updateVal(id, req.user?.email);

      if (verified) {
        res.status(200).json({ success: true, message: "Auth Success" });
      } else {
        res.status(200).json({ message: "Auth failed" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default QrController;
