import { apiKeys } from '../config.js';

Meteor.methods({
    //Searchs for an artist by name(String)
    spotifySearchArtists: function (query, lim) {
        this.unblock();
        var client_id = apiKeys.spotifyClient;
        var client_secret = apiKeys.spotifySecret;
        var token;
        var artistName = encodeURIComponent(query);
        try {
            //Get access token 
            var response = HTTP.call('POST', 'https://accounts.spotify.com/api/token',
                {
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    },
                    params: {
                        grant_type: 'client_credentials'
                    }
                });
            token = response.data.access_token

            //Use the spotify API package to get artists based off a string
            var artistData = HTTP.call('GET', 'https://api.spotify.com/v1/search?',
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    query: 'q=' + artistName + '&type=artist&limit='+lim,

                });                
        }
        catch (ex) {
            return ex;
        }
        return artistData.data.artists;
    },

    //Finds a random artist from the spotify catalouge 
    //Implemented as specified by the FAQ https://developer.spotify.com/web-api/get-artist/ 
    spotifyRandomArtist: function () {
        var client_id = apiKeys.spotifyClient;
        var client_secret = apiKeys.spotifySecret;
        var token;

        this.unblock();

        try {
            //Get access token
            const response = HTTP.call('POST', 'https://accounts.spotify.com/api/token',
                {
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    },
                    params: {
                        grant_type: 'client_credentials'
                    }
                });
            token = response.data.access_token;
            //Get artists 
            var randomArtist = HTTP.call('GET', 'https://api.spotify.com/v1/search?',
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    query: 'q=year:1950-2050&type=artist'

                });

            var randomArtistLength = randomArtist.content.length;
            //Generate the offset to be applied as a filter
            var offset = Math.floor(Math.random() * (randomArtistLength - 1) + 1);
            //Find a artist by limiting to 1 and filtering with the offset
            var randomArtist = HTTP.call('GET', 'https://api.spotify.com/v1/search?',
                {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                    query: 'q=year:1950-2050&type=artist&limit=1&offset=' + offset
                });
        }
        catch (ex) {
            return ex;
        }
        return randomArtist.data.artists.items;
    },
});
