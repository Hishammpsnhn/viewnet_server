import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY,
    STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
  };

  return env;
})();
