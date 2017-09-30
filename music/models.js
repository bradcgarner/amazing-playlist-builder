'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// @@@@@@@@@@@@@ ARTISTS @@@@@@@@@@@@@@@

const ArtistSchema = mongoose.Schema({
  artistName: { type: String, required: true, unique: true },
  albums: [{
    title: { type: String },
    songs: [{
      title: { type: String },
      votes: { type: Number, default: 0 }
    }]
  }],
  genres: [{ type: String }]
});

ArtistSchema.methods.apiRepr = function () {
  return {
    artistName: this.artistName,
    genres: this.genres,
    albums: this.albums,
    _id: this.id
  };
};

const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);

// @@@@@@@@@@@@@ PLAYLISTS @@@@@@@@@@@@@@@

const PlaylistSchema = mongoose.Schema({
  playlistName: { type: String, required: true },
  songs: [{
    id: { type: String },
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

PlaylistSchema.methods.apiRepr = function () {
  return {
    playlistName: this.playlistName,
    songs: this.songs, 
    id: this._id
  };
};

const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

module.exports = { Artist, Playlist };
