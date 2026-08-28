import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';


jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Page', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /Welcome back/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    loginUser.mockResolvedValueOnce({
      token: 'fake-token',
      user: { id: 1, name: 'Test User' },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/Email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: 1, name: 'Test User' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('displays error on failed login', async () => {
    loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/Email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'wrongpassword');
    
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to signup when create account button is clicked', () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });
});
