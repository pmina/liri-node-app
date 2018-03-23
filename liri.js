require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");

var fs = require("fs");

var omdb = require("omdb");

var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}

function myTweets() {
  var params = { screen_name: "@philomina92", count: 20 };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log("----------------");
      console.log("Last 20 Tweets:");
      for (i = 0; i < tweets.length; i++) {
        var number = i + 1;
        console.log(" ");
        console.log([i + 1] + ". " + tweets[i].text);
        console.log("Created on: " + tweets[i].created_at);
        console.log(" ");
      }
    }
  });
}

function spotifyThisSong() {
  if (value == null) {
    value = "The Sign - Ace of Base";
  }
  spotify.search({ type: "track", query: value }, function(err, data) {
    if (!err) {
      console.log(" ");
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Preview Link: " + data.tracks.items[0].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log(" ");
    }
  });
}

function movieThis() {
  if (value == null) {
    value = "Mr. Nobody";
  }

  request(
    "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy",
    function(error, body) {
      if (!error) {
        console.log(" ");
        console.log("Title: " + body.Title);
        console.log("Year: " + body.Year);
        console.log("IMDb Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);
        console.log(" ");
      }
    }
  );
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      var dataArr = data.split(", ");
      if (dataArr[0] === "spotify-this-song") {
        spotifyThisSong(dataArr[1]);
      }
    }
  });
}
