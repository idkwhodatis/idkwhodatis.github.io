<template>
  <q-page>
    <section ref="home" class="section column">
		  <div class="flex-grow" style="flex-grow:3"></div>
      <q-btn @click="scrollTo" round icon="arrow_downward" :ripple="false" class="self-center self-end no-hover" style="padding-bottom:1%;"/>
    </section>

    <q-scroll-area dark class="section bg-dark text-white rounded-borders">
      <section ref="projects">
        <p v-for="i in 100" style="margin:0">sb</p>
      </section>
    </q-scroll-area>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18,18]">
      <q-btn :ripple="false" fab icon="keyboard_arrow_up" color="dark" />
    </q-page-scroller>
  </q-page>
</template>

<script>
export default{
  methods:{
    scrollTo(){
      const el=this.$refs.projects;
      if(el){
        window.scrollTo({top:el.getBoundingClientRect().top-this.offset,behavior:'smooth'});
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