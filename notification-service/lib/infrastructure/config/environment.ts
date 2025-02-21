import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    CLIENT_URL:process.env.CLIENT_URL,
    GATEWAY_URL:process.env.GATEWAY_URL,
    USER_SERVICE_URL:process.env.USER_SERVICE_URL,
  };


  const missingVars = Object.entries(env)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(
      `[env] Warning: Missing environment variables - ${missingVars.join(", ")}`
    );
    process.exit(1);
  } else {
    console.log("[env] All required environment variables are set.");
  }

  return env;
})();
