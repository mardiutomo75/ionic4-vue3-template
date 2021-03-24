<template src="./SegmentComponent.html"></template>

<script lang="ts">
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SegmentComponent',
  components: {
    IonLabel, IonSegment, IonSegmentButton
  },
  data(){
    return {
    
    }
  },
  methods: {
    segmentChanged(ev: CustomEvent) {
      console.log('Segment changed', ev);
    }
  }
});
</script>
<style lang='scss' scoped>
@import  "./SegmentComponent.css"
</style>