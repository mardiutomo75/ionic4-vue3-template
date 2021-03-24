<template src="./Single.html"></template>
<script lang="ts">
import { useRoute } from 'vue-router';
import {  IonContent, IonIcon, IonItem, IonLabel, IonNote, IonPage } from '@ionic/vue';
// import { personCircle } from 'ionicons/icons';
import { getMessage } from '../../../data/messages';
import HeaderComponent from '../../../components/header/Header.vue';
import SegmentComponent from '../../../components/segment/SegmentComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      // personCircle,
      getBackButtonText: () => {
        const win = window as any;
        const mode = win && win.Ionic && win.Ionic.mode;
        return mode === 'ios' ? 'Inbox' : '';
      }
    }
  },
  setup() {
    const route = useRoute();
    const item = getMessage(parseInt(route.params.id as string, 10));

    return { 
      item,
    }
  },
  components: {

    IonContent,

    IonIcon,
    IonItem,
    IonLabel,
    IonNote,
    IonPage,
    SegmentComponent,
    HeaderComponent
  },
});
</script>

<style scoped>
@import  "./Single.css"
</style>