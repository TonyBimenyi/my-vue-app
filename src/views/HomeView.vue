<template>
    <div>
        <h1>Welcome to the Home Page</h1>

        <p>This is the home page of our university </p>

        <button @click="goToStudents">
            View Students
        </button>
    </div>
</template>
<script>
export default {
    methods:{
        goToStudents(){
            this.$router.push("/students")
        }
    }
}
</script>