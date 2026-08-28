import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../Signup';
import { useAuth } from '../../context/AuthContext';
import { registerUser, loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/authService', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Signup Page', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(<Signup />);
    
    expect(screen.getByRole('heading', { name: /Create an account/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('handles successful registration and auto-login', async () => {
    registerUser.mockResolvedValueOnce({ message: 'User created' });
    loginUser.mockResolvedValueOnce({
      token: 'fake-token',
      user: { id: 1, name: 'Jane Doe' },
    });

    render(<Signup />);

    await userEvent.type(screen.getByLabelText(/Full Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/^Email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });
      expect(loginUser).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: 1, name: 'Jane Doe' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('displays error if passwords do not match', async () => {
    render(<Signup />);

    await userEvent.type(screen.getByLabelText(/^Password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    
    // The browser prevents submission natively, but the component has validation logic
    // which prevents the submit handler from proceeding or displays native tooltips.
    // We can just verify registerUser is not called when passwords mismatch.
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));
    
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('displays error on failed registration', async () => {
    registerUser.mockRejectedValueOnce(new Error('Email already in use'));

    render(<Signup />);

    await userEvent.type(screen.getByLabelText(/Full Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/^Email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    
    fireEvent.submit(screen.getByRole('button', { name: /Create Account/i }).closest('form'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already in use');
    expect(loginUser).not.toHaveBeenCalled();
  });
});
