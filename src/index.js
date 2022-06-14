// This file contains the logic used to query the API and pass data to the interface building functions
import './style.css';
import * as icons from './importicons';
import {buildLocDetails, buildLocStats, buildWeatherOutlook, buildWeeklyForecast, buildTopCititesList} from './interface';

const searchInput = document.getElementById('search-bar');
const searchBtn = document.querySelector('.search-icon');
let tempUnit = 'imperial';
let topCitiesArr = ['New York','Chicago','Denver','Seattle','Tokyo','Beijing','Rome','Berlin','Paris','London'];

// Factory Function to create the location object
const queriedLocation = (lat, lon, city, state) => {
    return { lat, lon, city, state };
};

// We will use the Geocoding API to get location data of an entered location and create an object using our factory function 
async function getLocationData(loc){
    const response = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + loc + '&limit=1&appid=daf462f3a0662d022ea6cbe67da83b38');
    const locationData = await response.json();
    let searchQuery = queriedLocation(locationData['0'].lat,locationData['0'].lon,locationData['0'].name,locationData['0'].state);
    return searchQuery;
};

// Now we will use the OpenWeather API to pass the data to functions that will create the UI
async function getWeatherData(loc){
    const owAPIKey = 'daf462f3a0662d022ea6cbe67da83b38';
    let locationData =  loc;//await getLocationData(loc);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${locationData.lat}&lon=${locationData.lon}&units=${tempUnit}&appid=${owAPIKey}`);
    const weatherData = await response.json();
    return weatherData;
};

// This function will generate a list of top cities and their current temp
function generateTopCities(arr){
    let topCities = arr;
    async function genList(loc){
        let locationQuery = await getLocationData(loc);
        let weatherQuery = await getWeatherData(locationQuery);
        buildTopCititesList(locationQuery,weatherQuery);
    }
    topCities.forEach(element => {
        console.log(element);
        genList(element);
    });
};

// This is the search function
searchBtn.addEventListener('click', ()=>{
    runSearchQuery(searchInput.value)
});

// This function initiates the search query
async function runSearchQuery(loc){
    let locationQuery = await getLocationData(loc);
    let weatherQuery = await getWeatherData(locationQuery);
    buildLocDetails(locationQuery, weatherQuery.timezone);
    buildLocStats(weatherQuery);
    buildWeatherOutlook(weatherQuery);
    buildWeeklyForecast(weatherQuery);
};

runSearchQuery(topCitiesArr[0]);
generateTopCities(topCitiesArr);