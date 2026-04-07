import Session from '../models/session.js';
import crypto from 'node:crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';



export const createSession = async (userId) => {
return  Session.create({
    userId,
    accessToken: crypto.randomBytes(32).toString('hex'),
    refreshToken: crypto.randomBytes(32).toString('hex'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY)
  });

};


export const setCookies = (res, session) => {
 res.cookie('accessToken', Session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: FIFTEEN_MINUTES
  });
   res.cookie('refreshToken', Session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY
  });
  res.cookie('sessionId', Session._id, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ONE_DAY
  });
};
