import { registerUser, loginUser, logoutUser } from '../services/auth.service.js';
import logger from '../config/logger.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};

    const user = await registerUser(name, email, password);

    logger.info({ userId: user.id }, 'User registered successfully.');

    return res.status(201).json({
      message: 'User registered successfully.',
      user,
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
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
    return next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await logoutUser(req.user.jti, req.user.tokenExp);

    logger.info({ userId: req.user.id }, 'User logged out successfully.');

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    return next(error);
  }
}
