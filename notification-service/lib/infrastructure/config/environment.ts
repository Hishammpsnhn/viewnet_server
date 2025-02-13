import dotenv from 'dotenv';
dotenv.config();

export default (() => {
    console.log("[env] Environment variables have been injected from `.env`");

    const env = {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
    
    };

    return env;
})();