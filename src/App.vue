<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" style="height:60px">
      <TopBar/>
    </q-header>

    <q-page-container class="bg-primary text-white">
      <RouterView v-slot="{Component}">
        <component :is="Component"/>
      </RouterView>
    </q-page-container>
  </q-layout>
</template>

<script>
import {RouterView} from 'vue-router';
import TopBar from './components/TopBar.vue'

export default{
  components:{
    TopBar
  },
  data(){
    return {
    }
  },
  mounted(){
  },
  methods:{
  }
};
</script>

<style>
#app{
  width:100%;
  overflow:hidden;
}
.no-hover .q-focus-helper{
  display:none !important;
}
::-webkit-scrollbar{
   display:none;
}
*{
  scrollbar-width:none;
  -ms-overflow-style:none;
}
</style>
