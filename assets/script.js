$(document).ready(function () {
    var cityname = "";
    $("#wicon").css("display", "none");

    // Start searching by name
    $("#searchbtn").on("click", function (event) {
        event.preventDefault();
        cityname = $("#cityname").val().toLowerCase();
        $(".display").empty();
        createRow();
        render_weather_result();
    });
    // Create a list of locations that have been searched
    var createRow = function () {
        var button = $("<button>").text(cityname);
        button.addClass("locationname list-group-item list-group-item-action");
        button.attr("type", "button");
        $(".location-list").prepend(button);
    };


     $(".location-list").on("click", function (event) {
        cityname = event.target.value;
        render_weather_result();
        $(".display").empty();
    });

    // display current weather
    var render_weather_result = function () {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&APPID=dd1b0371c21fc82ebaf3890f20045d6c";

        var longtitude;
        var latitude;
        var citynamedisplay;
        var iconcode;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            citynamedisplay = response.name;
            iconcode = response.weather[0].icon;
            $(".temp").text(response.main.temp + " °F");
            $(".humidity").text(response.main.humidity + " %");
            $(".wind").text(response.wind.speed + " MPH");
            longtitude = response.coord.lon;
            latitude = response.coord.lat;

            // display icon
            var iconlink = "https://openweathermap.org/img/w/" + iconcode + ".png";
            // display uv index using longtitude and latitude
            var secondqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=dd1b0371c21fc82ebaf3890f20045d6c&lat=" + latitude + "&lon=" + longtitude;
            $.ajax({
                url: secondqueryURL,
                method: "GET"
            }).then(function (response) {
                $(".uvindex").text(response.value);
                $(".uvindex").css("background-color", "crimson");
                $(".citynamedisplay").text(citynamedisplay + " " + "(" + response.date_iso + ")");
                $('#wicon').attr('src', iconlink);
                $("#wicon").css("display", "block");
            });

            
            var secondicon;
            // display weather for 5 days
            var thirdqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=dd1b0371c21fc82ebaf3890f20045d6c";
            $.ajax({
                url: thirdqueryURL,
                method: "GET"
            }).then(function (response) {

                var fivedaysweather = response.list;
                for (var i = 0; i < fivedaysweather.length; i = i + 8) {
                    var newDiv = $("<div>");
                    newDiv.addClass("col forecast");
                    secondicon = fivedaysweather[i].weather[0].icon;
                    var secondiconlink = "https://openweathermap.org/img/w/" + secondicon + ".png";
                    var date = $("<h3>").text(fivedaysweather[i].dt_txt);
                    var icon = $("<img>").attr('src', secondiconlink);
                    var temp = $("<p>").text("Temperature: " + fivedaysweather[i].main.temp + " °F");
                    var humidity = $("<p>").text("Humidity: " + fivedaysweather[i].main.humidity + " %");

                    newDiv.append(date, icon, temp, humidity);
                    $(".display").append(newDiv);
                };
            });

        });
    };


});