<template>
  <q-toolbar class="full-height q-gutter-x-md" style="padding:0;">
    <div class="flex-grow" style="flex-grow:0.3"></div>
    <label class="text-h5">idkwhodatis.github.io</label>
    <div class="flex-grow" style="flex-grow:3"></div>
    <q-btn @click="toHome(true)" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Home"/>
    <q-btn @click="toHome(false)" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Projects"/>
    <q-btn @click="toAbout" :ripple="false" class="no-hover text-capitalize" flat color="text" label="About"/>
    <q-btn @click="toRepo" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Repo"/>
    <div class="flex-grow" style="flex-grow:1"></div>
  </q-toolbar>
</template>

<script>
import bus from '../utils/EventBus.js'

export default{
  name:'TopBar',
  methods:{
    toHome(toHome){
      if(this.$route.path!=='/'){
        this.$router.push('/');
      }else{
        if(toHome){
          bus.emit('scrollTo',true);
        }else{
          bus.emit('scrollTo',false);
        }
      }
    },
    toAbout(){
      this.$router.push('/about');
    },
    toRepo(){
      window.location.href='https://github.com/idkwhodatis/idkwhodatis.github.io'
    }
  }
}
</script>

<style>

</style>