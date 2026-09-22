<template>
  <div class="weather-card">
    <h2>{{ weather.city }}</h2>

    <img :src="iconUrl" :alt="weather.condition" class="icon" />

    <p class="temperature">{{ weather.temperature }}°C</p>
    <p class="condition">{{ weather.condition }}</p>

    <div class="details">
      <div class="detail">
        <span class="label">Humidité</span>
        <span class="value">{{ weather.humidity }} %</span>
      </div>
      <div class="detail">
        <span class="label">Vent</span>
        <span class="value">{{ weather.windSpeed }} km/h</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: {
      type: Object,
      required: true
    }
  },
  computed: {
    iconUrl() {
      // weather.icon contient le code Open-Meteo (ex: "01d")
      return `https://openweathermap.org/img/wn/${this.weather.icon}@2x.png`
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}
h2 { margin: 0 0 0.5rem; font-size: 1.75rem; }
.icon { width: 100px; height: 100px; }
.temperature { font-size: 3rem; font-weight: 700; margin: 0.5rem 0; }
.condition { text-transform: capitalize; opacity: 0.9; margin-bottom: 1.5rem; }
.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 12px;
}
.detail { display: flex; flex-direction: column; gap: 0.25rem; }
.label { font-size: 0.85rem; opacity: 0.85; }
.value { font-size: 1.1rem; font-weight: 600; }
</style>