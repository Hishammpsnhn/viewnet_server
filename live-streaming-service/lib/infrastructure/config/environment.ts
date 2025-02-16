import dotenv from 'dotenv';
dotenv.config();

export default (() => {
    console.log("[env] Environment variables have been injected from `.env`");

    const env = {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        MUX_TOKEN_ID:process.env.MUX_TOKEN_ID,
        MUX_TOKEN_SECRET:process.env.MUX_TOKEN_SECRET,
        MUX_SECRET: process.env.MUX_SECRET,
      
    };

    return env;
})();