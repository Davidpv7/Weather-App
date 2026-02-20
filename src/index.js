import "./styles.css"

const weatherForm = document.getElementById('weatherForm');
const inputSearch = document.getElementById('input-bar');
const card = document.querySelector('.card');
const apiKeyWeather = 'PU9U9K8Q54VQL5429LNJFVMUM';
const apiKeyGif = 'hR1QMQqSHuBfxE0kNh92xoapGGrAnJbI&s';

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const city = inputSearch.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);

        }
        catch(error){
            console.error(error);
            displayError(error)
        }
    } else{
        displayError("Please enter a city");
    };
});

async function getWeatherData(city){
    const apiurl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKeyWeather}`;

    const response = await fetch(apiurl);

    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
};

async function displayWeatherInfo(data){
    const {resolvedAddress: city, currentConditions: {temp, humidity}, description: description} = data;

    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descriptionDisplay = document.createElement('p');
    const gifDisplay = document.createElement('div');

    const tempCelsius = ((temp - 32) * 5 / 9).toFixed(1);

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${tempCelsius}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descriptionDisplay.textContent = description;

    let gifKeyword;

    if(tempCelsius <= 0) {
        gifKeyword = 'freezing';
    } else if (tempCelsius <= 10) {
        gifKeyword = 'cold';
    } else if (tempCelsius <= 20) {
        gifKeyword = 'cool';
    } else if (tempCelsius <= 30) {
        gifKeyword = 'warm';
    } else {
        gifKeyword = 'hot';
    };

    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descriptionDisplay.classList.add('descriptionDisplay');
    gifDisplay.classList.add('gifDisplay');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descriptionDisplay);
    card.appendChild(gifDisplay);

    try {
        const gifUrl = await getWeatherGif({description: gifKeyword});
        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = description;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        gifDisplay.appendChild(img);
    } catch(error){
        gifDisplay.textContent = 'No GIF available';
    }
};

async function getWeatherGif(data){
    const {description: description} = data

    const apiurl = `https://api.giphy.com/v1/gifs/translate?api_key=hR1QMQqSHuBfxE0kNh92xoapGGrAnJbI&s=${description}`;

    const response = await fetch(apiurl);

    if(!response.ok){
        throw new Error('Gif not available');
    }

    const json = await response.json();

    return json.data.images.downsized_medium.url;
}

function displayError(message){
    const errorDisplay = document.createElement('p');

    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
};
