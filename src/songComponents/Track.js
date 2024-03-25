import React from 'react';

function Track({ tracks, onAddToPlayList, onRemoveFromPlayList, context }) {
  return (
    <div>
      <ul>
        {tracks.map(track => (
          <li key={track[0]}>
            <p>Name: {track[1]}</p>
            <p>Artist: {track[2]}</p>
            <p>Album: {track[3]}</p>
            {context === 'playlist' && (
              <button onClick={() => onRemoveFromPlayList(track)}>-</button>
            )}

            {context === 'searchResults' && (
              <button onClick={() => onAddToPlayList(track)}>+</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Track;
