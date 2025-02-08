import Redis from "ioredis";

class RedisOtpRegistry {
  constructor() {
    this.client = new Redis({
      host: "redis",
      port: 6379,
    });

    this.client.on("error", (err) =>
      console.error(`Error connecting to Redis: ${err}`)
    );
  }

  async saveOtp(key, otp) {
    let res = await this.client.set(key, otp, "EX", 300);
    const savedOtp = await this.client.get(key);
    console.log("Saved OTP:", savedOtp);
  }

  async getOtp(key) {
    return await this.client.get(key);
  }

  async deleteOtp(key) {
    await this.client.del(key);
  }

  // store subscriptions details
  async get(key) {
    const sub = await this.client.get(key);
    console.log("cached",key,sub)
    return JSON.parse(sub);
  }
  async save(key, value) {
   const plan =  await this.client.set(key, JSON.stringify(value), "EX", 3600);
   console.log("cache added", key,value);
  }
}

export default RedisOtpRegistry;
