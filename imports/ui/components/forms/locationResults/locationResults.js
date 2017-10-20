import './locationResults.html';
import './locationResults.css';

Template.ui_components_forms_locationResults.onCreated(function () {
    Session.set('eventData', null); //Create the session object, to stop undefined errors 
    //Check if artist route
    if (FlowRouter.getRouteName() === 'App.artistSearch') {
        Meteor.call('songKickSearchArtists', FlowRouter.getParam('_id'), function (error, response) {
            if (response.artist != null) {
                Meteor.call('songKickFetchConcerts', response.artist[0].id, function (err, res) {
                    if (res.event != null) {
                        eventData = res.event;
                        Session.set('eventData', eventData); //Sets the eventData object into the session to allow for reactivity 
                        $('#progressRow').hide();
                        // Add markers to the map once it's ready
                        prepareMap('concertMap', eventData);
                    }
                    else{
                        $('#titleHeader').html('No Results');
                        $('#progressRow').hide();
                    }
                });
            }
            else {
                $('#titleHeader').html('No Results');
                $('#progressRow').hide();
            }
        });
    }
    //Check if artistSearch with date parameters 
    else if (FlowRouter.getRouteName() === 'App.artistSearchWithDate') {
        //Get the parameters and place them into variables 
        var id = FlowRouter.getParam('_id');
        var startDate = FlowRouter.getParam('_startDate');
        var endDate = FlowRouter.getParam('_endDate');

        Meteor.call('songKickSearchArtists', FlowRouter.getParam('_id'), function (error, response) {
            if (response.artist != null) {
                Meteor.call('songKickFetchConcertsWithDate', response.artist[0].id, startDate, endDate, function (err, res) {
                    if (res.event != null) {
                        eventData = res.event;
                        Session.set('eventData', eventData); //Sets the eventData object into the session to allow for reactivity 
                        $('#progressRow').hide();
                        // Add markers to the map once it's ready
                        prepareMap('concertMap', eventData);
                    }
                    else{
                        $('#titleHeader').html('No Results');
                        $('#progressRow').hide();
                    }
                });
            }
            else {
                $('#titleHeader').html('No Results');
                $('#progressRow').hide();
            }
        });
    }
    //Check if location route 
    else if (FlowRouter.getRouteName() === 'App.locationSearch') {
        Meteor.call('songKickFetchConcertsMetro', FlowRouter.getParam('_id'), function (error, response) {
            if (response.event != null) {
                eventData = response.event;
                Session.set('eventData', eventData);
                $('#progressRow').hide();
                // Add markers to the map once it's ready
                prepareMap('concertMap', eventData);
            }
            else {
                $('#titleHeader').html('No Results');
                $('#progressRow').hide();
            }
        });
    }


});

Template.ui_components_forms_locationResults.onRendered(function () {
    //Show the loading bar on template rendered
    $('#progressRow').show();
});

Template.ui_components_forms_locationResults.helpers({
    'eventData': function () {
        return Session.get('eventData');
    },
    //Display the artist name or Location
    'titleHeader': function () {
        if (FlowRouter.getRouteName() === 'App.locationSearch') {
            return FlowRouter.getParam('_locationName');
        }
        else {
            return FlowRouter.getParam('_id');
        }
    },
    //Displays the total amount of events (Capped at 50 results)
    'eventCount': function () {
        var eventData = Session.get('eventData')
        if (eventData != null) {
            return eventData.length + ' Results';
        }
    },
    //Sets up the initial options for the concert map 
    concertMapOptions: function () {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            if (FlowRouter.getRouteName() === 'App.locationSearch') {
                return {
                    center: new google.maps.LatLng(FlowRouter.getParam('_lat'), FlowRouter.getParam('_lng')),
                    zoom: 10
                };
            }
            else {
                return {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 1
                }
            }
        }
    }
});

Template.ui_components_forms_locationResults.events({
    //Event for allowing a user to click through differnt artists 
    'click #artistName'(event) {
        event.preventDefault();
        var artistName = $(event.target).html();
        FlowRouter.go('/artist/' + artistName);
        Session.set('eventData', null);      //Had to cheese jQuery to force reload
        location.reload();
    },
    'click #backToTopBtn'(event) { //Sends the user back to the top of the page on click
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        
    }
});

//'Prepares' the map by placing markers on it in specified locations and given those markers labels 
//mapName(string) = name the map to place markers on
//eventData(object) = object containing the event data from the songKick API 
function prepareMap(mapName, eventData) {
    GoogleMaps.ready(mapName, function (map) {
        eventCount = eventData.length
        //Populate the map with the venue markers
        for (var i = 0; i < eventCount; i++) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(eventData[i].venue.lat, eventData[i].venue.lng),
                title: eventData[i].performance[0].artist.displayName,
                animation: google.maps.Animation.DROP,
                map: map.instance
            });
            marker.setLabel(eventData[i].venue.displayName);
        }
        
    
    });
    var mapObj = GoogleMaps.maps.concertMap.instance
    // mapObj.event.trigger(MapInstance,'resize');
    if(FlowRouter.getRouteName() === 'App.artistSearchWithDate' || FlowRouter.getRouteName() === 'App.artistSearch'){
        mapObj.setCenter(new google.maps.LatLng(eventData[0].venue.lat, eventData[0].venue.lng));
    }
}