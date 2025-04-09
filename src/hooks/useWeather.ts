import axios from "axios";
import type { SearchType } from "../types";
import { z } from "zod";
import { useMemo, useState } from "react";
//import { object, string, number, InferOutput, parse } from "valibot";
// function isWeatherResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_max === "number" &&
//     typeof (weather as Weather).main.temp_min === "number"
//   );
// }

// ZOD Schema
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});
const INIT_STATE = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};
export type Weather = z.infer<typeof Weather>;

//Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });
// type Weather = InferOutput<typeof WeatherSchema>;
export default function useWeather() {
  const appId = import.meta.env.VITE_API_KEY;
  const [weather, setWeather] = useState<Weather>(INIT_STATE);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const getGeo = async (
    search: SearchType
  ): Promise<{ lat: number; lon: number }> => {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
    const { data } = await axios.get(geoURL);
    if (!data[0]) {
      console.log("clima no encontrado");
      setNotFound(true);
      throw new Error("Ciudad no existe");
    }
    setNotFound(false);
    const lat = data[0].lat;
    const lon = data[0].lon;
    return { lat, lon };
  };
  const getWeather = async (lat: number, lon: number): Promise<Weather> => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`;
    //type guards
    const { data } = await axios.get(weatherURL);
    //const result = isWeatherResponse(data);

    //zod
    const result = Weather.safeParse(data);
    if (result.success) {
      return result.data;
    } else {
      throw new Error("Objeto de clima incorrecto");
    }

    //Valibot
    // const result = parse(WeatherSchema, data);
    // if (result) {
    //   return result;
    // } else {
    //   throw new Error("Objeto de clima incorrecto");
    // }
  };
  const fetchWeather = async (search: SearchType) => {
    try {
      setWeather(INIT_STATE);
      setLoading(true);
      const { lat, lon } = await getGeo(search);
      const weather = await getWeather(lat, lon);
      setWeather(weather);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const hasWeatherData = useMemo(() => weather.name.length > 0, [weather]);
  return { weather, hasWeatherData, loading, notFound, fetchWeather };
}
