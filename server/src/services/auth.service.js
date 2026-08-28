import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserByEmailWithPassword, createUser } from '../models/user.model.js';
import { jwtSecret, jwtExpiresIn } from '../config/jwt.js';
import { revokeToken } from '../models/revoked_token.model.js';
import { AppError } from '../errors/AppError.js';

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

function validateRegistrationInput(name, email, password) {
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Name is required.';
  }
  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email is required.';
  }
  if (typeof password !== 'string' || password.trim() === '') {
    return 'Password is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please provide a valid email address.';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  return null;
}

function validateLoginInput(email, password) {
  if (typeof email !== 'string' || email.trim() === '') {
    return 'Email is required.';
  }
  if (typeof password !== 'string' || password.trim() === '') {
    return 'Password is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please provide a valid email address.';
  }

  return null;
}

export async function registerUser(name, email, password) {
  const validationError = validateRegistrationInput(name, email, password);
  if (validationError) {
    throw new AppError(validationError, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let newUser;
  try {
    newUser = await createUser(name.trim(), normalizedEmail, hashedPassword);
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('An account with this email already exists.', 409);
    }
    throw error;
  }

  return newUser;
}

export async function loginUser(email, password) {
  const validationError = validateLoginInput(email, password);
  if (validationError) {
    throw new AppError(validationError, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await findUserByEmailWithPassword(normalizedEmail);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const jti = randomUUID();

  const token = jwt.sign(
    { id: user.id, jti },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function logoutUser(jti, tokenExp) {
  await revokeToken(jti, new Date(tokenExp * 1000));
}
