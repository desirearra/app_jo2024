import { render, screen } from '@testing-library/react';
import { Button } from '../../../components/ui/button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });
});
