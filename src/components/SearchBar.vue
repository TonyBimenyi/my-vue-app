<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="localCity"
      placeholder="Enter a city (e.g. Bujumbura)"
      @keyup.enter="handleSearch"
    />
    <button @click="handleSearch" :disabled="!localCity.trim()">
      Search
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  // Receives an optional initial city from the parent
  props: {
    initialCity: {
      type: String,
      default: ''
    }
  },
  // Emits a search event to the parent
  emits: ['search'],
  data() {
    return {
      localCity: this.initialCity
    }
  },
  methods: {
    handleSearch() {
      const city = this.localCity.trim()
      if (city) this.$emit('search', city)
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
}
input:focus {
  outline: 2px solid #3b82f6;
  border-color: transparent;
}
button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover:not(:disabled) { background: #2563eb; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>