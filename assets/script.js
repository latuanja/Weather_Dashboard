var city = "St. Louis";
var lat = "";
var lng = "";

var APIKey = "dd1b0371c21fc82ebaf3890f20045d6c";

var forecastDisplay = $("#five-day-display");
var currentWeatherDisplay = $("#display-current-weather");

var savedCitiesArray = ["St. Louis"];




//code for current date variable
var now = moment();

$("#submit-btn").on("click", function () {
    city = $("#user-input").val();
    console.log("typed city: " + city);
    
    openWeatherAPIRequest();
});

$(document).keypress(
    function(event){
        if(event.which == '13') {
            event.preventDefault();
            city = $("#user-input").val();
            console.log("typed city: " + city);

            openWeatherAPIRequest();
            $("#user-input").val("")
        }
    });

function generateButtons(){
    var btnGroup = $(".button-group");
    btnGroup.empty();
    displayStoredCities();

    savedCitiesArray.forEach(element => {
        var cityBtn = $("<button type='button' class='city-btn btn btn-dark btn-lg btn-block'>");
        cityBtn.text(element);
        btnGroup.append(cityBtn);
        console.log("cities: " + element);
        console.log(cityBtn);
    });

};

function openWeatherAPIRequest() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "Get"
    })
    .then(function(response) {
        console.log("response:", response);

        savedCityNameToArray(response);
        $("#current-city-name").text(response.name);
        $("#current-date").text(now.format("dddd MMMM Do"));

        console.log("Currently saved cities: ", savedCitiesArray);
        currentWeatherDisplay.empty();
        forecastDisplay.empty();
        lat = response.coord.lat;
        lng = response.coord.lon;

        oneCallRequest(lat, lng);
    });
};

function oneCallRequest(lat, lng) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"

    })
    .then(function (response) {
        displayCurrentWeather(response.current);
        console.log(response);

        for (i = 1; i < 6; i++) {
            console.log("five day: ", response.daily[i]);
            displayFiveDayForecast(response.daily[i], now.add(i, 'days').format("dddd"));
        };

        generateButtons();

        $(".city-btn").on("click", function (){
            
        })
    })
}
