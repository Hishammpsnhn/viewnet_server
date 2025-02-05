import Redis from 'ioredis';

const redisClient = new Redis({
  host: "redis", 
  port: 6379,
 
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err:any) => console.error('Redis Error:', err));

const invalidateMovieCache = async (movieId:string) => {
  try {
    //await redisClient.del(`movie_meta_${movieId}`); 
    await redisClient.del('latest_series')
    console.log(`Cache invalidated for movie ${movieId}`);
  } catch (err) {
    console.error('Error invalidating movie cache:', err);
  }
};

export  {redisClient,invalidateMovieCache};
