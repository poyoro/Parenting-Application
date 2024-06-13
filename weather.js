function displayModal() {
    console.log('displayModal called');
    const modal = document.getElementById('weather-clothing-modal');
    const weatherData = JSON.parse(localStorage.getItem('currentWeather'));

    if (weatherData) {
        const temp = Math.round(weatherData.main.temp - 273.15);
        const weatherCondition = weatherData.weather[0].description;

        console.log('Temperature:', temp);
        console.log('Weather Condition:', weatherCondition);

        const suggestions = getClothingSuggestions(temp, weatherCondition);
        document.getElementById('clothing-suggestions').innerHTML = suggestions;
        
    } else {
        console.log('No weather data found in localStorage.');
    }

    modal.style.display = 'block';
}

function getClothingSuggestions(temp, weatherCondition) {
    console.log('getClothingSuggestions called with temp:', temp, 'and weatherCondition:', weatherCondition);
    let suggestions = '';

    switch (true) {
        case (temp >= 30):
            suggestions = `
                <p><strong>Hot-weather layers for kids:</strong></p>
                <ul>
                    <li>Synthetic or merino wool regular underwear and short-sleeve T-shirt</li>
                    <li>Convertible quick-dry nylon hiking pants</li>
                    <li>Long-sleeve quick-dry sun shirt and/or lightweight wind jacket</li>
                </ul>
            <br>
                <p><strong>Outdoor Activities:</strong></p>
                <ul>
                    <li>Picnic in the park</li>
                    <li>Hiking</li>
                    <li>Cycling</li>
                    <li>Outdoor sports (soccer, basketball, etc.)</li>
                </ul>`;
            break;
        case (weatherCondition.includes('rain')):
            suggestions = `
                <p><strong>Rainy-weather layers for kids:</strong></p>
                <ul>
                    <li>Lightweight polyester or wool long underwear top and bottom</li>
                    <li>Lightweight fleece jacket</li>
                    <li>Synthetic hiking pants</li>
                    <li>Lightweight waterproof/breathable rain jacket and pants</li>
                </ul><br>
                <p><strong>Indoor Activities:</strong></p>
                <ul>
                    <li>Board games</li>
                    <li>Movie marathon</li>
                    <li>Cooking or baking</li>
                    <li>Arts and crafts</li>
                </ul>`;
            break;
        case (temp >= 20 && temp < 30):
            suggestions = `
                <p><strong>Warm-weather layers for kids:</strong></p>
                <ul>
                    <li>Lightweight shirt and pants</li>
                    <li>Optional light jacket or sweater</li>
                </ul><br>
                <p><strong>Indoor & Outdoor Activities:</strong></p>
                <ul>
                    <li>Board games</li>
                    <li>Movie marathon</li>
                    <li>Cooking or baking</li>
                    <li>Arts and crafts</li>
                </ul>`;
            break;
        case (temp <= 15):
            suggestions = `
                <p><strong>Cold-weather layers for kids:</strong></p>
                <ul>
                    <li>Midweight polyester or wool long underwear top and bottom</li>
                    <li>A midweight fleece jacket or wool sweater</li>
                    <li>Nylon hiking pants or midweight fleece pants</li>
                    <li>Lightweight waterproof/breathable rain jacket and pants</li>
                </ul><br>
                <p><strong>Cold Or Snowy Day Activities:</strong></p>
                <ul>
                    <li>Building a snowman</li>
                    <li>Sledding</li>
                    <li>Skiing or snowboarding</li>
                    <li>Hot cocoa by the fireplace</li>
                    <li>Board games</li>
                    <li>Movie marathon</li>
                    <li>Cooking or baking</li>
                    <li>Arts and crafts</li>
                    <li>Reading a book</li>
                </ul>`;
            break;
        default:
            suggestions = `
                <p><strong>Mild-weather layers for kids:</strong></p>
                <ul>
                    <li>Lightweight shirt and pants</li>
                    <li>Optional light jacket or sweater</li>
                </ul><br>
                <p><strong>General Activities:</strong></p>
                <ul>
                    <li>Reading a book</li>
                    <li>Playing indoor games</li>
                    <li>Exploring local indoor attractions</li>
                </ul>`;
            break;
    }

    console.log('Clothing Suggestions:', suggestions);
    return suggestions;
}

function getWeather() {
    console.log('getWeather called');
    const apiKey = 'aaf636b139db6adf0648b2ec4b2ce0c1';
    const city = document.getElementById('city').value;
    
    if (!city) {
        alert('Please enter a city');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current weather data:', data);
            if (data.cod === 200) {
                displayWeather(data);
                localStorage.setItem('currentWeather', JSON.stringify(data));
                document.getElementById("what-to-wear-btn").style.display = "block";
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast data:', data);
            if (data.cod === "200") {
                displayHourlyForecast(data.list);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });

}

function displayWeather(data) {
    console.log('displayWeather called with data:', data);
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(hourlyData) {
    console.log('displayHourlyForecast called with data:', hourlyData);
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);
    hourlyForecastDiv.innerHTML = '';

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function closeModal() {
    console.log('closeModal called');
    const modal = document.getElementById('weather-clothing-modal');
    modal.style.display = 'none';
}


window.onclick = function(event) {
    const modal = document.getElementById('weather-clothing-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Attach the getWeather function to the window for easier debugging
window.getWeather = getWeather;
