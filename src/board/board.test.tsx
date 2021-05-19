import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from './board';

test('This should have one board block', () => {
    render(<Board numberOfRows={3} />);
    const boardElement = screen.getByTestId('board')
    expect(boardElement).toBeInTheDocument();
  });
  