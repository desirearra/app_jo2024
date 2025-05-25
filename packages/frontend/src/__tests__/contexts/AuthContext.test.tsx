import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('AuthContext', () => {
  it('should handle login and logout', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
    };

    const TestComponent = () => {
      const { login, logout, isAuthenticated, user } = useAuth();
      return (
        <div>
          <button onClick={() => login(mockUser)}>Login</button>
          <button onClick={logout}>Logout</button>
          <div data-testid="auth-status">
            {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </div>
          {user && <div data-testid="user-info">{user.email}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Vérifier l'état initial
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();

    // Login
    await act(async () => {
      await user.click(screen.getByText('Login'));
    });

    // Vérifier l'état après login
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent(mockUser.email);
    });

    // Logout
    await act(async () => {
      await user.click(screen.getByText('Logout'));
    });

    // Vérifier l'état après logout
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });
  });
});
