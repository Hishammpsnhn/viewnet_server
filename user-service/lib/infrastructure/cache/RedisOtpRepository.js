import Redis from "ioredis";
import environment from "../config/environment.js";

class RedisOtpRegistry {
  constructor() {
    this.client = new Redis({
      host: "redis",
      port: parseInt(environment.REDIS_PORT || '6379', 10),
      connectTimeout: 5000,
      retryStrategy: (times) => {
        if (times >= 5) {
          console.error("Redis connection failed after multiple attempts.");
          return null;
        }
        console.error(
          `Redis connection failed. Retrying in ${Math.min(times * 500, 5000)} ms.`
        );
        return Math.min(times * 500, 5000);
      },
    });

    this.isReady = false;

    this.client.on("ready", () => {
      console.log("Connected to Redis successfully.");
      this.isReady = true;
    });

    this.client.on("error", (err) => {
      console.error(`Error connecting to Redis: ${err}`);
      this.isReady = false;
    });
  }

  async saveOtp(key, otp) {
    if (!this.isReady) return console.error("Redis is not connected.");
    await this.client.set(key, otp, "EX", 300);
  }

  async getOtp(key) {
    if (!this.isReady) return console.error("Redis is not connected.");
    return await this.client.get(key);
  }

  async deleteOtp(key) {
    if (!this.isReady) return console.error("Redis is not connected.");
    await this.client.del(key);
  }

  async get(key) {
    if (!this.isReady) return console.error("Redis is not connected.");
    const sub = await this.client.get(key);
    return sub ? JSON.parse(sub) : null;
  }

  async save(key, value) {
    if (!this.isReady) return console.error("Redis is not connected.");
    await this.client.set(key, JSON.stringify(value), "EX", 3600);
  }
}

export default RedisOtpRegistry;
