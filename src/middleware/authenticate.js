import createHttpError from 'http-errors';
import { Session } from '../models/session';
import { User } from '../models/user.js';


export const authenticate = (req, res, next) => {
  const { assessToken } = req.cookies;
  if(!assessToken) {
      throw createHttpError(401, 'Missing access token');
  }

  const session = Session.findOne({ accessToken: assessToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = session.accessTokenValidUntil < new Date(session.accessTokenValidUntil);
  if (isTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  const user = User.findById(session.userId);

  if (!user) {
    throw createHttpError(401);
  }

   req.user = user;
 };
