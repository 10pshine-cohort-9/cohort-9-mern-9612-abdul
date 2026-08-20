import { registerUser, loginUser, logoutUser } from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body ?? {};

    const user = await registerUser(name, email, password);

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

    return res.status(status).json({ message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body ?? {};

    const { token, user } = await loginUser(email, password);

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

    return res.status(status).json({ message });
  }
}

export async function logout(req, res) {
  try {
    await logoutUser(req.user.jti, req.user.tokenExp);
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    const status = error.status || 500;
    const message =
      status === 500
        ? 'An unexpected error occurred. Please try again later.'
        : error.message;

    return res.status(status).json({ message });
  }
}
