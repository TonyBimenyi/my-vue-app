<template>
  <!-- ================================================================
       NAVIGATION BAR
       ================================================================
       Appears on every page because it's rendered inside App.vue ABOVE
       the <RouterView />.  Uses <RouterLink> for SPA navigation
       (no full page reloads).
    -->
  <nav>
    <h2 class="brand">University App</h2>

    <ul class="nav-links">
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/students">Students</RouterLink>
      </li>
      <li>
        <RouterLink to="/students/add">Add Student</RouterLink>
      </li>
      <!--
        Courses link — currently there is no /courses route registered in
        router/index.js.  Clicking this will render an empty <RouterView />
        (no component matched).  When you add the route in router/index.js,
        uncommenting the line there will automatically make this work.
      -->
      <li>
        <RouterLink to="/courses">Courses</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script>
// This is a purely presentational / navigation component — it has no state
// and no logic.  All its behavior comes from <RouterLink> (Vue Router).
export default {
  name: "Navbar",
}
</script>

<style scoped>
nav {
  padding: 20px 32px;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.brand {
  margin: 0;
  font-size: 1.3rem;
}

.nav-links {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  padding: 6px 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.nav-links a:hover {
  color: #4a90e2;
}

/*
  `.router-link-active` is a CSS class AUTOMATICALLY added by Vue Router
  to any <RouterLink> whose target matches the current URL.  This is
  how you get "the current tab is highlighted" behavior.
*/
.router-link-active {
  font-weight: 800;
  color: #d33;
  border-bottom-color: #d33;
}
</style>
