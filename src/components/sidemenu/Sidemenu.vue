/* eslint-disable */
<template src="./Sidemenu.html"/>
<script lang="ts">

import { IonApp, IonAvatar,IonContent, IonNote, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SidemenuComponent',
  components: {
    IonApp, 
    IonAvatar,
    IonContent,
    IonNote, 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonListHeader,
    IonMenu, 
    IonMenuToggle, 
  },
  created() {
    this.submenu = {}
    Object.assign(this.nav, this.$store.state.menus)
    for(let i =0;i< this.nav.length;i++){
        this.submenu['menu'+i] = false;
    }
    this.submenu2 = this.submenu
  },
  data(){
    return {
      submenu2 : {},
      submenu : {},
      nav: [],
      publicPath: process.env.BASE_URL,
      index: 0,
      opt: [],
      opt2: [],
    }
  },
  methods: {
    toggleSubmenu(e,url){
      for(let i =0;i< this.nav.length;i++) if(e!='menu'+i) this.submenu['menu'+i] = false;
      if(url) {
        this.$store.state.currentroute = url;
        this.$router.push(url);
      } else if(e) if(this.submenu[e]==true) this.submenu[e]=false; else this.submenu[e] = true;
      this.submenu2 = this.submenu;
      return
    },
    hasPermission(tipe, url) {
        // if(Object.keys(this.$store.state.permissions).length <= 0 && this.$store.state.user[this.$store.state.loginattr.levelfld] == -1) return true 
        // if(url=='/' || url=='/#/home' || url==undefined) return true
        // let turl = url.split('/')
        // let par = this.$store.state.permissions
        // turl = turl[turl.length-1]
        // const misi = par[turl]
        // if ((misi & 8) > 0 && tipe == 'list' ) { return true; }
        // if ((misi & 2) > 0 && tipe == 'del' ) { return true; }
        // if ((misi & 4) > 0 && tipe == 'edit' ) { return true; }
        // if ((misi & 1) > 0 && tipe == 'add' ) { return true; }
        // return false;
        return true;
    },
   
  }
});
</script>
<style lang='scss' scoped>
@import  "./Sidemenu.css"
</style>