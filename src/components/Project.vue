<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="bg-dark">
      <q-img :src="'/projects/preview/'+project+details.preview" class="rounded-borders" fit="contain">
        <div class="absolute-bottom-right text-subtitle3">{{date}}</div>
      </q-img>

      <q-card-section horizontal class="justify-between items-center">
        <div class="text-h6" style="padding-left:10px">{{project}}</div>

        <q-card-actions align="right">
          <q-btn @click="openURL(details.repo)" flat round :ripple="false" color="white" icon="open_in_new"/>
        </q-card-actions>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <q-chip v-for="i in details.tags" dense square>{{i}}</q-chip>
        </div>

        {{details.description}}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {openURL,date} from 'quasar'
const {formatDate}=date

export default{
  name:'Project',
  props:['project','details'],
  methods:{
    openURL(url){
      openURL(url);
    }
  },
  mounted(){
  },
  computed:{
    date(){
      return formatDate(this.details.date,'MMM,D,YYYY');
    }
  }
}
</script>

<style>

</style>