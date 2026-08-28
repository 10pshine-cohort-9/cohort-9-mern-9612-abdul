import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';


const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
      <span data-testid="user-info">{user ? user.name : 'No User'}</span>
      <button onClick={() => login('mock-token', { name: 'Test User' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides unauthenticated state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  it('updates state on login and saves to localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('Test User');
    
    expect(window.localStorage.getItem('auth_token')).toBe('mock-token');
    expect(JSON.parse(window.localStorage.getItem('auth_user'))).toEqual({ name: 'Test User' });
  });

  it('clears state on logout and removes from localStorage', () => {
    window.localStorage.setItem('auth_token', 'initial-token');
    window.localStorage.setItem('auth_user', JSON.stringify({ name: 'Initial User' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
    expect(window.localStorage.getItem('auth_token')).toBeNull();
    expect(window.localStorage.getItem('auth_user')).toBeNull();
  });
});
