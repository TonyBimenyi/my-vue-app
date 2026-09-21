<template>
    <div>
        <h1>Student Details</h1>
        <p>Student ID: {{ studentId }}</p>
    </div>
</template>
<script>
export default {
    name: "StudentDetailVIew",
    computed:{
        studentId(){
            return this.$route.params.id
        }
    }
}
</script>