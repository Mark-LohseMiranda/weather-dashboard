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

function getCityName(event) {
    event.preventDefault();
    cityName = cityNameEl.val();
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
    currentCityEl.text(cityName);
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
    
})

};




// weather api key d2ee20e2eb15e888df5d53206e353c5d