<template>
 <h1>Student Information</h1>
 <p>Full Name: {{ name + " " + " John "  }}</p>
 <p>Age: {{ age + 3 }}</p>
 <p>Course: {{ course.toUpperCase() }}</p>
 <p> university: {{ university }}</p>
 <p>{{ message }}</p>
 <!-- <img :src="imageURL" :alt="alt">
   -->
   <button @click="changeMessage">
    Click Me 
   </button>

   <button @click="sayHello('John')">
    Say Hello
   </button>

   <h1>V-IF EXAMPLE</h1>
   <button @click="toggleLogin">
     LogIn/ LogOut
   </button>
   <p v-if="isLoggedIn">
     Welcome to your dashboard !
   </p>



   <p v-else>
    Please Log In!
   </p>

      <h1>V-ELSE-IF</h1>

    <p v-if="mark >=80">
      Excellent
    </p>
    <p v-else-if="mark >= 60">
      Good
    </p>
    <p v-else-if="mark >= 50">
      Pass
    </p>
    <p v-else>
      Fail
    </p>

    <h1> V-FOR EXAMPLE</h1>

    <table>
      <tr>
        <th>ID Number</th>
        <th>Name</th>
        <th>Course</th>
      </tr>
      <tr v-for="st in students" :key="st.id">
        <td >
          {{ st.id }}
        </td>
        <td>
          {{ st.name }}
        </td>
        <td>
          {{ st.course }}
        </td>
      </tr>
    </table>

    <h1>STATE</h1>

    <h2>Count: {{ count }}</h2>
    <button @click="increase">
      Increase
    </button>
    <button @click="reset">
      Reset
    </button>
    <button @click="decrease">
      Descrease
    </button>

    <h1>V-MODEL</h1>
    <form @submit.prevent="submitForm()">
      <input type="text" v-model="inputText" placeholder="Write any text">
      <button type="submit">
        Submit
      </button>
    </form>
    
    <p>The message is: {{ inputText }}</p>

    

    <h1>COMPUTED</h1>

    <p>The average: {{ average }}</p>

    <h1>WATCH</h1>

    <p>{{ message }}</p>
</template>


<script>
export default {
  name: "App",
  data(){
    return{
      name : "Alice",
      age: 23,
      course: "Javascript",
      university: "BIU",
      message:"Hello Students",
      isLoggedIn: false,
      mark:40,
      students:[
        {id:1, name:'John', course:'JavaSCript'},
        {id:2, name:'Alice', course:'Vue.Js'},
        {id:3, name:'David', course: 'Python'}
      ],
      count:0,
      inputText:'',
      marks:[20,45,65,23],
      message:'',
    }
  },
  methods:{
    changeMessage(){
      this.message = "Welcome to vue.js Course"
    },
    sayHello(name){
      this.message = "Hello" + " " + name;
    },
    toggleLogin(){
      this.isLoggedIn = !this.isLoggedIn
    },
    increase(){
      this.count++
    },
    reset(){
      this.count=0
    },
    decrease(){
      this.count--
    },
    submitForm(){
      alert("I just submit:" + this.inputText)
    }
  },
  computed:{
      average(){
        let total = 0
        for(let mark of this.marks){
          total += mark
        }
        return total/this.marks.length
      }
  },
  watch:{
    inputText(newValue, oldValue){
      this.message = "Name changed from" + " " +  oldValue + " " + "to" + " " + newValue;
    }
  }

};
</script>
<style>
</style>





