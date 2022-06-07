import './style.css';

// this var will act as the value passed in through search bar
let testLoc = 'tampa';

// Factory Function to create the location object
const queriedLocation = (lat, lon, city, state) => {
    return { lat, lon, city, state };
};

// We will use the Geocoding API to get location data of an entered location and create an object using our factory function 
async function getLocationData(loc){
    const response = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + loc + '&limit=1&appid=daf462f3a0662d022ea6cbe67da83b38');
    const locationData = await response.json();
    let searchQuery = queriedLocation(locationData['0'].lat,locationData['0'].lon,locationData['0'].name,locationData['0'].state);
    console.log(searchQuery);
    return searchQuery;
};




// TESTING PURPOSES
async function testFunc(){
    let anotherTest = await getLocationData(testLoc);
    console.log(anotherTest.state);
}

testFunc();
// TESTING PURPOSES