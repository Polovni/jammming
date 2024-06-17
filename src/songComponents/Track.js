import React from 'react';

function Track({ tracks, onAddToPlayList, onRemoveFromPlayList, context }) {
  return (
    <div className="track">
      {tracks.map(track => (
        <div key={track.id}>
          <h3>Name: {track.name}</h3>
          <p>Artist: {track.artist}</p>
          <p>Album: {track.album}</p>
          {context === 'playlist' && (
            <button className="action_button" onClick={() => onRemoveFromPlayList(track)}>-</button>
          )}
          {context === 'searchResults' && (
            <button className="action_button" onClick={() => onAddToPlayList(track)}>+</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Track;
