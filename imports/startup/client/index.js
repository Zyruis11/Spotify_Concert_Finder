// Import client startup through a single index entry point
import './routes.js';

if (Meteor.isClient) {
    Meteor.startup(function () {
        GoogleMaps.load({ v: '3', key: 'AIzaSyB6kTS-PpHGY1ic1OygC4hkEKcJtlB_ZbQ',}); //This key is public view due to google maps api been clientside only
    });
}