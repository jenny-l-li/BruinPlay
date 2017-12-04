var express = require("express");
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql', 'root', "my-secret-pw", {
	host: 'localhost',
	dialect: 'mysql'
});

sequelize
	.authenticate()
	.then(function() {
		console.log('Connection has been established successfully.');
	})
	.catch(function(err) {
		console.error('Unable to connect to the database:', err);
	});

//////////////////////////////////////////////////////
// Database setup methods							//
//////////////////////////////////////////////////////
const Song = sequelize.define('song', {
	audioSrc: { type: Sequelize.STRING },
	audioImageSrc: { type: Sequelize.STRING },
	title: { type: Sequelize.STRING },
	artistName: { type: Sequelize.STRING },
	albumName: { type: Sequelize.STRING },
	albumCoverSrc: { type: Sequelize.STRING }
});

Song.sync({ force: true }).then(function () {
	var currentSongs = initialSongs();
	return Song.bulkCreate(currentSongs);
}).then(function (songs) {
	for (var i = 0; i < songs.length; i++) {
		console.log(songs[i].title);
	}
})


app.listen(3000, (request, response) => {
	console.log("Server is listening on port 3000. Go to http://localhost:3000/");
});

app.get('/', function (request, response) {
	Song.findAll().then(function (results) {
		response.render('home', {
			title: "BruinPlay",
			songs: results
		});
	});
});

app.get('/albums', function (request, response) {
	Song.findAll().then(function (results) {
		 const albumMap = new Map();
		  for (const song of results) {
		    if (song.albumName === null) {
		      // This song doesn't belong to an album. Skip.
		      continue;
		    }

		    // Only add album if it doesn't already exist in the Map.
		    if (!albumMap.has(song.albumCoverSrc)) {
		      albumMap.set(song.albumCoverSrc, {
		        albumName: song.albumName,
		        albumCoverSrc: song.albumCoverSrc
		      });
		    }
		  }

		  // Array of albums with structure { albumName, albumCoverSrc }
		  const albums = [...albumMap.values()];
		  response.render('albums', {
		    albums: albums
		  });

	});
});


app.get('/error', function (request, response) {
	response.send('The song is invalid.');
});


app.post('/songs/add', function(request, response) {
	let inputTitle = request.body.title;
	let inputArtistName = request.body.artistName;
	let inputAlbumName = request.body.albumName;
	// let inputAudioSrc = request.body.audioSrc;
	let inputAudioImageSrc = "http://playercdn.listenlive.co/templates/StandardPlayerV4/webroot/img/default-cover-art.png";
	let inputAlbumCoverSrc = "http://playercdn.listenlive.co/templates/StandardPlayerV4/webroot/img/default-cover-art.png";
	
	if (inputTitle.length > 0 && inputArtistName.length > 0 ) {
		Song.create({
			// audioSrc: inputAudioSrc,
			audioImageSrc: inputAudioImageSrc,
			title: inputTitle,
			artistName: inputArtistName,
			albumName: inputAlbumName,
			albumCoverSrc: inputAlbumCoverSrc
		}).then(function () {
			response.redirect('/');
		});
	} else {
		console.log("You tried to add an invalid book into the elibrary.");
		response.redirect('/error');
	}
});


app.get('/songs/delete/:title', function(request, response) {
	Song.find({
		where: {
			title: request.params.title
		}
	}).then(function(song) {
		return song.destroy();
	}).then(function() {
		response.redirect('/');		
	})
});

// Data Source: https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/resources.json
function initialSongs() {
	return [{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/alien.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/alien.jpg",
		"title": "Alien",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/heaven.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/heaven.jpg",
		"title": "Heaven",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/hell.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/hell.jpg",
		"title": "Hell",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/sky.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/sky.jpg",
		"title": "Sky",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/space.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/space.jpg",
		"title": "Space",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/total_nonsense.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/total_nonsense.jpg",
		"title": "Total Nonsense",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/transcend.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/transcend.jpg",
		"title": "Transcend",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/nkansal-mix/urbana.mp3",
		"audioImageSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/nkansal-mix/urbana.jpg",
		"title": "Urbana",
		"artistName": "Nikhil Kansal",
		"albumName": null,
		"albumCoverSrc": null
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/24K%20Magic.mp3",
		"audioImageSrc": null,
		"title": "24K Magic",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Bruno%20Mars%20-%20Chunky%20%5BOfficial%20Audio%5D.mp3",
		"audioImageSrc": null,
		"title": "Chunky",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Bruno%20Mars%20-%20Finesse%20%5BOfficial%20Audio%5D.mp3",
		"audioImageSrc": null,
		"title": "Finesse",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Bruno%20Mars%20-%20Perm%20%5BOfficial%20Audio%5D.mp3",
		"audioImageSrc": null,
		"title": "Perm",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Calling%20All%20My%20Lovelies.mp3",
		"audioImageSrc": null,
		"title": "Calling All My Lovelies",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Straight%20Up%20%20Down.mp3",
		"audioImageSrc": null,
		"title": "Straight Up & Down",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Thats%20What%20I%20Like.mp3",
		"audioImageSrc": null,
		"title": "That's What I Like",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Too%20Good%20To%20Say%20Goodbye.mp3",
		"audioImageSrc": null,
		"title": "Too Good to Say Goodbye",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Uptown%20Funk.mp3",
		"audioImageSrc": null,
		"title": "Uptown Funk",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	},
	{
		"audioSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/audio/bruno-mars-24k-magic/Versace%20On%20The%20Floor.mp3",
		"audioImageSrc": null,
		"title": "Versace on the Floor",
		"artistName": "Bruno Mars",
		"albumName": "24K Magic",
		"albumCoverSrc": "https://raw.githubusercontent.com/acm-hackschool-f17/BruinPlayResources/master/cover_art/bruno-mars-24k-magic/bruno-mars-24k-magic.jpg"
	}];
}