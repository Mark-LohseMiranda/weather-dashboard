var cityFormEl = $('#cityForm');
var cityNameEl = $('#cityName');
var latitude
var longitude
var cityName
var currentCityEl = $('#currentCity')
var currentTempEl = $('#currentTemp')
var currentWindEl = $('#currentWind')
var currentHumidityEl = $('#currentHumidity')
var currentUvEl = $('#currentUv')
var currentDate = moment().format('M/DD/YYYY');
var day0El = $('#day0');
var day1El = $('#day1');
var day2El = $('#day2');
var day3El = $('#day3');
var day4El = $('#day4');
var dayArray = ["day0El", "day1El", "day2El", "day3El", "day4El"];

function getCityName(event) {
    event.preventDefault();
    cityName = cityNameEl.val();
    for (i=0; i < 5; i++) {
        var clear = document.getElementById("day" + i);
        while (clear.firstChild) {
            clear.removeChild(clear.firstChild);
        }
    };
    getLatLong();
}

cityFormEl.on('submit', getCityName);

function getLatLong() {

    var url = (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=d2ee20e2eb15e888df5d53206e353c5d`)

    fetch(url)
    .then (function (response) {
        return response.json();
    })
    .then(function (data) {
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        getWeatherInfo();
    })

}


function getWeatherInfo() {

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=d2ee20e2eb15e888df5d53206e353c5d`)


.then(function (response) {
    return response.json();
})
.then(function (data) {
    
    var weatherIcon = data.current.weather[0].icon;
    currentCityEl.text(cityName + ' (' + currentDate + ')');
    currentCityEl.append(`<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="current weather icon" style="width:30px;height:30px;">`);
    currentTempEl.text(data.current.temp);
    currentWindEl.text(data.current.wind_speed);
    currentHumidityEl.text(data.current.humidity);
    var currentUv = data.current.uvi;
    currentUvEl.text(currentUv);
    if (currentUv < 3) {
        currentUvEl.addClass('low rounded');
    } else if (currentUv > 5) {
        currentUvEl.addClass('hi rounded');
    } else {
        currentUvEl.addClass('med rounded');
    }
    for (i=0; i < 5; i++) {
        var nextDay = moment().add(i+1, 'd').format('M/DD/YYYY');
        var buildFiveDay = $('#day' + i)
        buildFiveDay.append(`<div>${nextDay}</div>`);
        var futureWeatherIcon = data['daily'][i].weather[0]['icon'];
        buildFiveDay.append(`<img src="http://openweathermap.org/img/wn/${futureWeatherIcon}@2x.png" alt="weather icon" style="width:30px;height:30px;">`);
        buildFiveDay.append('<div>Temp: ' + data['daily'][i].temp.day + '&deg;F</div>');
        buildFiveDay.append('<div>Wind: ' + data['daily'][i].wind_speed + '</div>');
        buildFiveDay.append('<div>Humidity: ' + data['daily'][i].humidity + '</div>'); 
    }
})

};




// weather api key d2ee20e2eb15e888df5d53206e353c5d