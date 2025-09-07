// import Redlock  from 'redlock';
// import IORedis from "ioredis";
// import { serverConfig } from ".";

// export const redisClient:any  = new IORedis(serverConfig.REDIS_SERVER_URL);

// export const redlock = new Redlock([redisClient], {
//     driftFactor: 0.01, // time in mss
//     retryCount:  10,
//     retryDelay:  200, // time in ms
//     retryJitter:  200, // time in ms
// })

// src/config/redis.config.ts
import Redlock from "redlock";
import IORedis, { RedisOptions } from "ioredis";
import { serverConfig } from ".";

// Build redis options
const redisOptions: RedisOptions = {
  // parse REDIS_SERVER_URL if given (redis://user:pass@host:port/db)
  // or fall back to host/port/db
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD ,
  db: Number(process.env.REDIS_DB) || 1,             // <-- use DB 1 for this project
  // enableReadyCheck: true,
  // maxRetriesPerRequest: null,
};
console.log("[redis config]", redisOptions);
// Prefer URL if available
export const redisClient:any = serverConfig.REDIS_SERVER_URL
  ? new IORedis(serverConfig.REDIS_SERVER_URL, { db: redisOptions.db })
  : new IORedis(redisOptions);

// Add listeners for debugging & reliability
redisClient.on("connect", () => {
  console.log("[redis] connecting…");
});

redisClient.on("ready", async () => {
  try {
    const pong = await redisClient.ping();
    console.log(`[redis] ready (PING=${pong})`);
  } catch (err) {
    console.error("[redis] ping failed:", err);
  }
});


// Redlock for distributed locks
export const redlock = new Redlock([redisClient], {
  driftFactor: 0.01, // clock drift factor
  retryCount: 10,    // retry attempts
  retryDelay: 200,   // time in ms
  retryJitter: 200,  // random ms added to retry delay
});

