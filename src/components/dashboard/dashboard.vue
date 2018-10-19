<template>
  <div id="dashboard">
    <h1>That's the dashboard!</h1>
    <p>You should only get here if you're authenticated!</p>
  </div>
</template>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: ''
    }
  },
  created() {
    axios.get('https://vue-max-course.firebaseio.com/users.json')
      .then(response => console.log(response.data))
      .catch(err => console.log(err));
  }
}
</script>
