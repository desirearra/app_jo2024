import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import AccountPage from '../../pages/Account';

// Mock axios.get pour /api/users/me
jest.spyOn(axios, 'get').mockImplementation(url => {
  if (url === '/api/users/me') {
    return Promise.resolve({
      data: {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        orders: [
          {
            id: 'order-1',
            offerId: 'offer-1',
            status: 'PAID',
            totalAmount: '99.00',
            createdAt: new Date().toISOString(),
          },
        ],
        tickets: [
          {
            id: 'ticket-1',
            offerId: 'offer-1',
            finalKey: 'QR-123',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
  }
  return Promise.reject(new Error('not found'));
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('AccountPage', () => {
  it('affiche les infos du user, une commande et un ticket', async () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          user: {
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'USER',
          },
          token: '',
          login: jest.fn(),
          logout: jest.fn(),
          register: jest.fn(),
          loginWithToken: jest.fn(),
        }}
      >
        <BrowserRouter>
          <AccountPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
    // Loader
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    // Infos user
    await waitFor(() => expect(screen.getByText(/Test/)).toBeInTheDocument());
    expect(screen.getByText(/User/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    // Commande (onglet)
    await userEvent.click(screen.getByRole('button', { name: /mes commandes/i }));
    expect(screen.getByText(/Commande #order-1/)).toBeInTheDocument();
    // Ticket (onglet)
    await userEvent.click(screen.getByRole('button', { name: /mes billets/i }));
    expect(screen.getByText(/ID : ticket-1/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voir qrcode/i })).toBeInTheDocument();
  });
});
