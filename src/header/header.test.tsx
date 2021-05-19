import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './header';

test('renders Tic Tac Toe app title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/Tic tac Toe/i);
    expect(titleElement).toBeInTheDocument();
  });
  