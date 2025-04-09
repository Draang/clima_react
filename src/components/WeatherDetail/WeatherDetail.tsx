import type { Weather } from "../../hooks/useWeather";
import styles from "./WeatherDetail.module.css";
type WeatherDetailProps = {
  weather: Weather;
};
export default function WeatherDetail({ weather }: WeatherDetailProps) {
  return (
    <div className={styles.container}>
      <h2>
        Clima de: <span>{weather.name}</span>
      </h2>

      <p className={styles.current}>{weather.main.temp}&deg;C</p>
      <div className={styles.temperatures}>
        <p>
          Min: <span>{weather.main.temp_min}&deg;C</span>
        </p>
        <p>
          Max: <span>{weather.main.temp_max}&deg;C</span>
        </p>
      </div>
    </div>
  );
}
