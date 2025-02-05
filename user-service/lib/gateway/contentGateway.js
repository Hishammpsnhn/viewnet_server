import Redis from "ioredis";
import axios from 'axios';

class ContentGateway {
  constructor() {
    this.axios = axios;
    this.redis = new Redis({
      host: 'redis',
      port: 6379,

    });
  }

  async fetchContentDetails(id) {
    console.log("Calling for content details with id", id);

    // Check Redis cache first
    const cachedContent = await this.redis.get(`movie_meta_${id}`);
    if (cachedContent) {
      console.log("Serving from Redis cache...");
      return JSON.parse(cachedContent);  // Return cached content
    }

    // If not cached, fetch from external API
    try {
      const response = await this.axios.get(`http://content-service:5004/movies/meta/${id}`);
      const contentData = response.data;

      // Cache the result for future requests (expire in 24 hours)
      await this.redis.setex(`movie_meta_${id}`, 86400, JSON.stringify(contentData));  // 86400 seconds = 1 day

      console.log("Serving from API and caching it...");
      return contentData;
    } catch (error) {
      console.error('Error fetching content details:', error.message);
      return null;
    }
  }
}

export default ContentGateway;
