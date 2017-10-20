import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/components/forms/locationResults/locationResults.js';
import '../../ui/components/forms/searchForm/searchForm.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { main: 'ui_components_forms_searchForm' });
    },
});

//Artist Results W/O a date filter
//_id = name of the artist in a string form
FlowRouter.route('/artist/:_id', {
    name: 'App.artistSearch',
    action(params) {
        BlazeLayout.render('App_body', { main: 'ui_components_forms_locationResults' });
    },
});

//Artist Results W/ a date filter 
//_id = name of the artist in a string form
//_startDate = Date object with no time set, start of the range.
//_endDate = Date object with no time set, end of the range.
FlowRouter.route('/artist/:_id/:_startDate/:_endDate', {
    name: 'App.artistSearchWithDate',
    action(params) {
        BlazeLayout.render('App_body', { main: 'ui_components_forms_locationResults' });
    },
});

//Location results
//_locationName = name of the location that results are been fetched for 
//_id = the SongKick metro ID 
//_lat = latitude for that metro area 
//_lng = longitude for that metro area
FlowRouter.route('/location/:_locationName/:_id/:_lat/:_lng', {
    name: 'App.locationSearch',
    action(params) {
        BlazeLayout.render('App_body', { main: 'ui_components_forms_locationResults' });
    },
});

//Route for handling an incorrect route
FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'App_notFound' });
    },
};
