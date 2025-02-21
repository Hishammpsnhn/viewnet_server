import dotenv from "dotenv";
dotenv.config();

export default (() => {
  console.log("[env] Environment variables have been injected from `.env`");

  const env = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    GATEWAY_URL: process.env.GATEWAY_URL ,
    REDIS_PORT:process.env.REDIS_PORT 
  };
  

  // Check for missing environment variables
  const missingVars = Object.entries(env)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(`[env] Warning: Missing environment variables - ${missingVars.join(", ")}`);
    process.exit(1);
  } else {
    console.log("[env] All required environment variables are set.");
  }

  return env;
})();
