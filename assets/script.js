const cityData = document.getElementById('city-data');
const fetchButton = document.getElementById('fetch-button');
const searchHistory = document.getElementById('search-history');
const APIkey = "fe30c12a7fbe0e95232bca09495974b5";
let city;

function getCordinate() {
    // fetch request link store to a variable requestUrl

    const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            const cityLat = data.lat;
            const cityLon = data.lon;

            const cityInfo = {
                name: city,
                lat: cityLat,
                lon: cityLon,
            }
            const cities = JSON.parse(localStorage.getItem('Inputs')) || [];
            cityInfo.push(cities);
            localStorage.setItem('Inputs', JSON.stringify(cityInfo));
        })
}

// get values from the local storage
const cities = JSON.parse(localStorage.getItem('Inputs')) || [];

    for (let i = 0; i < cities.length; i++) {

        const cityName = document.createElement('p');
        cityName.textContent = cities[i].name;
    
        searchHistory.appendChild(cityName);
    } 

function getWeather() {
    let cityLat;
    let cityLon;
    for(let i = 0; i < cities.length; i++) {
        if(city === cities[i].name) {
            cityLat = cities[i].lat;
            cityLon = cities[i].lon;
        }
    }

    const requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIkey}`;

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            const cityName = document.createElement('h2');
            const weatherInfoList = document.createElement('ul');
            const temperature = document.createElement('li');
            const windSpeed = document.createElement('li');
            const Humidity = document.createElement('li');

            // store weather information to the city searched
            //cityName.textContent = ``; need add an icon
            temperature.textContent = data.list.main.temp;
            windSpeed.textContent = data.wind.speed;
            Humidity.textContent = data.list.main.humidity;

            cityData.appendChild(cityName);
            cityData.appendChild(weatherInfoList);
            weatherInfoList.appendChild(temperature);
            weatherInfoList.appendChild(windSpeed);
            weatherInfoList.appendChild(Humidity);
        })
}

fetchButton.addEventListener('click', getApi);