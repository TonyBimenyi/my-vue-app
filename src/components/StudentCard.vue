<template>
    <div class="student-card">
        <h3>{{ name }}</h3>
        <p> Course: {{ course }}</p>
        <p> Age: {{ age }}</p>
    </div>
</template>
<script>
export default {
    name: "StudentCard",

    props:{
        name: String,
        course: String,
        age: Number
    }
}
</script>
<style scoped>
.student-card{
    border: 1px solid #ccc;
    padding: 15px;
    margin: 10px;
}
</style>