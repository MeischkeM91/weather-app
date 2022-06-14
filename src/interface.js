// This is all of the code that builds the user interface
import { startOfWeek, addDays } from 'date-fns';
import { utcToZonedTime, format} from 'date-fns-tz';
import * as icons from './importicons';

// This will build the "location-details" section of the main content container
function buildLocDetails(locData, timeZone){
    const locationHeaderDiv = document.querySelector('.location-header');
    locationHeaderDiv.innerHTML='';
    // Location data
    const cityStateHead = document.createElement('p');
    cityStateHead.classList.add('city-state-head');
    let cityStr = locData.city;
    let stateStr = locData.state;
    if(stateStr == undefined){
        stateStr='';
    }
    cityStateHead.textContent = `${cityStr}, ${stateStr}`;
    // Time data
    let date = new Date();
    const newTimeZone = timeZone;
    const zonedDate = utcToZonedTime(date, timeZone);
    const datePattern = 'PPPPp';
    const output = format(zonedDate, datePattern, { newTimeZone});
    const dateHead = document.createElement('p');
    dateHead.classList.add('date-head');
    dateHead.textContent = `${output}`;
    // Append elements to page
    locationHeaderDiv.appendChild(cityStateHead);
    locationHeaderDiv.appendChild(dateHead);
};

// This function displays weather stats such as Humidity, Chance of Rain, and Wind Speed 
function buildLocStats(data){
    const locationStatsDiv = document.querySelector('.location-stats');
    locationStatsDiv.innerHTML='';
    // Each line will have a div with two p elems, one for title and one for data
    const humidityDiv = document.createElement('div');
    humidityDiv.classList.add('humidity-container');
    const humidityTitle = document.createElement('p');
    humidityTitle.innerText = `Humidity:`;
    const humidityData = document.createElement('p');
    humidityData.innerText = `${Math.round(data.current.humidity)}%`;
    const chanceOfRainDiv = document.createElement('div');
    chanceOfRainDiv.classList.add('rain-chance-container');
    const chanceOfRainTitle = document.createElement('p');
    chanceOfRainTitle.innerText = `Chance of Rain:`;
    const chanceOfRainData = document.createElement('p');
    let chanceOfRain = Math.round((data.hourly[0].pop)*100);
    chanceOfRainData.innerText = `${chanceOfRain}%`;
    const windSpeedDiv = document.createElement('div');
    windSpeedDiv.classList.add('wind-speed-container');
    const windSpeedTitle = document.createElement('p');
    windSpeedTitle.innerText = `Wind Speed:`;
    const windSpeedData = document.createElement('p');
    windSpeedData.innerText = `${Math.round(data.current.wind_speed)} mph`;
    // Append elements to page
    locationStatsDiv.appendChild(humidityDiv);
    humidityDiv.appendChild(humidityTitle);
    humidityDiv.appendChild(humidityData);
    locationStatsDiv.appendChild(chanceOfRainDiv);
    chanceOfRainDiv.appendChild(chanceOfRainTitle);
    chanceOfRainDiv.appendChild(chanceOfRainData);
    locationStatsDiv.appendChild(windSpeedDiv);
    windSpeedDiv.appendChild(windSpeedTitle);
    windSpeedDiv.appendChild(windSpeedData);
};

// This function determines which icon should be displayed and returns it
const determineWeatherIcon = (cond) => {
    let weatherCond = cond;
    if(weatherCond == 'Thunderstorm'){
        return icons.ThunderIcon;
    } else if(weatherCond == 'Drizzle'){
        return icons.DrizzleIcon;
    } else if(weatherCond == 'Rain'){
        return icons.RainIcon;
    } else if(weatherCond == 'Snow'){
        return icons.SnowIcon;
    } else if(weatherCond=='Mist' || weatherCond=='Smoke' || weatherCond=='Haze' || weatherCond=='Dust' || weatherCond=='Fog' || weatherCond=='Sand' || weatherCond=='Ash' || weatherCond=='Squall' || weatherCond=='Tornado' ){
        return icons.HazeFogIcon;
    } else if(weatherCond == 'Clear'){
        return icons.SunnyIcon;
    } else {
        return icons.CloudyIcon;
    }
};

