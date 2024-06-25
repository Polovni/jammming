import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import App from './App';

// Mocking localStorage
const mockLocalStorage = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mocking global fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  fetch.mockImplementation((url) => {
    console.log('Fetch called with URL:', url);
    if (url.includes('https://api.spotify.com/v1/me')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'userId', display_name: 'John Doe', images: [{ url: 'testUrl' }] })
      });
    }
    if (url.includes('https://api.spotify.com/v1/search')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          tracks: {
            items: [
              { id: '1', name: 'Song1', artists: [{ name: 'Artist1' }], album: { name: 'Album1' }, uri: 'uri1' },
              { id: '2', name: 'Song2', artists: [{ name: 'Artist2' }], album: { name: 'Album2' }, uri: 'uri2' }
            ]
          }
        })
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
  window.localStorage.clear();
  jest.spyOn(window.localStorage, 'setItem');
  jest.spyOn(window.localStorage, 'getItem');

  // Mocking window.location.href to avoid JSDOM errors
  delete window.location;
  window.location = { href: jest.fn() };
});

it('fetches user data if token is valid', async () => {
  localStorage.setItem('spotifyToken', 'validToken');
  localStorage.setItem('spotifyTokenExpiresAt', (new Date().getTime() + 10000).toString());

  await act(async () => {
    render(<App />);
  });

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('https://api.spotify.com/v1/me', expect.anything());
    expect(screen.getByText('Hello "John Doe"')).toBeInTheDocument();
  });
});

it('redirects to Spotify connect if token is invalid or expired', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText('Connect Spotify')).toBeInTheDocument();
});

it('changes playlist name', async () => {
  await act(async () => {
    render(<App />);
  });

  const playlistNameInput = screen.getByDisplayValue('Your Playlist');
  fireEvent.change(playlistNameInput, { target: { value: 'New Playlist Name' } });
  expect(playlistNameInput.value).toBe('New Playlist Name');
});
