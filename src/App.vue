<!-- <template>
  <div>
    <Navbar/>
    <h1>Welcome to the unversity application</h1>
    <StudentCard
    name="John"
    course="Software Engineering"
    :age="25"
    />
    <StudentCard
    name="Alice"
    course="JavaScript"
    :age="20"
    />
    <StudentCard
    name="David"
    course="IT"
    :age="21"
    />
  </div>
</template>
<script>
import Navbar from '../src/components/Navbar.vue'
import StudentCard from '../src/components/StudentCard.vue'
export default {
  name: "App",
  components:{
    Navbar,
    StudentCard
  }
}
</script>
<style>
</style>

 -->


 <template>
    <div>
      <Navbar/>
      <main>
        <RouterView/>
      </main>
      <!-- <Footer -->
    </div>
 </template>
 <script>
 import Navbar from '../src/components/Navbar.vue'
 export default {
  components:{
    Navbar
  }
 }
 </script>
