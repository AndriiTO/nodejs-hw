import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
// import crypto from 'node:crypto';
// import { use } from 'react';
// import { access } from 'node:fs';
// import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { createSession, setCookies } from '../services/auth.js';
//import { set } from 'mongoose';
import { Session } from '../models/session.js';
// import { secureHeapUsed } from 'node:crypto';


export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const exisistingUser = await User.findOne({ email });
  if (exisistingUser) {
    throw createHttpError(400 ,'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword
  });

  const newSession = await createSession(newUser._id);

  setCookies(res, newSession);

  res.status(201).json({newUser});

  // const user = await User.create({ email, password: hashedPassword });
  // res.status(201).json({ status: 201, message: 'User created', userId: user._id });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }



  const newSession = await createSession(user._id);

  setCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const {sessionId} = req.cookies;
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');


  res.status(200).send();
};

export const refreshUserSession = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = new Date(session.refreshTokenValidUntil) < new Date(session.refreshTokenValidUntil  );
  if (isTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }
  await session.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = await createSession(session.userId);

  setCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });

 };
