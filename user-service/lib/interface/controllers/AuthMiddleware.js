import AccessTokenManager from "../../infrastructure/security/JwtAccessTokenManager.js";
import AuthenticateUser from "../../use-cases/AuthenticateUser.js";
import UserRepository from "../../infrastructure/repositories/UserRepository.js";

const accessTokenManager = new AccessTokenManager();
const userRepository = new UserRepository();

export async function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const user = await AuthenticateUser(token, {
      accessTokenManager,
      userRepository,
    });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
}
export async function isAdminAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const user = await AuthenticateUser(token, {
      accessTokenManager,
      userRepository,
    });

    console.log("user form autheniticated", user);
    if (!user.isAdmin) {
      return res.status(403).json({ message: "User is not an admin" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
}
