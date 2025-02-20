require("dotenv").config();

const requiredEnvVars = [
  "PORT",
  "CLIENT_URL",
  "USER_SERVICE_URL",
  "SUBSCRIPTION_SERVICE_URL",
  "UPLOADING_SERVICE_URL",
  "CONTENT_SERVICE_URL",
  "LIVE_STREAMING_SERVICE_URL",
  "NOTIFICATION_SERVICE_URL",
  "JWT_SECRET"
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1); 
}

const environment = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL,
  jwtSecret:process.env.JWT_SECRET,
  services: {
    user: process.env.USER_SERVICE_URL,
    subscription: process.env.SUBSCRIPTION_SERVICE_URL,
    uploading: process.env.UPLOADING_SERVICE_URL,
    content: process.env.CONTENT_SERVICE_URL,
    liveStreaming: process.env.LIVE_STREAMING_SERVICE_URL,
    notification: process.env.NOTIFICATION_SERVICE_URL,
  },
};

module.exports = environment;
