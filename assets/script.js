const currentWeather = document.getElementById('current-weather');
const citySearch = document.getElementById('city-search');
const fetchButton = document.getElementById('fetch-button');
const searchHistory = document.getElementById('search-history');
const daysForecast = document.getElementById('5-day-forecast');
const APIkey = "fe30c12a7fbe0e95232bca09495974b5";

function getCoordinate() {
    const city = citySearch.value.trim();

    const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${APIkey}`

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.length) {
                getWeather(data[0].lat, data[0].lon);
                getSearchHistory(city);
            } else {
                alert('City not found');
            }       
        })
        .catch(error => {
            console.error('There was an error', error);
        })
}

function getWeather(lat, lon) {
    const requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayCurrentWeather(data.list[0], data.city);
            displayWeather(data);
        })
        .catch(error => {
            console.error('There was an error', error);
        })
}

// Display current weather
function displayCurrentWeather(current, city) {
    currentWeather.innerHTML = '';

    const cityName = document.createElement('h2');
    cityName.textContent = `${city.name} (${new Date(current.dt_txt).toDateString()})`;
    currentWeather.appendChild(cityName);

    const currentTemp = document.createElement('p');
    currentTemp.textContent = `Temperature: ${current.main.temp} °F`;
    currentWeather.appendChild(currentTemp);

    const currentWindSpeed = document.createElement('p');
    currentWindSpeed.textContent = `Wind Speed: ${current.wind.speed} m/s`;
    currentWeather.appendChild(currentWindSpeed);

    const currentHumidity = document.createElement('p');
    currentHumidity.textContent = `Humidity: ${current.main.humidity}%`;
    currentWeather.appendChild(currentHumidity);

    const currentWeatherIcon = document.createElement('img');
    currentWeatherIcon.src = `http://openweathermap.org/img/w/${current.weather[0].icon}.png`;
    currentWeather.appendChild(currentWeatherIcon);
}

// Display 5-day forecast
function displayWeather(data) {
    // Clear previous data
    daysForecast.textContent = '';

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const weatherContainer = document.createElement('div');

            const date = document.createElement('h3');
            date.textContent = new Date(forecast.dt_txt).toDateString();
            weatherContainer.appendChild(date);

            const temperature = document.createElement('p');
            temperature.textContent = `Temperature: ${forecast.main.temp} °F`;
            weatherContainer.appendChild(temperature);

            const windSpeed = document.createElement('p');
            windSpeed.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;
            weatherContainer.appendChild(windSpeed);

            const humidity = document.createElement('p');
            humidity.textContent = `Humidity: ${forecast.main.humidity}%`;
            weatherContainer.appendChild(humidity);

            const weatherIcon = document.createElement('img');
            weatherIcon.src = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            weatherContainer.appendChild(weatherIcon);

            daysForecast.appendChild(weatherContainer);
        }
    })
}

// Store values to the local storage
function getSearchHistory(city) {
    let cities = JSON.parse(localStorage.getItem('History')) || [];
    console.log('Current cities in history:', cities); 
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('History', JSON.stringify(cities));
        displaySearchHistory();
    }
}

// Display search history
function displaySearchHistory() {
    const cities = JSON.parse(localStorage.getItem('History')) || [];
    searchHistory.innerHTML = '';

    cities.forEach(city => {
        const button = document.createElement('button');
        button.style.width = "90%";
        button.textContent = city;
        button.addEventListener('click', function() {
            revisitCity(city);
        });
        searchHistory.appendChild(button);
    });
}

function revisitCity(city) {
    citySearch.value = city;
    getCoordinate();
}

// Initial Setup to display search history on load
window.onload = function() {
    displaySearchHistory();
};

fetchButton.addEventListener('click', (event) => {
    //Prevent default action
    event.preventDefault();

    getCoordinate();
});