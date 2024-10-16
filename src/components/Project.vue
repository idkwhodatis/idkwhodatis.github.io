<template>
  <q-card class="bg-secondary card" :class="isMobile?'col-10':''">
    <q-video v-if="project.category==='music'" :src="project.preview" :ratio="4/3"/>
    <q-img v-else @click="imgDialog=true" :src="preview" :ratio="4/3" class="rounded-borders" fit="contain">
      <div class="absolute-bottom-right text-subtitle3">{{date}}</div>
    </q-img>

    <q-card-section horizontal class="justify-between items-center">
      <div class="text-h6" style="padding-left:10px;max-width:80%;word-wrap:break-word;">{{project.name}}</div>

      <q-card-actions align="right">
        <q-btn @click="openURL(project.repo)" flat round :ripple="false" color="white" icon="open_in_new"/>
      </q-card-actions>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row">
        <q-chip v-for="i in project.tags" dense square>{{i}}</q-chip>
      </div>

      {{project.description}}
    </q-card-section>
  </q-card>

  <q-dialog v-model="imgDialog" full-height full-width auto-close>
    <q-img :src="preview" class="rounded-borders self-center" fit="contain" style="max-width:75vw;max-height:80vh"/>
  </q-dialog>
</template>

<script>
import {openURL,date} from 'quasar'
const {formatDate}=date

export default{
  name:'Project',
  props:['project'],
  inject:['isMobile'],
  data(){
    return {
      imgDialog:false
    }
  },
  methods:{
    openURL(url){
      openURL(url);
    }
  },
  mounted(){
  },
  computed:{
    date(){
      return formatDate(this.project.date,'MMM D,YYYY');
    },
    preview(){
      if(this.project.preview==='none'){
        return '/projects/preview/none.jpg'
      }else{
        return '/projects/preview/'+this.project.name+this.project.preview
      }
    }
  }
}
</script>

<style>
.card{
  width:20vw;
}
.custom-card .q-img{
  max-height:25vh;
  width:auto;
  flex-grow:1;
}
.custom-card .q-video{
  max-height:25vh;
  width:auto;
  flex-grow:1;
}
</style>