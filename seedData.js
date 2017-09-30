'use strict';

const { app, runServer, closeServer } = require('./server');
const { User } = require('./users');
const { Artist, Playlist } = require('./music');
const faker = require('faker');
const fakeArtists = []; 
const fakeUsers = [];    
let fakeSongIds = [];
let userIds = [];
const fakePlaylists = []; 
const userCt = 10;
let songCt;

function fakeSongList() {
  return [
    { title: faker.company.bs()},
    { title: faker.commerce.color()},
    { title: faker.commerce.productAdjective()},
    { title: faker.address.city()},
    { title: faker.commerce.department()},
    { title: faker.company.catchPhraseNoun()},
    { title: faker.company.catchPhraseDescriptor()},
    { title: faker.hacker.verb() + '#' + Math.floor(faker.finance.amount())},
    { title: faker.company.bs()}
  ];
}

function fakeAlbumList() {
  return [
    { title: faker.commerce.color(),
      songs: fakeSongList()
    },
    { title: faker.commerce.productAdjective(),
      songs: fakeSongList()
    },
    { title: faker.commerce.department(),
      songs: fakeSongList()
    },
    { title: faker.company.catchPhraseDescriptor(),      songs: fakeSongList()
    },
  ];
}

function fakeGenres() {
  let arrayofGenres = [ 
    'Hip Hop', 'Folk', 'Classical', 'Heavy Metal', 'Punk', 'New Wave', 'Pop', 'Reggae', 'Rap', 'Country', 'Bluegrass', 'R&B', 'Motown Revival', 'Doo Wop', 'Disco', 
    'Crunk', 'Trap', 'Jazz', 'Electronica', 'Soul'
  ];
  let randomNumber = Math.floor(Math.random() * 10); 
  return [ 
    arrayofGenres[randomNumber], 
    arrayofGenres[randomNumber + 2],
    arrayofGenres[randomNumber + 3], 
    arrayofGenres[randomNumber + 10]
  ];
}

function fakeArtist() {
  return {
    artistName : faker.company.companyName(),
    albums : fakeAlbumList(),
    genres : fakeGenres()
  };
}

function fakeUser() {
  return {
    username : faker.internet.userName(),
    password : faker.internet.password(),
    firstName : faker.name.firstName(),
    lastName : faker.name.lastName()
  };
}

function fakePlaylist() {
  return {
    playlistName : faker.company.bsAdjective(),
    user: 'testUser',    
    songs : []
  };
}
    
return runServer()
  .then(() => {
    return Artist.remove({});
  }) 
  .then(() => {
    return User.remove({});
  }) 
  .then(() => {        
    return Playlist.remove({});
  }) 
  .then(() => {        
    for (let i=0; i<10; i++){
      fakeArtists.push(fakeArtist());
    }
    return fakeArtists;
  })
  .then(() => {
    return Artist.insertMany(fakeArtists);
  })
  .then(artists => {
    artists.forEach(artist=> {
      artist.albums.forEach(album=>{
        let songArray = album.songs.map(song=> {
          return song._id;
        });
        fakeSongIds = fakeSongIds.concat(songArray);
        songCt = fakeSongIds.length;      
      });
    });
    return fakeSongIds;
  })
  .then(()=>{
    for (let i=0; i<userCt; i++){
      fakeUsers.push(fakeUser());
    }
    return User.insertMany(fakeUsers);
  })
  .then(users => {
    return userIds = users.map(user => {
      return user._id;
    });
  })
  .then(()=>{
    let songsPerUser = Math.floor(songCt/userCt);
    let rotations = Math.floor(songCt/songsPerUser) - 3;

    for (let i=0; i<userCt; i++){
      fakePlaylists.push(fakePlaylist());
      fakePlaylists[i].user = userIds[i]; 
      let songIndices = [];
      for (let skip = 0;skip<songsPerUser;skip++)
        fakePlaylists[i].songs.push(fakeSongIds[i+(skip*rotations)].id);
    }
    return fakePlaylists;
  })
  .then(() => {
    return Playlist.insertMany(fakePlaylists);
  })
  .then(()=>{
    return closeServer();        
  });