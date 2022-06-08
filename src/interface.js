// This is all of the code that builds the user interface
import { utcToZonedTime, format} from 'date-fns-tz'

// This will build the "location-details" section of the main content container
function buildLocDetails(locData, timeZone){
    const locationHeaderDiv = document.querySelector('.location-header');
    // Location data
    const cityStateHead = document.createElement('p');
    cityStateHead.classList.add('city-state-head');
    cityStateHead.textContent = `${locData.city}, ${locData.state}`;
    // Time data
    let date = new Date();
    const newTimeZone = timeZone;
    const zonedDate = utcToZonedTime(date, timeZone);
    const datePattern = 'PPPPp';
    const output = format(zonedDate, datePattern, { newTimeZone});
    const dateHead = document.createElement('p');
    dateHead.classList.add('date-head');
    dateHead.textContent = `${output}`;
    // Append elements
    locationHeaderDiv.appendChild(cityStateHead);
    locationHeaderDiv.appendChild(dateHead);
};

function buildLocStats(data){
    const locationStatsDiv = document.querySelector('.location-stats');
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

    // Append elements
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

export{buildLocDetails, buildLocStats};