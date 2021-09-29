import RateLimit  from 'express-rate-limit'
import slowDown   from 'express-slow-down'
export const Limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 300, // limit each IP to 100 requests per windowMs 
    message: "Too many request created from this IP, please try again after an hour"
  });

export const AccLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 10, // start blocking after 5 requests 
    message: "Too many request created from this IP, please try again after an hour"
  });

export const InvLimiter = new RateLimit({
    windowMs: 10*60*1000, // 10 minutes 
    max: 20, // start blocking after 5 requests 
    message: "Too many request created from this IP, please try again after an hour"
  });

export const speedLimiter = slowDown({
    windowMs: 15*60*1000, // 15 minutes
    delayAfter: 300, // allow 100 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 100:
    message: "Too many request created from this IP, please try again after an hour"
  });