function buildWeatherOutlook(data){
    // This code will determine the weather icon displayed
    const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.src='';
    let weatherCond = (data.current.weather[0].main);
    let iconToUse = determineWeatherIcon(weatherCond);
    weatherIcon.src=iconToUse;
    // This code will build the temp details div
    const tempDetailsContainer = document.querySelector('.temp-details');
    tempDetailsContainer.innerHTML='';
    const currentTempContainer = document.createElement('div');
    currentTempContainer.classList.add('current-temp-container');
    const currentTemp = document.createElement('p');
    currentTemp.classList.add('current-temp');
    let currentTempData = Math.round(data.current.temp);
    currentTemp.innerText = currentTempData;
    const currentTempUnit = document.createElement('p');
    currentTempUnit.classList.add('current-temp-unit');
    currentTempUnit.innerText = 'F';
    const currentTempDescription = document.createElement('p');
    currentTempDescription.classList.add('current-temp-description');
    // Need to capitalize each word in the description
    const tempDescriptionData = data.current.weather[0].description;
    const tempDescriptionStr = tempDescriptionData.split(" ");
    for (let i = 0; i < tempDescriptionStr.length; i++) {
        tempDescriptionStr[i] = tempDescriptionStr[i][0].toUpperCase() + tempDescriptionStr[i].substr(1);
    } // Places each word into an array while capitalizing the first letter
    currentTempDescription.innerText = tempDescriptionStr.join(" ");
    const feelsLikeContainer = document.createElement('div');
    feelsLikeContainer.classList.add('feels-like-container');
    const feelsLike = document.createElement('p');
    feelsLike.classList.add('feels-like');
    let feelsLikeData = Math.round(data.current.feels_like);
    feelsLike.innerText = `Feels Like ${feelsLikeData}`;
    const feelsLikeUnit = document.createElement('p');
    feelsLikeUnit.classList.add('feels-like-unit');
    feelsLikeUnit.innerText = 'F';
    // Append elements to page
    tempDetailsContainer.appendChild(currentTempContainer);
    currentTempContainer.appendChild(currentTemp);
    currentTempContainer.appendChild(currentTempUnit);
    tempDetailsContainer.appendChild(currentTempDescription);
    tempDetailsContainer.appendChild(feelsLikeContainer);
    feelsLikeContainer.appendChild(feelsLike);
    feelsLikeContainer.appendChild(feelsLikeUnit);
};

// This function will build the weekly forecast
function buildWeeklyForecast(data){
    const forecastContainer = document.querySelector('.week-forecast');
    forecastContainer.innerHTML='';
    // This function will create a container holding basic forecast info
    function createDayOfForecast(weatherData,i){
        const dayOfForecastContainer = document.createElement('div');
        dayOfForecastContainer.classList.add('day-forecast-container')
        const dayOfForecastTempContainer = document.createElement('div');
        dayOfForecastTempContainer.classList.add('day-forecast-temp-container')
        const dayForecastTemp = document.createElement('p');
        dayForecastTemp.classList.add('forecast-temp');
        const dayForecastTempUnit = document.createElement('p');
        dayForecastTempUnit.classList.add('forecast-temp-unit');
        dayForecastTempUnit.innerText = 'F';
        const dayOfForecast = document.createElement('p');
        const dateOfForecast = document.createElement('p');
        
        let today = new Date();
        // Temp to display for each day
        let dayForecastTempData = Math.round(weatherData.daily[i].temp.day);
        // Set display to display the following day
        const dayFormat='eeee';
        let dayToDisplay = format(addDays(today,i+1),dayFormat);
        // Set display to display the following date
        const dateFormat='P';
        let dateToDisplay = format(addDays(today,i+1),dateFormat);
        // Fill in forecast data
        dayForecastTemp.innerText = dayForecastTempData;
        dayOfForecast.innerText = dayToDisplay;
        dateOfForecast.innerText = dateToDisplay;
        // Append elements to page
        forecastContainer.appendChild(dayOfForecastContainer);
        dayOfForecastContainer.appendChild(dayOfForecastTempContainer);
        dayOfForecastTempContainer.appendChild(dayForecastTemp);
        dayOfForecastTempContainer.appendChild(dayForecastTempUnit);
        dayOfForecastContainer.appendChild(dayOfForecast);
        dayOfForecastContainer.appendChild(dateOfForecast);
    };

    for(let i=0;i<6;i++){
        createDayOfForecast(data,i);
    };
};

// This function will build the Top Cities current temp list
function buildTopCititesList(locData,weatherData){
    const citiesListContainer = document.querySelector('.top-cities-list-container');
    // Build each line
    const topCityContainer = document.createElement('div');
    topCityContainer.classList.add('top-city-container')
    const topCityItem = document.createElement('p');
    topCityItem.innerText = `${locData.city}, ${locData.state}`
    const topCityTempContainer = document.createElement('div');
    topCityTempContainer.classList.add('top-city-temp-container')
    const topCityTemp = document.createElement('p');
    topCityTemp.innerText = Math.round(weatherData.current.temp);
    const topCityTempUnit = document.createElement('p');
    topCityTempUnit.innerText = `F`;
    // Append elements to page
    citiesListContainer.appendChild(topCityContainer);
    topCityContainer.appendChild(topCityItem);
    topCityContainer.appendChild(topCityTempContainer);
    topCityTempContainer.appendChild(topCityTemp);
    topCityTempContainer.appendChild(topCityTempUnit);
};

export{buildLocDetails, buildLocStats, buildWeatherOutlook, buildWeeklyForecast, buildTopCititesList};