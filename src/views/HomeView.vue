<template>
  <q-page>
    <section ref="home" class="section column">
		  <div class="flex-grow" style="flex-grow:3"></div>
      <q-btn @click="scrollTo(this.projectPos)" round icon="arrow_downward" :ripple="false" class="self-center self-end no-hover" style="padding-bottom:1%;"/>
    </section>

    <q-scroll-area dark class="section bg-dark text-white rounded-borders">
      <section ref="projects">
        <div class="row">
          <Project v-for="(i,j) in projects" :project="j" :details="i" :key="i.id"/>
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
import {date} from 'quasar'
const {extractDate}=date

export default{
  components:{
    Project
  },
  data(){
    return {
      projectPos:0,
      projects:{}
    }
  },
  methods:{
    scrollTo(pos){
      window.scrollTo({top:pos-this.offset,behavior:'smooth'});
    },
    async handleScroll(details){
      await nextTick();
      if(details.position-details.delta===0&&details.direction==='down'){
        this.scrollTo(this.projectPos+window.scrollY);
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
            project.date=extractDate(project.date,'M.D.YYYY');
            this.projects[projects[i]]=project;
          }catch(e){
            console.error('Error fetching '+projects[i]+'.json'+e);
          }
        }
      }catch(e){
        console.error('Error fetching projects.json'+e);
      }
    }
  },
  mounted(){
    this.fetchProjects();

    const el=this.$refs.projects;
    if(el){
      this.projectPos=el.getBoundingClientRect().top
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