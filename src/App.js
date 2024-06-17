import './App.css';
import Input from './searchComponents/SearchBar';
import Filter from './searchComponents/SearchResults';
import PlayList from './songComponents/Playlist';
import { useEffect, useState } from 'react';

function App() {

  // SPOTIFY API
  const AUTH_URL = 'https://accounts.spotify.com/authorize';
  const CLIENT_ID = '4d719dad5f594f1a90e37d494ae646b5';
  const REDIRECT_URI = 'http://localhost:3000/spotify';
  const SCOPE = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  const STATE = 'abghwt67ot14nbg6';

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const connectSpotify = () => {
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyTokenExpiresAt');

    const authParams = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'token',
      scope: SCOPE,
      state: STATE
    });

    const authUrl = `${AUTH_URL}?${authParams}`;
    window.location.href = authUrl;

    const handleRedirect = () => {
      const urlParams = new URLSearchParams(window.location.hash.substr(1));
      const token = urlParams.get('access_token');
      const tokenType = urlParams.get('token_type');
      const expiresIn = Date.now() + parseInt(urlParams.get('expires_in')) * 1000; // Parse as integer
      const state = urlParams.get('state');

      console.log('Token:', token);
      console.log('Token Type:', tokenType);
      console.log('Expires In:', expiresIn);
      console.log('State:', state);

      localStorage.setItem('spotifyToken', token);
      localStorage.setItem('spotifyTokenExpiresAt', expiresIn);
  };

    handleRedirect();
  };
  

  // USE STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [playList, setPlayList] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");

  const handleSearchSubmit = (value) => {
    setSearchTerm(value);
  };

  const handleAddToPlayList = (track) => {
    const isTrackInPlaylist = playList.some((playlistTrack) => playlistTrack.id === track.id);

    if(!isTrackInPlaylist) {
      setPlayList([...playList, track]);
    } else {
      console.log("Track Already In Playlist");
    };
  };

  const handleRemoveFromPlayList = (trackToRemove) => {
    const updatedPlaylist = playList.filter((track) => track !== trackToRemove);
    setPlayList(updatedPlaylist);
  }

  const handleChangePlaylistName = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleSavePlayList = async () => {
    try {
      // Retrieve token and expiration timestamp from local storage
      const token = localStorage.getItem('spotifyToken');
      const expiresAt = localStorage.getItem('spotifyTokenExpiresAt');
  
      // Check if token is expired
      if (token && expiresAt) {
        const currentTime = new Date().getTime();
        if (currentTime >= parseInt(expiresAt)) {
          // Token expired, redirect to connectSpotify function
          connectSpotify();
          return;
        }
      } else {
        // Token or expiration timestamp not found, redirect to connectSpotify function
        connectSpotify();
        return;
      }
  
      // Continue with saving the playlist...
      console.log("TOKEN GOOD!");
      // Step 1: Get user's Spotify ID
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      console.log("USER DATA GOOD!");
      const userData = await response.json();
      const userId = userData.id;
  
      // Step 2: Create a new playlist
      const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'Playlist created using the Jammming web app, hope you return to our Jammming app'
        })
      });
      if (!createPlaylistResponse.ok) {
        throw new Error('Failed to create playlist');
      }
      const playlistData = await createPlaylistResponse.json();
      const playlistId = playlistData.id;
  
      // Step 3: Add tracks to the new playlist
      const addTracksResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: playList.map(track => track.uri) // Array of track URIs to add to the playlist
        })
      });
      if (!addTracksResponse.ok) {
        throw new Error('Failed to add tracks to playlist');
      }
  
      // Playlist successfully created and tracks added
      console.log('Playlist created and tracks added successfully');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  const handleResetPlayList = () => {
    setPlayList([]);
  };


  return (
    <>
      <div className="header">
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
      </div>

      <div className="profile">
        <button onClick={connectSpotify}>Connect Spotify</button>
      </div>

      <Input token={accessToken} onSearchSubmit={handleSearchSubmit} />

      {searchTerm ? <Filter searchTerm={searchTerm} 
      token={accessToken}
      onAddToPlayList={handleAddToPlayList} 
      connectSpotify={connectSpotify}
      context="searchResults" /> : 
      <p>Enter a search term.</p>}

      <PlayList 
      tracks={playList} 
      onRemoveFromPlayList={handleRemoveFromPlayList} 
      name={playlistName} 
      onChangePlaylistName={handleChangePlaylistName} 
      context="playlist"
      onResetPlayList={handleResetPlayList} 
      onSavePlayList={handleSavePlayList} />
    </>
  );
}

export default App;
