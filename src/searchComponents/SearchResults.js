import React, { useState, useEffect } from 'react';
import Track from '../songComponents/Track';

function Filter({ searchTerm, token, onAddToPlayList, context, connectSpotify }) {
  const [filteredJson, setFilteredJson] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token == null) {
          console.log('Token not available');
          connectSpotify();
          return;
        }

        // Check if the token is expired
        const expiresAt = localStorage.getItem('spotifyTokenExpiresAt');
        if (!expiresAt || new Date().getTime() > parseInt(expiresAt)) {
          console.log('Token expired');
          connectSpotify();
          return;
        }

        const query = 'https://api.spotify.com/v1/search?q=' + searchTerm + '&type=track&limit=20';
        const response = await fetch(query, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const tracks = data.tracks.items.map(item => ({
          id: item.id,
          name: item.name,
          artist: item.artists.map(artist => artist.name).join(', '),
          album: item.album.name,
          uri: item.uri
        }));
        setFilteredJson(tracks);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
  }, [searchTerm, token]);

  return (
    <div>
      <h2>Results</h2>
      <Track
        tracks={filteredJson}
        onAddToPlayList={onAddToPlayList}
        context={context}
      />
    </div>
  );
}

export default Filter;
