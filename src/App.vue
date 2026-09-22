<template>
  <!-- ================================================================
       ROOT APP COMPONENT
       ================================================================
       This component never unmounts.  It wraps every page in the app:
         1. <Navbar />            — always visible top nav
         2. <main><RouterView /></main> — the active route's component
                                          gets rendered here
       When the user navigates (e.g. clicks a RouterLink), only
       <RouterView /> swaps out — Navbar + the root App itself stay.
    -->
  <div id="app-shell">
    <Navbar />
    <main>
      <!--
        `key="$route.fullPath"` forces RouterView to remount the page
        component on every URL change.  Without this, navigating from
        /students/1 to /students/2 would reuse StudentsDetailsView
        and the `watch: { studentId }` hook would fire — which works,
        but including the key makes navigation easier to reason about
        for beginners.  Remove it once you're comfortable with
        component reuse + watchers.
      -->
      <RouterView :key="$route.fullPath" />
    </main>
    <!-- TODO: add <Footer /> here if you want one. -->
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue"

export default {
  name: "App",
  components: {
    Navbar,
  },
}
</script>

<style>
/*
  GLOBAL (non-scoped) styles — these apply to every page in the app.
  Scoped styles (in each .vue file) only apply within that component.
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: #fafafa;
  color: #222;
}

main {
  /* Matches Navbar's horizontal padding so body content lines up */
  padding: 4px 32px 32px;
}

h1, h2, h3 {
  color: #222;
}
</style>
