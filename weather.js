// ---- weather.js ----
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const weatherDiv = document.getElementById("weatherResult");

searchBtn.addEventListener("click", fetchWeather);

async function fetchWeather() {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    weatherDiv.innerHTML = "⚠️ Please enter a city name.";
    return;
  }
  weatherDiv.innerHTML = "⏳ Searching for location...";
  searchBtn.disabled = true;

  try {
    // 1. Geocoding: Convert city name to coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${cityName}" not found.`);
    }

    const { latitude, latitude: lat, longitude: lon, name: foundName, country } = geoData.results[0];

    // 2. Weather: Fetch current conditions using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // 3. Extract and display the data
    const temperature = weatherData.current_weather.temperature;
    const windspeed = weatherData.current_weather.windspeed;

    weatherDiv.innerHTML = `
      <h2>${foundName}, ${country}</h2>
      <p>🌡️ Temperature: ${temperature}°C</p>
      <p>💨 Wind Speed: ${windspeed} km/h</p>
      <small>Powered by Open-Meteo.com</small>
    `;
  } catch (error) {
    console.error("Error:", error);
    weatherDiv.innerHTML = `❌ ${error.message}`;
  } finally {
    searchBtn.disabled = false;
  }
}