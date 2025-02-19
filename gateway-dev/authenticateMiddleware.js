const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    req.headers["X-Email"] = decoded.email ?? "";
    req.headers["X-Authenticated"] = "true";

    const { data } = await axios.get("http://user-service:5000/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User service response:", data);
    if (data?.data?.isBlock) {
      console.log("User is blocked");
      return res.status(403).json({ message: "User is blocked" });
    }

    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired, please login again" });
    } else if (error.response) {
      console.error("Error from user service:", error.response.data);
      return res.status(500).json({ message: "Error validating user status" });
    } else {
      console.log("Invalid token or other error:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  }
}

module.exports = authenticate;
