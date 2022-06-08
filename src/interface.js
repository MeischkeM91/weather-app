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
    dateHead.textContent = `${output}`
    // Append elements
    locationHeaderDiv.appendChild(cityStateHead);
    locationHeaderDiv.appendChild(dateHead);
}

export{buildLocDetails};