<template>
  <!-- ================================================================
       HOME / LANDING VIEW (/)
       ================================================================
       Simple welcome page.  Demonstrates programmatic navigation via
       this.$router.push() — the imperative alternative to <RouterLink>.
    -->
  <div class="home">
    <h1>Welcome to the University App</h1>

    <p class="lead">This is the home page of your student management app.</p>

    <ul class="quick-links">
      <li>
      <RouterLink to="/students">Browse students list</RouterLink>
      </li>
      <li>
        <RouterLink to="/students/add">Add a new student</RouterLink>
      </li>
    </ul>

    <!--
      Programmatic navigation example:
      does the same thing as <RouterLink to="/students"> but from code.
      Useful when the navigation needs to happen inside an if/else, after an
      API call, etc.
    -->
    <button class="cta-btn" @click="goToStudents">
      View Students →
    </button>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  methods: {
    /** Imperatively navigate to /students. */
    goToStudents() {
      // Option A — by path string:
      this.$router.push("/students")
      //
      // Option B — by route name (defined in router/index.js):
      //   this.$router.push({ name: "students" })
    },
  },
}
</script>

<style scoped>
.home {
  padding: 16px 0;
}

.lead {
  font-size: 1.1rem;
  color: #555;
}

.quick-links {
  padding-left: 20px;
  margin: 16px 0 28px;
  line-height: 1.9;
}

.quick-links a {
  color: #4a90e2;
  text-decoration: none;
}

.quick-links a:hover {
  text-decoration: underline;
}

.cta-btn {
  padding: 12px 26px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #4a90e2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cta-btn:hover {
  background: #3b7acb;
}
</style>
