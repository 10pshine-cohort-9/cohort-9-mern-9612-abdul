import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../models/user.model.js';

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

function validateRegistrationInput(name, email, password) {
  if (!name || name.trim() === '') {
    return 'Name is required.';
  }
  if (!email || email.trim() === '') {
    return 'Email is required.';
  }
  if (!password || password.trim() === '') {
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

export async function registerUser(name, email, password) {
  const validationError = validateRegistrationInput(name, email, password);
  if (validationError) {
    const error = new Error(validationError);
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await createUser(name.trim(), normalizedEmail, hashedPassword);

  return newUser;
}
