var cityFormEl = $("#cityForm");
var cityNameEl = $("#cityName");
var latitude;
var longitude;
var cityName;
var currentCityEl = $("#currentCity");
var currentTempEl = $("#currentTemp");
var currentWindEl = $("#currentWind");
var currentHumidityEl = $("#currentHumidity");
var currentUvEl = $("#currentUv");
var currentDate = moment().format("M/DD/YYYY");
var day0El = $("#day0");
var day1El = $("#day1");
var day2El = $("#day2");
var day3El = $("#day3");
var day4El = $("#day4");
var searchHistory = [];
var searchHistoryButtonsEl = $("#searchHistoryButtons");
var clearHistoryBtnEl = $("#clearHistoryBtn");

// Clear the five day forcast so that multiple searches don't stack up

function clearFiveDay() {
  for (i = 0; i < 5; i++) {
    var clear = document.getElementById('day' + i);
    while (clear.firstChild) {
      clear.removeChild(clear.firstChild);
    }
  }
}

// Get the city name that was typed into the search box
// check to see the form was blank and verify that the api can find the city

function getCityName(event) {
  event.preventDefault();
  cityName = cityNameEl.val();
  if (!cityName) {
    alert('Please enter a city');
    return;
  }
  verifyCityNameExists();
}

// clear the search history buttons so they don't stack up with mutiple searches
// get search history, if any, from local storage
// if there is search history create a button for each item in the array

function getHistory() {
  var clear = document.getElementById('searchHistoryButtons');
  while (clear.firstChild) {
    clear.removeChild(clear.firstChild);
  }
  searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory'));
  if (searchHistory !== null) {
    for (i = 0; i < searchHistory.length; i++) {
      searchHistoryButtonsEl.append(
        `<button type="button" class="hisBtn btn btn-block btn-sm btn-primary">${searchHistory[i]}</button>`
      );
    }
  } else {
    searchHistory = [];
  }
}

// using the lat and long get the weather information from the api
// then add the information to the current panel and colorize the UvEl based of info from https://www.epa.gov/sunsafety/uv-index-scale-0
// then builds the five day forcast panels

function getWeatherInfo() {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=d2ee20e2eb15e888df5d53206e353c5d`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var weatherIcon = data.current.weather[0].icon;
      currentCityEl.text(cityName + ' (' + currentDate + ')');
      currentCityEl.append(
        `<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="current weather icon" style="width:30px;height:30px;">`
      );
      currentTempEl.text(data.current.temp);
      currentWindEl.text(data.current.wind_speed);
      currentHumidityEl.text(data.current.humidity);
      var currentUv = data.current.uvi;
      currentUvEl.text(currentUv);
      if (currentUv < 3) {
        currentUvEl.attr('class', 'low rounded');
      } else if (currentUv > 5) {
        currentUvEl.attr('class', 'hi rounded');
      } else {
        currentUvEl.attr( 'class', 'med rounded');
      }
      for (i = 0; i < 5; i++) {
        var nextDay = moment()
          .add(i + 1, 'd')
          .format('M/DD/YYYY');
        var buildFiveDay = $('#day' + i);
        buildFiveDay.append(`<div>${nextDay}</div>`);
        var futureWeatherIcon = data['daily'][i].weather[0]['icon'];
        buildFiveDay.append(
          `<img src="http://openweathermap.org/img/wn/${futureWeatherIcon}@2x.png" alt="weather icon" style="width:30px;height:30px;">`
        );
        buildFiveDay.append(
          '<div>Temp: ' + data['daily'][i].temp.day + '&deg;F</div>'
        );
        buildFiveDay.append(
          '<div>Wind: ' + data['daily'][i].wind_speed + '</div>'
        );
        buildFiveDay.append(
          '<div>Humidity: ' + data['daily'][i].humidity + '</div>'
        );
      }
    });
}

// Move elements to display weather information; if the city doesn't exist in the history add it
// clear the 5 day forcast so that multiple searches don't stack 
// get search history

function prepareSite() {
  rePosition();
  cityName = cityName.toUpperCase();
  if (searchHistory.indexOf(cityName) == -1) {
    searchHistory.push(cityName);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }
  clearFiveDay();
  getHistory();
}

// page initially loads with the weather panel hidden and the search panel in the center
// moves those around when a city is searched for either through the form or via a history button

function rePosition() {
  $('#leftSide').removeClass('justify-content-center');
  $('#hide').removeClass('d-none');
}

// check to see if api can find city name if it can prepare the site for the info and
// get the latitude and longitude from the open weather api then move on to getWeatherInfo

function verifyCityNameExists() {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=d2ee20e2eb15e888df5d53206e353c5d`;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      } 
      return response.json();
    })
    .then(function (data) {
      latitude = data.coord.lat;
      longitude = data.coord.lon;
      prepareSite();
      getWeatherInfo();
    })
    .catch(function(error) {
      alert('Can\'t find city, please try again');
    });
}

// listens for the city to be submitted via the form

cityFormEl.on('submit', getCityName);

// listens for the clear history button 
// if clicked clears just this app's localStorage

clearHistoryBtnEl.on('click', function () {
  localStorage.removeItem('weatherSearchHistory');
  getHistory();
});

// listens for the history buttons to be clicked after they have been built

searchHistoryButtonsEl.on('click', '.hisBtn', function () {
  cityName = $(this).html();
  rePosition();
  clearFiveDay();
  verifyCityNameExists();
});

//gets the history on page load

getHistory();
