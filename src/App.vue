<template>
  <div class="app">
    <header>
      <h1>🌤️ Weather App</h1>
      <p class="subtitle">Recherchez la météo d'une ville</p>
    </header>

    <main class="container">
      <SearchBar :initial-city="city" @search="onSearch" />

      <!-- État : chargement -->
      <LoadingMessage v-if="loading" />

      <!-- État : erreur -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- État : succès -->
      <WeatherCard v-else-if="weather" :weather="weather" />

      <!-- État : initial (aucune recherche) -->
      <div v-else class="empty">
        <p>Entrez le nom d'une ville pour commencer.</p>
        <p class="hint">Essayez : Bujumbura, Tokyo, Nairobi, Shanghai, Paris</p>
      </div>

      <!-- v-show : historique (toujours dans le DOM) -->
      <div v-show="history.length > 0" class="history">
        <h3>Recherches récentes</h3>
        <ul>
          <li v-for="(item, index) in history" :key="index" @click="onSearch(item)">
            {{ item }}
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import LoadingMessage from './components/LoadingMessage.vue'

// Table de correspondance code WMO (Open-Meteo) -> code icône OpenWeatherMap
const WMO_TO_ICON = {
  0: '01d', 1: '02d', 2: '03d', 3: '04d',
  45: '50d', 48: '50d',
  51: '09d', 53: '09d', 55: '09d',
  61: '10d', 63: '10d', 65: '10d',
  71: '13d', 73: '13d', 75: '13d', 77: '13d',
  80: '09d', 81: '09d', 82: '09d',
  85: '13d', 86: '13d',
  95: '11d', 96: '11d', 99: '11d'
}

const WMO_TO_TEXT = {
  0: 'Ciel dégagé', 1: 'Principalement dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
  45: 'Brouillard', 48: 'Brouillard givrant',
  51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
  61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
  71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte', 77: 'Grains de neige',
  80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
  85: 'Averses de neige', 86: 'Fortes averses de neige',
  95: 'Orage', 96: 'Orage avec grêle', 99: 'Orage violent avec grêle'
}

export default {
  name: 'App',
  components: { SearchBar, WeatherCard, LoadingMessage },
  data() {
    return {
      city: '',
      weather: null,
      loading: false,
      error: '',
      history: []   // Bonus : historique de recherche
    }
  },
  methods: {
    async onSearch(cityName) {
      // Réinitialisation des états
      this.loading = true
      this.error = ''
      this.weather = null
      this.city = cityName

      try {
        // 1. Géocodage : nom de ville -> coordonnées
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`
        const geoRes = await fetch(geoUrl)
        if (!geoRes.ok) throw new Error('NETWORK')

        const geoData = await geoRes.json()
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('NOT_FOUND')
        }

        const { latitude, longitude, name, country } = geoData.results[0]

        // 2. Météo actuelle via coordonnées
        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
          `&timezone=auto`

        const weatherRes = await fetch(weatherUrl)
        if (!weatherRes.ok) throw new Error('NETWORK')

        const weatherData = await weatherRes.json()
        const c = weatherData.current

        this.weather = {
          city: `${name}, ${country}`,
          temperature: Math.round(c.temperature_2m),
          humidity: c.relative_humidity_2m,
          windSpeed: Math.round(c.wind_speed_10m),
          condition: WMO_TO_TEXT[c.weather_code] || 'Inconnu',
          icon: WMO_TO_ICON[c.weather_code] || '01d'
        }

        // Ajout à l'historique (max 5, sans doublon)
        if (!this.history.includes(name)) {
          this.history.unshift(name)
          if (this.history.length > 5) this.history.pop()
        }
      } catch (err) {
        if (err.message === 'NOT_FOUND') {
          this.error = `Ville "${cityName}" introuvable. Vérifiez l'orthographe.`
        } else {
          this.error = 'Erreur réseau. Vérifiez votre connexion et réessayez.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  min-height: 100vh;
  color: #1e293b;
}
</style>

<style scoped>
.app { min-height: 100vh; padding: 2rem 1rem; }
header { text-align: center; margin-bottom: 2rem; }
h1 { margin: 0; font-size: 2rem; color: #1e40af; }
.subtitle { color: #64748b; margin-top: 0.5rem; }
.container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid #ef4444;
}
.empty { text-align: center; padding: 2rem 1rem; color: #64748b; }
.hint { font-size: 0.9rem; margin-top: 0.75rem; font-style: italic; }
.history { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; }
.history h3 { margin: 0 0 0.75rem; font-size: 1rem; color: #475569; }
.history ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.history li {
  padding: 0.4rem 0.9rem;
  background: #f1f5f9;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.history li:hover { background: #dbeafe; color: #1e40af; }
</style>