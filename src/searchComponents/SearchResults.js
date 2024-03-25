import React from 'react';
import Track from '../songComponents/Track';

function Filter({ searchTerm, onAddToPlayList, context }) {
  const mockTrack = [
    ["1", "Kad je najteže", "Smoke Mardeljano", "Divlje Dete", "uri1"],
    ["2", "Protuve", "Kojot", "Snajper Zum", "uri2"]
  ];

  const filteredTracks = mockTrack.filter(
    (track) =>
      track[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
      track[2].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Results</h2>
      <Track tracks={filteredTracks} onAddToPlayList={onAddToPlayList} context={context} />
    </div>
  );
}

export default Filter;
