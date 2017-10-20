import { apiKeys } from '../config.js';


Meteor.methods({
    //Gets the lat/lng of a query string 
    //query string = a location in the form of a string e.g. Brisbane, Australia or 10 StreetName Brisbane
    googleMethodsGetLocation:function(query){
        this.unblock();
        try{
            const response = HTTP.call('GET',options.geocodeUrl,
            {
                params: {
                    'address':query,
                    'key':options.key
                }
            });
            return response.data.results; 
        }
        catch(ex){
            return ex; 
        }
    },
});

var options = { 
    key: apiKeys.googleKey,
    geocodeUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
}