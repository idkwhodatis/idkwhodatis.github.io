<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" style="height:60px">
      <TopBar/>
    </q-header>

    <q-page-container class="bg-primary text-white">
      <RouterView/>
    </q-page-container>
  </q-layout>
</template>

<script>
import TopBar from './components/TopBar.vue'
export default{
  components:{
    TopBar
  }
};
</script>

<style>
#app {
  width:100%;
}
.no-hover .q-focus-helper{
  display:none !important;
}
::-webkit-scrollbar {
   display:none;
}
* {
  scrollbar-width:none;
  -ms-overflow-style:none;
}
</style>
