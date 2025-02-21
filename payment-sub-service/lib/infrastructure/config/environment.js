import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    RABBITMQ_URL: process.env.RABBITMQ_URL
  };

  // Check for missing environment variables
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
