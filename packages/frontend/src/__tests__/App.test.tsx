import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';

describe('App Component', () => {
  it('should render without crashing', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <div>Home Page</div>,
          },
        ],
      },
    ]);

    render(<RouterProvider router={router} />);
    expect(screen.getByText('JO 2024')).toBeInTheDocument();
  });
});
