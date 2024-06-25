import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './SearchBar'; // Make sure the import path is correct

// Mock the onSearchSubmit function
const mockOnSearchSubmit = jest.fn();

beforeEach(() => {
  mockOnSearchSubmit.mockClear();
});

test('calls onSearchSubmit with the search value when form is submitted', () => {
  const { container } = render(<Input token="test-token" onSearchSubmit={mockOnSearchSubmit} />);

  const inputElement = screen.getByPlaceholderText('Search by Song Name, Artist or Album');
  const formElement = container.querySelector('.search-form'); // Select the form using class name

  // Simulate user typing in the input field
  fireEvent.change(inputElement, { target: { value: 'Test Song' } });

  // Simulate form submission
  fireEvent.submit(formElement);

  // Check if onSearchSubmit was called with the correct value
  expect(mockOnSearchSubmit).toHaveBeenCalledWith('Test Song');
  expect(mockOnSearchSubmit).toHaveBeenCalledTimes(1);
});
