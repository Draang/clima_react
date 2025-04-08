import axios from "axios";
import type { SearchType, Weather } from "../types";
function isWeatherResponse(weather: unknown): weather is Weather {
  return (
    Boolean(weather) &&
    typeof weather === "object" &&
    typeof (weather as Weather).name === "string" &&
    typeof (weather as Weather).main.temp === "number" &&
    typeof (weather as Weather).main.temp_max === "number" &&
    typeof (weather as Weather).main.temp_min === "number"
  );
}
export default function useWeather() {
  const appId = import.meta.env.VITE_API_KEY;
  const getGeo = async (
    search: SearchType
  ): Promise<{ lat: number; lon: number }> => {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
    const { data } = await axios.get(geoURL);
    const lat = data[0].lat;
    const lon = data[0].lon;
    return { lat, lon };
  };
  const getWeather = async (lat: number, lon: number): Promise<Weather> => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
    //type guards
    const { data } = await axios.get(weatherURL);
    const result = isWeatherResponse(data);
    if (result) {
      return data;
    } else {
      throw new Error("Objeto de clima incorrecto");
    }
  };
  const fetchWeather = async (search: SearchType) => {
    try {
      const { lat, lon } = await getGeo(search);
      const weather = await getWeather(lat, lon);
      console.log(weather);
    } catch (error) {
      console.error(error);
    }
  };
  return { fetchWeather };
}
