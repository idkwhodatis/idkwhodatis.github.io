<template>
  <q-toolbar class="full-height q-gutter-x-md" style="padding:0;">
    <div class="flex-grow" style="flex-grow:0.3"></div>
    <label class="text-h5">idkwhodatis.github.io</label>
    <div class="flex-grow" style="flex-grow:3"></div>
    <q-btn :ripple="false" class="no-hover text-capitalize" flat color="text" label="Home"/>
    <q-btn :ripple="false" class="no-hover text-capitalize" flat color="text" label="Projects"/>
    <q-btn :ripple="false" class="no-hover text-capitalize" flat color="text" label="About"/>
    <q-btn @click="toRepo" :ripple="false" class="no-hover text-capitalize" flat color="text" label="Repo"/>
    <div class="flex-grow" style="flex-grow:1"></div>
  </q-toolbar>
</template>

<script>
export default{
  name:'TopBar',
  methods:{
    toRepo(){
      window.location.href='https://github.com/idkwhodatis/idkwhodatis.github.io'
    }
  }
}
</script>

<style>

</style>