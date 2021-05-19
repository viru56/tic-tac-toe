import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders a <Header />', () => {
  const {getByTestId}  =render(<App />);
  const headerComponent = getByTestId('app-header');
  expect(headerComponent).toBeInTheDocument()
});

test('App renders a <Board />', () => {
  render(<App />);
  const boardComponent = screen.getByTestId('app-board');
  expect(boardComponent).toBeInTheDocument();
});

test('App renders a <NameDialog />', () => {
  render(<App />);
  const NameDialogComponent = screen.getByTestId('app-name-dialog');
  expect(NameDialogComponent).toBeInTheDocument();
});
