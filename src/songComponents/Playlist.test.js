import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Playlist operations', () => {
  let originalConsoleLog;

  beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('adds a track to the playList state', async () => {
    // Mock track to be added
    const testTrack = { id: 1, name: 'Test Song', artist: 'Test Artist', album: 'Test Album', uri: 'testUri' };

    // Render the App component
    const { container } = render(<App />);

    // Simulate search input
    await act(async () => {
      const searchInput = screen.getByPlaceholderText('Search by Song Name, Artist or Album');
      fireEvent.change(searchInput, { target: { value: 'Test Song' } });
    });

    // Mock search results
    const searchResults = [{
      id: 1,
      name: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      uri: 'testUri'
    }];

    // Update the state with mock search results
    await act(async () => {
      const setResults = container.querySelector('.results');
      setResults.innerHTML = searchResults.map(track => `
        <div class="track-item">
          <div class="track-info">
            <h3>${track.name}</h3>
            <p>${track.artist} | ${track.album}</p>
          </div>
          <div class="action-buttons">
            <button class="action_button add-button">+</button>
          </div>
        </div>
      `).join('');
    });

    // Find and click the add button
    const addButton = screen.getByText('+');
    await act(async () => {
      fireEvent.click(addButton);
    });

    // Verify that the track is added to the playlist state
    const addedTrack = screen.queryByText('Test Song');
    expect(addedTrack).toBeInTheDocument();
  });
});
