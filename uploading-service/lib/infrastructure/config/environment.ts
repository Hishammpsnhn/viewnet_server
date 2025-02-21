import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    SQS_QUEUE_URL: process.env.SQS_QUEUE_URL,
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    CLOUDFRONT_KEY: process.env.CLOUDFRONT_KEY,
    REDIS_PORT:process.env.REDIS_PORT,
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
