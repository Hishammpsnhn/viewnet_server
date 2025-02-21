import AccessTokenManager from "../../infrastructure/security/JwtAccessTokenManager.js";
import AuthenticateUser from "../../use-cases/AuthenticateUser.js";

const accessTokenManager = new AccessTokenManager();


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
      accessTokenManager
    });

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
}

