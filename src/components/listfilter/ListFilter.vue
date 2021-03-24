<template src="./ListFilter.html"></template>

<script lang="ts">
import { IonIcon, IonThumbnail, IonItem, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonFabList,
IonRefresher, IonRefresherContent, IonLabel, IonList, IonNote,  IonFabButton, IonFab } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import {func} from '../function/func';
import {funcdata} from '../function/funcdata';

export default defineComponent({
  name: 'ListFilterComponent',
  setup() {
    const content = ref();
    return {
      content
    }
   },
   watch: {
    currentroute(newValue, oldValue) {
      this.$emit("goSearch");
      // this.viewitem = this.pagemeta.viewitems;
      // console.log(this.$route.params.table)
    }
  },
  mounted() {
    //  this.viewitem = this.pagemeta.viewitems;
    //  console.log(this.pagemeta)
  },
  components: {
    IonIcon, IonContent, IonItem,
    IonLabel, IonNote, IonFabButton, IonFab, IonFabList,
    IonList,IonRefresher, IonRefresherContent,
    IonThumbnail, IonInfiniteScroll, IonInfiniteScrollContent,
  },
  props: {
    pagemeta: Object()
  },
  emits: ['goSingle','showFilter','goSearch','goAdd','goinf','stopinf'],
  methods: {
   
     
  },
  data() {
    return { 
       items: Object(),
      }
  }
});
</script>

<style lang='scss' scoped>
@import  "./ListFilter.css"
</style>