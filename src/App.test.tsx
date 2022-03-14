import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome text', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/bienvenidos a/i);
  expect(welcomeElement).toBeInTheDocument();
});
