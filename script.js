const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDate = document.querySelector('.current-date-txt');


// 🧊 Forecast container
const forecastContainer = document.querySelector('.forecast');

const apiKey = '37f1c63e81ee389314a43b42b1971bae';

// 🔹 Fetch weather or forecast data
async function getFetchData(endPoint, city) {
    const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    return response.json();
}

// 🔹 Choose weather icon by weather ID
function getWeatherIcon(id) {
    if (id <= 232) return `thunderstorm.svg`;
    if (id <= 321) return `drizzle.svg`;
    if (id <= 531) return `rain.svg`;
    if (id <= 622) return `snow.svg`;
    if (id <= 781) return `atmosphere.svg`;
    if (id === 800) return `clear.svg`;
    else return 'clouds.svg';
}

// 🔹 Format current date
function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

// 🔹 Button click search
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// 🔹 Enter key search
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

// 🔹 Update weather info
async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' ℃';
    conditionTxt.textContent = main;
    humidityTxt.textContent = humidity + '%';
    windTxt.textContent = speed + ' M/s';
    currentDate.textContent = getCurrentDate();
    weatherSummaryImg.src = `./assets/weather/${getWeatherIcon(id)}`;

    await forecastInfo(city);
    showDisplaySection(weatherInfoSection);
}

// 🔹 5-day forecast function
async function forecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    forecastContainer.innerHTML = ''; // Clear old forecast

    // Filter data → only 12:00 PM for each day
    const filteredForecast = forecastData.list.filter(item =>
        item.dt_txt.includes('12:00:00')
    );

    filteredForecast.slice(0, 5).forEach(dayData => {
        const date = new Date(dayData.dt_txt);
        const options = { day: '2-digit', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-GB', options);

        const {
            main: { temp },
            weather: [{ id, main }]
        } = dayData;

        // Create forecast card (matches your HTML structure)
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-text">${formattedDate}</h5>
            <img src="./assets/weather/${getWeatherIcon(id)}" alt="${main}">
            <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
            <p class="forecast-item-condition">${main}</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// 🔹 Show one section at a time
function showDisplaySection(sectionToShow) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach(
        (section) => (section.style.display = 'none')
    );
    sectionToShow.style.display = 'flex';
}
