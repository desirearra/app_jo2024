import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { EventList } from '../../../components/landing/EventList';
import * as api from '../../../lib/api';
import type { Event } from '../../../types';

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => jest.fn(),
}));

jest.mock('@/lib/api');

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Event 1',
    date: '2024-08-01',
    location: 'Paris',
    description: 'Desc 1',
    sport: 'Athlétisme',
    image: '/img1.jpg',
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-07-01T00:00:00Z',
    isDeleted: false,
  },
  {
    id: '2',
    name: 'Event 2',
    date: '2024-08-02',
    location: 'Lyon',
    description: 'Desc 2',
    sport: 'Natation',
    image: '/img2.jpg',
    createdAt: '2024-07-02T00:00:00Z',
    updatedAt: '2024-07-02T00:00:00Z',
    isDeleted: false,
  },
  {
    id: '3',
    name: 'Event 3',
    date: '2024-08-03',
    location: 'Marseille',
    description: 'Desc 3',
    sport: 'Football',
    image: '/img3.jpg',
    createdAt: '2024-07-03T00:00:00Z',
    updatedAt: '2024-07-03T00:00:00Z',
    isDeleted: false,
  },
  {
    id: '4',
    name: 'Event 4',
    date: '2024-08-04',
    location: 'Nice',
    description: 'Desc 4',
    sport: 'Basket',
    image: '/img4.jpg',
    createdAt: '2024-07-04T00:00:00Z',
    updatedAt: '2024-07-04T00:00:00Z',
    isDeleted: false,
  },
];

beforeEach(() => {
  (api.getEvents as jest.Mock).mockResolvedValue(mockEvents);
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('EventList Component', () => {
  it('renders without crashing', () => {
    render(<EventList />);
    // Test simple pour vérifier que le composant se rend sans erreur
  });

  it('affiche les 3 derniers événements', async () => {
    render(<EventList />);
    await waitFor(() => {
      expect(screen.getByText('Event 4')).toBeInTheDocument();
      expect(screen.getByText('Event 3')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
      expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    });
  });
});
