import React from 'react';
import Track from './Track';

const TrackList = () => {
  const mockTrack = [
    ["Oseti kaplare", "Ruda, Kojot", "Snajper Zoom", "4:49", "uri1"],
    ["Saolin je šou", "Kojot", "Šaolin", "2:49", "uri2"]
  ];

  return (
    <div>
      <h2>Top 10 Songs on Spotify</h2>
      <Track tracks={mockTrack} />
    </div>
  );
};

export default TrackList;
