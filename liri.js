// get keys from file for api calls
var keys = require('./keys.js');

// Include the twitter npm package 
var Twitter = require('twitter');

// Include the spotify npm package 
var Spotify = require('node-spotify-api');

// Include the request npm package for IMDB movie calls
var request = require("request");

// fs is a core Node package for reading and writing files
var fs = require("fs");

// Take in the command line arguments
var choice = process.argv[2];
var nodeArgs = process.argv;


// check for choice entered

	switch(choice) {

		// file input
	    case "do-what-it-says":
	        	doThing();
	  			break;

		// Music
	    case 'spotify-this-song':
				// if no argument, use default
				if (nodeArgs.length < 4 ) {
					nodeArgs = "The+Sign";
				} else {	
					nodeArgs = getConsole(nodeArgs);
				}
				// call spotify function
				music();
	        	break;

	    // Twitter
	    case "my-tweets":
	        showTweets();
	        break;

	    // Movies    
	    case "movie-this":
	        // if no argument, use default
				if (nodeArgs.length < 4) {
						nodeArgs = "Mr.+Nobody";
				} else {	 
						nodeArgs = getConsole(nodeArgs);
				}

				// call OMDB function
				movies();
	        	break;

	    default:
	       console.log("No Valid Choice Entered");

	}

	function getConsole(nodeArgs)  {
			var argName = "";
			// Loop through all the words in the node argument handle
			// And handle plus signs in multiple word songs
			for (var i = 3; i < nodeArgs.length; i++) {
					
				if (i > 3 && i < nodeArgs.length) {
					argName = argName + "+" + nodeArgs[i];
				} else {
				    argName += nodeArgs[i];
				}
			}	
    		return argName;
	}

// function to request twittwr data and Display last 20 Tweets
	function showTweets(){
  		
			  //Grabs the Twitter key
			  var client = new Twitter(keys.twitterKeys); 

			  // params for Twitter api call
			  var params = {
							screen_name: 'DavidTh22502055',
	 					    count: 20
			  };

			  // call twitter api and process results
			  client.get('statuses/user_timeline', params, function(error, tweets, response){
				   if(!error){
					    var twitterTxt = "------------TWEET TIME------------------" + "\r";
				    // loop thru results and write to console and log.txt file
					    for(var i = 0; i<tweets.length; i++){
						    var date = tweets[i].created_at;
						    console.log("@DavidTh22502055: " + tweets[i].text + " Created At: " + date.substring(0, 19));
					        console.log("-------------------------------------");
					        // bulid string to write to log file
					        twitterTxt = twitterTxt +  "@DavidTh22502055: " + tweets[i].text + " Created At: " + date.substring(0, 19) + "\r" ;
					        twitterTxt = twitterTxt +   "-------------------------------------" + "\r"; 
				      	}

			      	// append to log.txt file
			      		twitterTxt = twitterTxt +   "------------END TWEET TIME------------------" + "\r" + "\r"; 
					    fs.appendFile("log.txt",twitterTxt, function(err) {

				    	// If the code experiences any errors it will log the error to the console.
						    if (err) {
							   	return console.log(err);
						    }

						    // Otherwise, it will print: "log.txt was updated!"
								console.log("log.txt was updated!");
						});
					// error if api call failed
			    	}	else{
			      				console.log('Error occurred');
			    	} 
	   		  });
	}

// function to request spotify data 
	function music() {
			var spotify = new Spotify(keys.spotifyKeys); 
		    // search for song using spotify api
			spotify.search({ type: 'track', query: "'" + nodeArgs + "'"}, function(err, data) {
			  if (err) {
			    return console.log('Error occurred: ' + err);
			  }
			 			// console log movie data
			  			var songInfo = data.tracks.items[0];

						console.log("------------MUSIC TIME------------------");
				   		console.log("The Song Artist is: " + JSON.stringify(songInfo.artists[0].name, null, 2));
			            console.log("The Song Name is: " + JSON.stringify(songInfo.name, null, 2));
			            console.log("The Album Name is: " + JSON.stringify(songInfo.album.name, null, 2));
				        console.log("The Preview Url is: " + JSON.stringify(songInfo.preview_url, null, 2));;
				        console.log("----------------------------------------");
			         	// build text to append to log.txt file
			    		var songTxt = "------------MUSIC TIME------------------" + "\r";
						songTxt = songTxt + "The Song Artist is: " + songInfo.artists[0].name + "\r";
						songTxt = songTxt + "The Song Name: " + songInfo.name + "\r";
						songTxt = songTxt + "The Album Name is: " + songInfo.album.name + "\r"
						songTxt = songTxt + "The Preview Url is: " + songInfo.preview_url + "\r";
						songTxt = songTxt +  "------------END MUSIC TIME------------------" + "\r" + "\r"; 

						// append to log.txt file
					    fs.appendFile("log.txt",songTxt, function(err) {

			 	    	// If the code experiences any errors it will log the error to the console.
					    if (err) {
						   	return console.log(err);
					    }

					    // Otherwise, it will print: "movies.txt was updated!"
							console.log("log.txt was updated!");
					});
         
			}); 
	}

// movie this function
	function movies() {
		
			// Then run a request to the OMDB API with the movie specified
			request("http://www.omdbapi.com/?t=" + nodeArgs + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			// If the request is successful (i.e. if the response status code is 200)
					if (!error && response.statusCode === 200) {

						// console log movie data
						console.log("------------MOVIE TIME------------------");
						console.log("The movie's title is: " + JSON.parse(body).Title);
					    console.log("The movie's Relase Date: " + JSON.parse(body).Released);
					    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
				        console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
					    console.log("The movie was produced in: " + JSON.parse(body).Country);
					    console.log("The movie's language is: " + JSON.parse(body).Language);
					    console.log("The movie's plot is: " + JSON.parse(body).Plot);
					    console.log("The movie's Actors are: " + JSON.parse(body).Actors);
					    console.log("----------------------------------------");
					    // build text to append to log.txt file
					    var movieTxt = "------------MOVIE TIME------------------" + "\r";
					    movieTxt = movieTxt + "The movie's title is: " + JSON.parse(body).Title + "\r";
					    movieTxt = movieTxt + "The movie's Relase Date: " + JSON.parse(body).Released + "\r";
					    movieTxt = movieTxt + "The movie's rating is: " + JSON.parse(body).imdbRating + "\r";
					    movieTxt = movieTxt + "The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value + "\r";
					    movieTxt = movieTxt + "The movie was produced in: " + JSON.parse(body).Country + "\r";
					    movieTxt = movieTxt + "The movie's language is: " + JSON.parse(body).Language + "\r";
					    movieTxt = movieTxt + "The movie's plot is: " + JSON.parse(body).Plot + "\r";
					    movieTxt = movieTxt + "The movie's Actors are: " + JSON.parse(body).Actors + "\r";
					    movieTxt = movieTxt +  "------------END MOVIE TIME------------------" + "\r" + "\r";

					   // append to log.txt file
					    fs.appendFile("log.txt",movieTxt, function(err) {

						   // If the code experiences any errors it will log the error to the console.
						   if (err) {
						    	return console.log(err);
						   }

						   // Otherwise, it will print: "movies.txt was updated!"
						   console.log("log.txt was updated!");
						});
					}
			});
	}

	function doThing(){
		  fs.readFile('random.txt', "utf8", function(error, data){
		    	var txt = data.split(',');
		    	nodeArgs = txt[1];
		    	music();
   		  });
	}


