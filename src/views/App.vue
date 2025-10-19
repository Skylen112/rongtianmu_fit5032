<template>
   <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #80A1BA;
  font-family: Arial, sans-serif;
}

*:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>
