import React, { useState, useEffect, useRef } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {

    const inputRef = useRef()

  const [weatherData, setWeatherData] = useState(null);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a3753b23cbafefc889307c508ccc5447`;
      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        alert(data.message);
        return;
      }
      console.log(data);

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        description: data.weather?.[0]?.description ?? '',
        location: `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}`,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false)
      console.error("Error in fetching weather data");
    }
  };

  useEffect(()=> {
    search("London");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="search" onClick={()=>search(inputRef.current.value)}/>
      </div>

      {weatherData?<>
      
     

      <img src={weatherData.icon} alt="weather icon" className="weather-icon" />

      <p className="temperature">
        {weatherData.temperature}°c</p>
      <p className="location">{weatherData.location}</p>
      <p style={{ textTransform: 'capitalize', marginTop: 6 }}>{weatherData.description}</p>
      <p style={{ opacity: 0.8, marginTop: 2 }}>Feels like {weatherData.feelsLike}°c</p>

      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="humidity" />
          <div>
            <p>{weatherData.humidity}%</p>
          
          
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <img src={wind_icon} alt="wind" />
          <div>
            <p>{weatherData.windSpeed} km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
       </>:<></>}
    </div>

  );
};

export default Weather;