<template>
  <!-- ================================================================
       STUDENT CARD — reusable presentation component
       ================================================================
       A dumb/presentational component: it receives ALL of its data via `props`
       from a parent and emits nothing (in this version).
       Parents (e.g. App.vue, StudentsView.vue) pass in:
         <StudentCard name="John" course="JS" :age="23" />
       This component has zero API calls, zero internal state.
    -->
  <div class="student-card">
    <h3>{{ name }}</h3>
    <p>Course: {{ course }}</p>
    <p>Age: {{ age }}</p>
  </div>
</template>

<script>
export default {
  name: "StudentCard",

  // ----------------------------------------------------------------
  // PROPS — inputs passed down from a parent component.
  // ----------------------------------------------------------------
  // Declaring the type + required status lets Vue warn you in the console
  // if a parent passes the wrong shape of data.
  props: {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: [String, Number], // accepts both a name string and a course ID
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>
.student-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px 0;
  border-radius: 6px;
  background: #fff;
  max-width: 320px;
}

.student-card h3 {
  margin: 0 0 10px;
}

.student-card p {
  margin: 4px 0;
  color: #444;
}
</style>
