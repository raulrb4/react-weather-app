import React, { useState } from 'react'
import searchIcon from '../assets/search.png'
import './Weather.css'
import humidityIcon from '../assets/humidity.png'
import wind from '../assets/wind.png'
import axios from 'axios'
import clearDay from '../assets/day/Clear.png'
import cloudsDay from '../assets/day/Clouds.png'
import drizzleDay from '../assets/day/Drizzle.png'
import rainDay from '../assets/day/Rain.png'
import thunderstormDay from '../assets/day/Thunderstorm.png'
import snowDay from '../assets/day/Snow.png'
import atmosphereDay from '../assets/day/Atmosphere.png'
import clearNight from '../assets/night/Clear.png'
import cloudsNight from '../assets/night/Clouds.png'
import drizzleNight from '../assets/night/Drizzle.png'
import rainNight from '../assets/night/Rain.png'
import thunderstormNight from '../assets/night/Thunderstorm.png'
import snowNight from '../assets/night/Snow.png'
import atmosphereNight from '../assets/night/Atmosphere.png'
import errorIcon from '../assets/404.png'

const Weather = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const [search, searchInput] = useState('')
  const [weatherIcon, setWeatherIcon] = useState('')
  const [temp, setTemp] = useState('')
  const [city, setCity] = useState('')
  const [humidity, setHumidity] = useState('')
  const [windSpeed, setWindSpeed] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleChangeSearch = (event) => {
    searchInput(event.target.value)
  }
  const handleClickSearch = async () => {
    setShowResults(false)
    try {
      if (!search) {
        return
      }

      const coordenadasReq = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${apiKey}`)

      if (!coordenadasReq.data || !coordenadasReq.data[0]) {
        setWeatherIcon(errorIcon)
        setCity('Not Found City')
        setTemp('')
        setHumidity('')
        setWindSpeed('')
        setShowResults(true)
        return
      }

      const lat = coordenadasReq.data[0].lat
      const lon = coordenadasReq.data[0].lon

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)

      const weather = response.data.weather[0].main

      const { dt, timezone } = response.data
      const localDate = new Date((dt + timezone + 10800) * 1000)
      const isDaytime = localDate.getHours() >= 6 && localDate.getHours() < 18

      const weatherIcons = {
        Clear: isDaytime ? clearDay : clearNight,
        Clouds: isDaytime ? cloudsDay : cloudsNight,
        Drizzle: isDaytime ? drizzleDay : drizzleNight,
        Rain: isDaytime ? rainDay : rainNight,
        Thunderstorm: isDaytime ? thunderstormDay : thunderstormNight,
        Snow: isDaytime ? snowDay : snowNight,
        Atmosphere: isDaytime ? atmosphereDay : atmosphereNight,
        Default: errorIcon,
      };

      setWeatherIcon(weatherIcons[weather] || weatherIcons.Default);

      setTemp(`${Math.round(response.data.main.temp - 273.15)}°C`)
      setCity(response.data.name)
      setHumidity(`${response.data.main.humidity}%`)
      setWindSpeed(`${Math.round(response.data.wind.speed * 3.6)}Km/h`)
      setShowResults(true)

    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  return (
    <div className='weather'>
      <div className='search'>
        <input onChange={handleChangeSearch} type="text" placeholder='Search' />
        <button onClick={handleClickSearch}><img src={searchIcon} alt="" /></button>
      </div>
      <div className={`info ${showResults ? 'show' : ''}`}>
        <img className="info-img" src={weatherIcon} />
        <h1 className='info-temp'>{temp}</h1>
        <h2 className='info-city'>{city}</h2>
        <div className="info-statistics">
          {humidity.trim() !== '' && (
            <div className="info-statistics-humidity">
              <img src={humidityIcon} />
              <div className='info-statistics-humidity-text'>
                <p>{humidity}</p>
                <span>Humidity</span>
              </div>
            </div>
          )}
          {windSpeed.trim() !== '' && (
            <div className="info-statistics-wind">
              <img src={wind} />
              <div className="info-statistics-wind-text">
                <p>{windSpeed}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


export default Weather