import React from 'react';

function Track({ tracks, onAddToPlayList, onRemoveFromPlayList, context }) {
  return (
    <div>
      {tracks.map(track => (
        <div className="track-item" key={track.id}>
          <div className="track-info">
            <h3>{track.name}</h3>
            <p>{track.artist} | {track.album}</p>
          </div>
          <div className="action-buttons">
            {context === 'playlist' && (
              <button className="action_button" onClick={() => onRemoveFromPlayList(track)}>-</button>
            )}
            {context === 'searchResults' && (
              <button className="action_button" onClick={() => onAddToPlayList(track)}>+</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Track;
