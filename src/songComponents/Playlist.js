import Track from "./Track";

function PlayList({ tracks, onRemoveFromPlayList, name, onChangePlaylistName, context, onResetPlayList, onSavePlayList }) {
    return (
        <div>
            <h2 className="playlist-name">
                <input className="input-playlist-name" type="text" value={name} onChange={onChangePlaylistName} />
            </h2>
            {tracks && Array.isArray(tracks) && tracks.length > 0 ? (
            <Track tracks={tracks} onRemoveFromPlayList={onRemoveFromPlayList} context={context} />
            ) : (
            <p>No Songs Added.</p>
            )}
            <button onClick={onSavePlayList}>Save Playlist To Spotify</button>
            <button onClick={onResetPlayList}>Reset Playlist</button>
        </div>
    );
};

export default PlayList;