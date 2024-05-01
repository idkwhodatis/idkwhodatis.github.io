<template>
  <q-page>
    <section ref="home" class="section column">
		  <div class="flex-grow" style="flex-grow:3"></div>
      <q-btn @click="scrollTo(this.projectPos)" round icon="arrow_downward" :ripple="false" class="self-center self-end no-hover" style="padding-bottom:1%;"/>
    </section>

    
    <q-tabs v-model="tab" no-caps class="text-white shadow-2">
      <q-tab name="all" label="All" :ripple="false"/>
      <q-tab name="software" label="Software" :ripple="false"/>
      <q-tab name="game" label="Game" :ripple="false"/>
      <q-tab name="music" label="Music" :ripple="false"/>
    </q-tabs>
    <q-scroll-area dark class="section bg-dark text-white rounded-borders">
      <section ref="projects">
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
import {nextTick} from 'vue'
import ky from 'ky';
import Project from '../components/Project.vue'
import {date,scroll} from 'quasar'
const {extractDate}=date
const {getScrollTarget,getVerticalScrollPosition,setVerticalScrollPosition}=scroll

export default{
  components:{
    Project
  },
  data(){
    return {
      tab:'all',
      projectPos:0,
      projects:[],
      software:[],
      game:[],
      music:[]
    }
  },
  methods:{
    scrollTo(pos){
      window.scrollTo({top:pos-this.offset,behavior:'smooth'});
    },
    async handleScroll(details){
      await nextTick();
      if(details.position-details.delta===0&&details.direction==='down'){
        // this.scrollTo(this.projectPos+window.scrollY);
        const el=this.$refs.projects;
        setVerticalScrollPosition(getScrollTarget(el),el.offsetTop,1000);
      }else if(details.position-details.delta===this.projectPos&&details.direction==='up'){
        console.log(details);
        this.scrollTo(0);
      }
      console.log(details);
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
  mounted(){
    this.fetchProjects();

    const el=this.$refs.projects;
    if(el){
      this.projectPos=el.getBoundingClientRect().top
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
    }
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