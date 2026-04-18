import createHttpError from 'http-errors';
import  User  from '../models/user.js';
import bcrypt from 'bcrypt';
// import crypto from 'node:crypto';
// import { use } from 'react';
// import { access } from 'node:fs';
// import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { createSession, setSessionCookies } from '../services/auth.js';
//import { set } from 'mongoose';
import { Session } from '../models/session.js';
// import { secureHeapUsed } from 'node:crypto';
import { sendEmail } from '../utils/sendMail.js';
// import { JWT_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';
// import { template } from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';


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

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);

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

 await Session.deleteMany({ userId: user._id });

  const newSession = await createSession(user._id);

 setSessionCookies (res, newSession);

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


  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });


  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isTokenExpired = new Date(session.refreshTokenValidUntil) < new Date();
  if (isTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }
  await session.deleteOne();

  const newSession = await createSession(session.userId);

  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });

 };



export const requestResetEmail = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({
      message: 'Password reset email sent successfully'
    });
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }

);

  const templatePath = path.resolve('src/templates/reset-password-email.html');

  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });


  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      html,
    });
  } catch {
    throw createHttpError(500, 'Failed to send email');
  }
  res.status(200).json({ message: 'Password reset email sent successfully' });
};


export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);

    //  catch (error)
  } catch {

    throw createHttpError(401, 'Invalid token');
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });
   if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne(
    { _id: user._id },
    { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({ message: 'Password reset successfully' });

};
