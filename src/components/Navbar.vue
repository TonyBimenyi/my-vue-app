<template>
    <nav>
        <h2>University App</h2>

        <ul>
            <li>
                <RouterLink to="/">
                    Home
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/students">
                    Students
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/courses">
                    Courses
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    
}
</script>
<style scoped>
nav{
    padding: 20px;
    background-color: #eeeeee;
}
ul{
    display: flex;
    gap: 10px;
    list-style: none;
}
.router-link-active{
    font-weight: 800;
    color: red;
}
</style>