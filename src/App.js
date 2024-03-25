import './App.css';
import Input from './searchComponents/SearchBar';
import Filter from './searchComponents/SearchResults';
import PlayList from './songComponents/Playlist';
import { useState } from 'react';

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [playList, setPlayList] = useState([]);
  const [playlistName, setPlaylistName] = useState("Your Playlist");
  const [uriArray, setUriArray] = useState([]);

  const handleSearchSubmit = (value) => {
    setSearchTerm(value);
  };

  const handleAddToPlayList = (track) => {
    const isTrackInPlaylist = playList.some((playlistTrack) => playlistTrack[0] === track[0]);

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
      <Input onSearchSubmit={handleSearchSubmit} />

      {searchTerm ? <Filter searchTerm={searchTerm} 
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
