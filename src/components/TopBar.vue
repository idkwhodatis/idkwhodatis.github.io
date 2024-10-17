<template>
  <q-toolbar class="full-height q-gutter-x-md" style="padding:0;">
    <div class="flex-grow" style="flex-grow:0.3"></div>
    <label class="text-h5">idkwhodatis.github.io</label>
    <div class="flex-grow" style="flex-grow:3"></div>
    <template v-if="!isMobile">
      <q-btn @click="toHome(true)" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Home"/>
      <q-btn @click="toHome(false)" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Projects"/>
      <q-btn @click="toReact" :ripple="false" class="no-hover text-capitalize" flat color="text" label="React"/>
      <q-btn @click="toAbout" :ripple="false" class="no-hover text-capitalize" flat color="text" label="About"/>
      <q-btn @click="toRepo" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Repo"/>
    </template>
    <template v-else>
      <q-btn-dropdown :ripple="false" class="text-capitalize" flat color="text" style="margin:0;padding-right:0" :style="currSection=='Projects'?'padding-left:4px':''" :label="currSection">
        <q-list class="bg-primary text-white">
          <q-item @click="toHome(true)" clickable v-close-popup>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item @click="toHome(false)" clickable v-close-popup>
            <q-item-section>
              <q-item-label>Projects</q-item-label>
            </q-item-section>
          </q-item>
          <q-item @click="" clickable v-close-popup>
            <q-item-section>
              <q-item-label>React</q-item-label>
            </q-item-section>
          </q-item>
          <q-item @click="toAbout" clickable v-close-popup>
            <q-item-section>
              <q-item-label>About</q-item-label>
            </q-item-section>
          </q-item>
          <q-item @click="toRepo" clickable v-close-popup>
            <q-item-section>
              <q-item-label>Repo</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
    <div class="flex-grow" style="flex-grow:1"></div>
  </q-toolbar>
</template>

<script>
import bus from '../utils/EventBus.js'
import store from '../utils/Store.js'

export default{
  name:'TopBar',
  inject:['isMobile'],
  methods:{
    toHome(toHome){
      if(this.$route.path!=='/'){
        this.$router.push('/').then(()=>{
          if(!toHome){
            setTimeout(()=>{
              bus.emit('scrollTo','projects');
            })
          }else{
            store.currSection='Home';
          }
        });
      }else{
        bus.emit('scrollTo',toHome);
      }
    },
    toAbout(){
      if(this.$route.path!=='/about'){
        this.$router.push('/about');
      }
    },
    toReact(){
      window.location.href='https://idkwhodatis.github.io/idkwhodatis.github.io-react/';
    },
    toRepo(){
      window.location.href='https://github.com/idkwhodatis/idkwhodatis.github.io';
    }
  },
  computed:{
    currSection(){
      return store.currSection;
    }
  }
}
</script>

<style>

</style>