import './searchForm.html';
import './searchForm.css';

//Init for javascript based components
Template.ui_components_forms_searchForm.onRendered(function () {
    $('#progressRow').hide();

    $(document).ready(function () {
        $('.parallax').parallax();
    });

    $('.datepicker').pickadate({
        selectMonths: true, 
        selectYears: true,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false 
    }); 
    $('#dateFilters').hide();
});

Template.ui_components_forms_searchForm.events({

    //Shows/Hides the date pickers depending on what radio button is selected
    //Achieved by abusing jquery
    'click .radioBtns'(event, template){
        var radioBtn = $('input[name=radioBtns]:checked').attr('id');
        
        if (radioBtn === 'artistRadio') {
            $('#dateFilters').show();
            
        }
        else if (radioBtn === 'locationRadio') {
            $('#dateFilters').hide();
        }
    },
    //On form submit search for an artist/location 
    'submit #searchForm'(event) {
        event.preventDefault();

        const target = event.target;
        const searchQuery = target.searchQuery.value;
        var radioBtn = $('input[name=radioBtns]:checked').attr('id');

        if (radioBtn === 'artistRadio') {
            $('#progressRow').show();    
            //Search for the artist with their name(String)
            Meteor.call('spotifySearchArtists', searchQuery, 50, function (error, response) {
                if(response != null){
                    Session.set('artists', response.items);
                    $('#progressRow').hide();
                }
                else{
                    $('#artistResults').html('Something went wrong with the artist search');
                }
            });
        }
        else if (radioBtn === 'locationRadio') {
            $('#progressRow').show();
            //Gets the query location in coordinants for use in the next method
            Meteor.call('googleMethodsGetLocation', searchQuery, function (error, response) {
                if (response != null) {
                    var coords = response[0].geometry.bounds.northeast.lat.toString() + ',' + response[0].geometry.bounds.northeast.lng.toString();
                    //Takes the coordinants and finds concerts in that area
                    Meteor.call('songKickSearchLocation', coords, function (err, res) {
                        if (res.location != null) {
                            var locationName = res.location[0].metroArea.displayName + ',' + res.location[0].metroArea.country.displayName;
                            Session.set('mapCenter', res.location[0].metroArea);
                            FlowRouter.go('/location/' + locationName + '/' + res.location[0].metroArea.id + '/' + res.location[0].metroArea.lat + '/' + res.location[0].metroArea.lng);
                        }
                        else {
                            $('#artistResults').html('Please be more specific');
                        }
                    });
                }
                else {
                    $('#artistResults').html('Please be more specific');
                }
            });
        }
    },
    'click #randomBtn'(event){
        event.preventDefault(); 
        $('#progressRow').show();
        Meteor.call('spotifyRandomArtist',function (error, response) {
            if(response != null){
                Session.set('artists', response);
                $('#progressRow').hide();
            }
            else{
                $('#artistResults').html('Something went wrong with the artist search');
            }
        });
    }

});

Template.ui_components_forms_searchFormResults.helpers({
    'getArtistData': function () { //Display the results of searching for an artist 
        if (Session.get('artists') != null) {
            var artistData = Session.get('artists');
            $('#artistResults').html(artistData.length + ' Results');
        }
        return Session.get('artists');
    },
    smallImg: function (size) { //Dodgy function
        return size === 640;
    }
});

Template.ui_components_forms_searchFormResults.events({
    //Event for handling if the user has clicked the 'find gigs' button on the artist card
    'click .artistName'(event){
        event.preventDefault(); 

        var target = event.target;
        var artistName = target.id;
        var minDatePicker = $('#minDatePicker').pickadate('picker');
        var maxDatePicker = $('#maxDatePicker').pickadate('picker');
        var currentDate = new Date(); 
        currentDate.setHours(0,0,0,0);
        //Check if the date pickers have a value
        if(minDatePicker.get('value') != '' && maxDatePicker.get('value') != ''){
            var minDate = minDatePicker.get('select');
            var maxDate = maxDatePicker.get('select');
            //if they have a value check if minDate is smaller than max date 
            if(minDate.obj >= currentDate && maxDate.obj >= currentDate ){

                if(minDate.obj <= maxDate.obj){
                    minDate = minDatePicker.get('select','yyyy-mm-dd');
                    maxDate = maxDatePicker.get('select','yyyy-mm-dd');
                    FlowRouter.go('/artist/'+artistName+'/'+minDate+'/'+maxDate);
                }
                else{
                    $('#artistResults').html('Minimum Date is larger than max date'); //Alert the user
                }
            }
            else{
                $('#artistResults').html('Error in date filters'); //Alert the user
            }
        }
        //If no date has been selected send them to the normal artist route
        else{
            FlowRouter.go('/artist/'+artistName);
        }
    }
});