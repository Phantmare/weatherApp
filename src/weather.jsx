import React, { useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function Weather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [coordinates, setCoordinates] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    const GOOGLE_API_KEY = 'ded77b3111b753c7e67fbdcae8f8914a'
    const OPEN_WEATHER_API_KEY = 'AIzaSyCSi5DoaMDvFWn5wSrp9z3NdK-wCJ_vlok'
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather'
    const geoAPI_URL = `https://maps.googleapis.com/maps/api/geocode/json`

    try {
      const geoResponse = await fetch(`${geoAPI_URL}?address=${city}&key=${OPEN_WEATHER_API_KEY}`)
      const geoData = await geoResponse.json()

      if (geoData.status !== 'OK') {
        throw new Error('City not found')
      }

      const cityCoordinates = geoData.results[0].geometry.location
      setCoordinates(cityCoordinates)

      const response = await fetch(
        `${API_URL}?lat=${cityCoordinates.lat}&lon=${cityCoordinates.lng}&appid=${GOOGLE_API_KEY}&units=metric`
      )

      if (!response.ok) {
        throw new Error('Weather data not found')
      }

      const data = await response.json()
      setWeather(data)
    } catch (err) {
      setError('City not found')
      setWeather(null)
      setCoordinates(null)
    }
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCSi5DoaMDvFWn5wSrp9z3NdK-wCJ_vlok',
  })

  function getWeatherIcon (description){
    switch (description.toLowerCase()) {
      case 'clear sky':
        return 'bi bi-sun'
      case 'few clouds':
        return 'bi bi-cloud-sun'
      case 'scattered clouds':
        return 'bi bi-cloud'
      case 'broken clouds':
        return 'bi bi-cloud-drizzle'
      case 'shower rain':
        return 'bi bi-cloud-rain'
      case 'rain':
        return 'bi bi-cloud-rain-heavy'
      case 'thunderstorm':
        return 'bi bi-cloud-lightning'
      case 'snow':
        return 'bi bi-snow'
      case 'mist':
        return 'bi bi-cloud-fog'
      default:
        return 'bi bi-cloud'
    }
  }

  return (
    <div className="container text-center">
      <h1 className="main-title">Weather App</h1>

      {isLoaded && coordinates && (
        <div className="map-container" style={{ height: '400px', marginBottom: '20px' }}>
          <GoogleMap
            center={coordinates}
            zoom={12}
            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '16px'}}
          >
            <Marker position={coordinates} />
          </GoogleMap>
        </div>
      )}

      <Form onSubmit={handleSearch}>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-control"
          />
          <Button variant="primary" type="submit" className="btn btn-primary">
            Search
          </Button>
        </InputGroup>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {weather && (
        <div className="weather-details">
          <h2>{weather.name}</h2>
          <i className={`${getWeatherIcon(weather.weather[0].description)} weather-icon`} />
          <p>{weather.weather[0].description}</p>
          <p className="temp">{weather.main.temp}°C</p>
          <p className="humidity">Humidity: {weather.main.humidity}%</p>
          <p className="wind-speed">Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}
