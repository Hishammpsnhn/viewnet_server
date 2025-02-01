import dotenv from 'dotenv';
dotenv.config();

export default (() => {
    console.log("[env] Environment variables have been injected from `.env`");

    const env = {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_BUCKET: process.env.AWS_BUCKET,
        AWS_REGION:process.env.AWS_REGION,
        AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME
    };

    return env;
})();