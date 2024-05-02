<template>
  <q-page>
    <section ref="home" class="section column">
		  <div class="flex-grow" style="flex-grow:3"></div>
      <p class="text-h1 text-weight-medium self-center">idkwhodatis</p>
		  <div class="flex-grow" style="flex-grow:3"></div>
      <q-btn @click="scrollTo(false)" round icon="arrow_downward" :ripple="false" class="self-center self-end no-hover" style="padding-bottom:1%;"/>
    </section>
    
    <q-scroll-area ref="scroll" dark class="section bg-dark text-white rounded-borders">
      <section ref="projects">
        <q-tabs v-model="tab" no-caps class="text-white shadow-2">
          <q-tab name="all" label="All" :ripple="false"/>
          <q-tab name="software" label="Software" :ripple="false"/>
          <q-tab name="game" label="Game" :ripple="false"/>
          <q-tab name="music" label="Music" :ripple="false"/>
        </q-tabs>
        <div class="q-pa-md row justify-center q-gutter-xl">
          <Project v-for="i in display" :project="i" :key="i.id"/>
        </div>
      </section>
    </q-scroll-area>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18,18]">
      <q-btn :ripple="false" fab icon="keyboard_arrow_up" color="dark" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import ky from 'ky';
import Project from '../components/Project.vue'
import {date,throttle} from 'quasar'
const {extractDate}=date
import bus from '../utils/EventBus.js'

export default{
  components:{
    Project
  },
  data(){
    return {
      tab:'all',
      projects:[],
      software:[],
      game:[],
      music:[]
    }
  },
  methods:{
    scrollTo(toHome){
      let pos;
      if(toHome){
        pos=0;
      }else{
        const el=this.$refs.projects;
        if(el){
          pos=el.getBoundingClientRect().top+this.scrollOffset;
        }
      }
      window.scrollTo({top:pos,behavior:'smooth'});
    },
    scrollHandler(event,toHome){
      if(toHome){
        if(event.deltaY<0&&this.scrollOffset==0){
          event.preventDefault();
          this.scrollTo(true);
        }
      }else{
        if(event.deltaY>0){
          event.preventDefault();
          this.scrollTo(false);
        }
      }
    },
    onScrollHome(){
      this.scrollTo(true);
    },
    async fetchProjects(){
      try{
        const projects=await ky.get('/projects/projects.json').json();
        for(let i in projects){
          try{
            const project=await ky.get('/projects/'+projects[i]+'.json').json();
            project.name=projects[i];
            project.date=extractDate(project.date,'M.D.YYYY');
            this.projects.push(project);
          }catch(e){
            console.error('Error fetching '+projects[i]+'.json'+e);
          }
        }
      }catch(e){
        console.error('Error fetching projects.json'+e);
      }
      this.projects.sort((a,b)=>b.date-a.date);
      this.software=this.projects.filter(i=>i.category==='software');
      this.game=this.projects.filter(i=>i.category==='game');
      this.music=this.projects.filter(i=>i.category==='music');
    }
  },
  computed:{
    display(){
      switch(this.tab){
        case 'all':
          return this.projects;
        case 'software':
          return this.software;
        case 'game':
          return this.game;
        case 'music':
          return this.music;
      }
    },
    scrollOffset(){
      return this.$refs.scroll.getScrollPosition().top;
    }
  },
  mounted(){
    this.fetchProjects();

    const elHome=this.$refs.home;
    if(elHome){
      elHome.addEventListener('wheel',(event)=>{this.scrollHandler(event,false)},{passive:false});
    }
    const elProject=this.$refs.projects;
    if(elProject){
      elProject.addEventListener('wheel',(event)=>{this.scrollHandler(event,true)},{passive:false});
    }

    bus.on('scrollTo',(toHome)=>{this.scrollTo(toHome)});
  },
  beforeDestroy() {
    const el=this.$refs.home;
    if(el){
      el.removeEventListener('wheel',(event)=>{this.scrollHandler(event,false)});
    }

    bus.off('scrollTo');
  },
  created(){
    this.scrollTo=throttle(this.scrollTo,300);
  }
}
</script>

<style>
.section{
  display:flex;
  height:calc(100vh - 60px);
  width:100%;
}
</style>