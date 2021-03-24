<template src="./Header.html"></template>

<script lang="ts">
import { IonIcon, IonSearchbar, IonButtons, IonHeader, IonList,IonMenuButton, 
IonButton, IonBackButton, IonToolbar, IonTitle } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HeaderComponent',
   components: {
    IonButtons, IonList,IonMenuButton,IonBackButton, IonToolbar, IonTitle, IonHeader,
    IonIcon, IonSearchbar, IonButton
  },
  data(){
    return {
     canGoback : false,
     showsearch : false,
    }
  },
  emits:['goBack'],
  props: ['judul','back','role'],
  methods: {
    goBack(){
      this.$emit('goBack');
    },
    gosearch(){
      this.showsearch = true;
    },
    isIos: () => {
      const win = window as any;
      return win && win.Ionic && win.Ionic.mode === 'ios';
    }
  }
});
</script>

<style lang='scss' scoped>
@import  "./Header.css"
</style>