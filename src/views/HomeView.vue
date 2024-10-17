<template>
  <q-page>
    <section ref="home" :class="isMobile?'section-m':'section'" class="column">
		  <div class="flex-grow" style="flex-grow:3"></div>
      <p v-if="!isMobile" class="text-h1 text-weight-medium self-center" style="cursor:default">idkwhodatis</p>
      <p v-else class="text-h3 text-weight-medium self-center">idkwhodatis</p>
		  <div class="flex-grow" style="flex-grow:3"></div>
      <q-btn @click="scrollTo(false)" round icon="arrow_downward" :ripple="false" flat class="self-center self-end no-hover" style="padding-bottom:1%;"/>
    </section>
    
    <q-scroll-area ref="scroll" dark :visible="isMobile?false:true" :class="isMobile?'section-m':'section'" class="bg-dark text-white rounded-borders">
      <section ref="projects" style="height:100vh">
        <q-tabs v-model="tab" no-caps class="text-white shadow-2">
          <q-tab name="all" label="All" :ripple="false"/>
          <q-tab name="software" label="Software" :ripple="false"/>
          <q-tab name="game" label="Game" :ripple="false"/>
          <q-tab name="music" label="Music" :ripple="false"/>
        </q-tabs>
        <div :class="isMobile?'q-gutter-md':'q-gutter-xl q-pa-md'" class="row justify-center">
          <Project v-for="i in display" :project="i" :key="i.id"/>
        </div>
      </section>
    </q-scroll-area>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18,18]">
      <q-btn @click="onScrollHome" :ripple="false" fab icon="keyboard_arrow_up" color="dark" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import ky from 'ky';
import Project from '../components/Project.vue'
import {date,throttle,is} from 'quasar'
const {extractDate}=date
import bus from '../utils/EventBus.js'
import store from '../utils/Store.js'

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
      music:[],
      touchStartY:0
    }
  },
  inject:['isMobile'],
  methods:{
    scrollTo(toHome,smooth=true){
      let pos;
      if(toHome&&store.currSection!='Home'){
        pos=0;
        window.scrollTo({top:pos,behavior:'smooth'});
        store.currSection='Home';
      }else if(!toHome&&store.currSection!='Projects'){
        const el=this.$refs.projects;
        if(el){
          pos=el.getBoundingClientRect().top+this.scrollOffset;
        }
        if(smooth){
          window.scrollTo({top:pos,behavior:'smooth'});
        }else{
          window.scrollTo({top:pos});
        }
        store.currSection='Projects';
      }
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
    swipingHandler(event,toHome){
      if(toHome){
        if(this.touchStartY-event.changedTouches[0].clientY<0&&this.scrollOffset==0){
          event.preventDefault();
        }
      }else{
        if(this.touchStartY-event.changedTouches[0].clientY>0){
          event.preventDefault();
        }
      }
    },
    swipeHandler(event,toHome){
      let deltaY=this.touchStartY-event.changedTouches[0].clientY;
      if(Math.abs(deltaY)>=25){
        if(toHome){
          if(deltaY<0&&this.scrollOffset==0){
            this.scrollTo(true);
          }
        }else{
          if(deltaY>0){
            this.scrollTo(false);
          }
        }
      }
    },
    onScrollHome(){
      store.currSection='Home'
    },
    async fetchProjects(){
      try{
        const projects=await ky.get('/projects/projects.json').json();
        let id=0;
        for(let i in projects){
          try{
            const project=await ky.get('/projects/'+projects[i]+'.json').json();
            project.id=id;
            project.name=projects[i];
            project.date=extractDate(project.date,'M.D.YYYY');
            this.projects.push(project);
            id++;
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
      if(!this.isMobile){
        elHome.addEventListener('wheel',(event)=>{this.scrollHandler(event,false)},{passive:false});
      }else{
        elHome.addEventListener('touchstart',(event)=>{this.touchStartY=event.changedTouches[0].clientY},{passive:true});
        elHome.addEventListener('touchmove',(event)=>{this.swipingHandler(event,false)},{passive:false});
        elHome.addEventListener('touchend',(event)=>{this.swipeHandler(event,false)},{passive:true});
      }
    }
    const elProject=this.$refs.projects;
    if(elProject){
      if(!this.isMobile){
        elProject.addEventListener('wheel',(event)=>{this.scrollHandler(event,true)},{passive:false});
      }else{
        elProject.addEventListener('touchstart',(event)=>{this.touchStartY=event.changedTouches[0].clientY},{passive:true});
        elProject.addEventListener('touchmove',(event)=>{this.swipingHandler(event,true)},{passive:false});
        elProject.addEventListener('touchend',(event)=>{this.swipeHandler(event,true)},{passive:true});
      }
    }

    bus.on('scrollTo',(toHome)=>{
      if(toHome==='projects'){
        this.scrollTo(false,false)
      }else{
        this.scrollTo(toHome)
      }
    });
  },
  beforeUnmount(){
    const elHome=this.$refs.home;
    if(elHome){
      elHome.removeEventListener('wheel',(event)=>{this.scrollHandler(event,false)});
      elHome.removeEventListener('touchstart',(event)=>{this.touchStartY=event.changedTouches[0].clientY},{passive:true});
      elHome.removeEventListener('touchmove',(event)=>{this.swipingHandler(event,false)},{passive:false});
      elHome.removeEventListener('touchend',(event)=>{this.swipeHandler(event,false)},{passive:true});
    }
    const elProject=this.$refs.projects;
    if(elProject){
      elProject.removeEventListener('touchstart',(event)=>{this.touchStartY=event.changedTouches[0].clientY},{passive:true});
      elProject.removeEventListener('touchmove',(event)=>{this.swipingHandler(event,true)},{passive:false});
      elProject.removeEventListener('touchend',(event)=>{this.swipeHandler(event,true)},{passive:true});
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
.section-m{
  display:flex;
  height:calc(100vh - 120px);
  width:100%;
}
</style>