<template src="./Footer.html"></template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonFooter, IonToolbar, IonTitle} from '@ionic/vue';
export default defineComponent({
  name: 'FooterComponent',
    components: {
    IonFooter, IonToolbar, IonTitle
    },
  data(){
    return {
    
    }
  },
  props: ['text']
});
</script>

<style lang='scss' scoped>
@import  "./Footer.css"
</style>