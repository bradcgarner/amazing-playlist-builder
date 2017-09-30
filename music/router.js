'use strict';
// endpoint is /api/music/

const express = require('express');
const router = express.Router();
const { Artist, Playlist } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

function artistIsValid(artist) {
  let validArtist = {};
  if (artist.artistName && typeof artist.artistName === "string") {
    validArtist = Object.assign({}, artist);
  }
  return validArtist;
}

// @@@@@@@@@@@@ IMPROVE: SHOW ONLY SONGS @@@@@@@@@@
// search for songs

router.get('/songs', (req, res) => {
  Artist
    .find({ 'albums.songs.title': req.query.song })
    .limit(20)
    .then(artistList => {
      res.json(
        artistList.map(
          (artistList) => artistList.apiRepr())
      );
    })
    .catch(
    err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// @@@@@@@@@@@@ IMPROVE: SHOW ONLY ALBUMS @@@@@@@@@@
// search for albums
router.get('/albums', (req, res) => {
  Artist
    .find({ 'albums.title': req.query.album })
    .limit(20)
    .then(artistList => {
      res.json({
        artistList: artistList.map(
          (artistList) => artistList.apiRepr())
      });
    })
    .catch(
    err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// get artist list
router.get('/artists', (req, res) => {
  Artist
    .find()
    .limit(20)
    .then(artistList => {
      res.json({
        artistList: artistList.map(
          (artistList) => artistList.apiRepr())
      });
    })
    .catch(
    err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// add artists
router.post('/artists', jwtAuth, (req, res) => {
  if (artistIsValid(req.body)) {
    let validArtist = artistIsValid(req.body);
    Artist
      .create(validArtist)
      .then(playlist => res.status(201).json(playlist.apiRepr()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ammend artists
router.put('/artists/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and body id values must match'
    });
  }
  const updated = {};
  const updateableFields = ['artistName', 'albums'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  return Artist
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedArtist => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'something went wrong' }));
});

// get artist by id
router.get('/artists/:id', (req, res) => {
  Artist
    .findById(req.params.id)
    .then(artist => {
      return res.status(200).json(artist.apiRepr());
    })
    .catch(err => {
      console.log('err', err);
      return res.status(500).json({ message: 'something went wrong' });
    });
});

// delete artist by id
router.delete('/artists/:id', jwtAuth, (req, res) => {
  Artist
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`deleted artist data with id \`${req.params.ID}\``);
      res.status(204).end();
    })
    .catch(err => {
      console.log('err', err);
      return res.status(500).json({ message: 'something went wrong' });
    });
});

// create a new playlist
router.post('/playlists', jwtAuth, (req, res) => {
  const requiredFields = ['playlistName'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['playlistName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const sizedFields = {
    playlistName: { min: 1, max: 72 }
  };
  const tooSmallField = Object.keys(sizedFields).find(field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { playlistName } = req.body;

  return Playlist.find({ playlistName })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Playlist name already taken',
          location: 'playlistName'
        });
      }
      return '';
    })
    .then(playlist => {
      return Playlist.create({ playlistName });
    })
    .then(playlist => {
      let playlistRepr = playlist.map(playlist => {
        return playlist.apiRepr();
      });
      return res.json(playlistRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// update a playlist
router.put('/playlists/:id', jwtAuth, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and body id values mush match'
    });
  }
  const updated = {};
  const updateableFields = ['songs', 'playlistName'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  return Playlist
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPlaylist => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'something went wrong' }));

});
// end router.put (update a playlist)

// get a playlist by id
router.get('/playlists/:id', jwtAuth, (req, res) => {
  Playlist
    .findById(req.params.id)
    .then(playlist => {
      return res.status(200).json(playlist.apiRepr());
    })
    .catch(err => {
      res.status(500).json({ error: 'something went horribly wrong' });
    });
});

// access a users playlist by id.
router.get('/playlists/users/:id', jwtAuth, (req, res) => {
  Playlist
    .find({ 'user': req.params.id })
    .then(playlist => {
      let playlistRepr = playlist.map(playlist => {
        return playlist.apiRepr();
      });
      return res.json(playlistRepr());
    })
    .catch(err => {
      res.status(500).json({ error: 'something went horribly wrong' });
    });
});

// delete a playlist by id
router.delete('/playlists/:id', jwtAuth, (req, res) => {
  Playlist
    .findByIdAndRemove(req.params.id)
    .then(() => {
      return res.status(204).json({ message: 'sucess yo' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'wrong on delete' });
    });
});


// vote on a song
router.put('/artists/:artistId/albums/:albumId/songs/:songId', jwtAuth, (req, res) => {
  let { artistId, albumId, songId } = req.params;
  return Artist
    .findById(artistId)
    .then(artist => {
      // TOTALLY HORRIFIC !!!!!!!!!!!!!!!!!!!!!!
      artist.albums.forEach(album => {
        if (album._id.toString() === albumId) {
          album.songs.forEach(song => {
            if (song._id.toString() === songId) {
              song.votes = song.votes + 1;
            }
          });
        }
      });
      // CHANGE THIS MESS ^^^^^^^^^^^^^^^^^
      return artist.save();
    })
    .then(() => {
      res.status(204).json({ message: 'you upvoted' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'wrong on vote update' });
    });
}); 

module.exports = { router };
