import { registerUser, loginUser, logoutUser } from '../services/auth.service.js';
import logger from '../config/logger.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body ?? {};

    const user = await registerUser(name, email, password);

    logger.info({ userId: user.id }, 'User registered successfully.');

    return res.status(201).json({
      message: 'User registered successfully.',
      user,
    });
  } catch (error) {
    const status = error.status || 500;
    const message =
      status === 500
        ? 'An unexpected error occurred. Please try again later.'
        : error.message;

    if (status === 500) {
      logger.error({ err: error }, 'Unexpected error during user registration.');
    } else {
      logger.warn({ status, message }, 'Registration failed.');
    }

    return res.status(status).json({ message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    const { token, user } = await loginUser(email, password);

    logger.info({ userId: user.id }, 'User logged in successfully.');

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user,
    });
  } catch (error) {
    const status = error.status || 500;
    const message =
      status === 500
        ? 'An unexpected error occurred. Please try again later.'
        : error.message;

    if (status === 500) {
      logger.error({ err: error }, 'Unexpected error during login.');
    } else {
      logger.warn({ status, message }, 'Login failed.');
    }

    return res.status(status).json({ message });
  }
}

export async function logout(req, res) {
  try {
    await logoutUser(req.user.jti, req.user.tokenExp);

    logger.info({ userId: req.user.id }, 'User logged out successfully.');

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    const status = error.status || 500;
    const message =
      status === 500
        ? 'An unexpected error occurred. Please try again later.'
        : error.message;

    logger.error({ err: error, userId: req.user?.id }, 'Unexpected error during logout.');

    return res.status(status).json({ message });
  }
}

