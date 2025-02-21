import Redis from "ioredis";
import environment from "../config/environment";

const redisClient = new Redis({
  host: "redis",
  port: parseInt(environment.REDIS_PORT || "6379", 10),
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

redisClient.on("connect", () => console.log("Connected to Redis"));

const invalidateMovieCache = async (movieId: string) => {
  try {
    if (redisClient.status === "ready") {
      await redisClient.del("latest_series");
      console.log(`Cache invalidated for movie ${movieId}`);
    }
  } catch (err) {
    console.error("Error invalidating movie cache:", err);
  }
};

export { redisClient, invalidateMovieCache };
