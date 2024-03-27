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
  const SCOPE = 'user-read-private user-read-email';
  const STATE = 'abghwt67ot14nbg6';

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const connectSpotify = () => {
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
      const expiresIn = urlParams.get('expires_in');
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
  const [uriArray, setUriArray] = useState([]);

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

  const handleSavePlayList = () => {
    setUriArray(playList.map(track => track[4]));
  };

  const handleResetPlayList = () => {
    setPlayList([]);
  };


  return (
    <>
      <button onClick={connectSpotify}>Connect Spotify</button>

      <Input token={accessToken} onSearchSubmit={handleSearchSubmit} />

      {searchTerm ? <Filter searchTerm={searchTerm} 
      token={accessToken}
      onAddToPlayList={handleAddToPlayList} 
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
