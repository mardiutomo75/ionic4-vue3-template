<template src="./ListItem.html"></template>

<script lang="ts">
import { IonIcon, IonThumbnail, IonItem, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonFabList,
IonRefresher, IonRefresherContent, IonLabel, IonList, IonNote,  IonFabButton, IonFab } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import {func} from '../../components/function/func';
import {funcdata} from '../../components/function/funcdata';
import SingleComponent from '../../components/single/singleComponent.vue';

export default defineComponent({
  name: 'ListItemComponent',
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
    IonList,IonRefresher, IonRefresherContent, SingleComponent,
    IonThumbnail, IonInfiniteScroll, IonInfiniteScrollContent,
  },
  props: {
    pagemeta: Object()
  },
  emits: ['goSingle','showFilter','goSearch','goAdd','goinf','stopinf'],
  methods: {
    closeSingle(){
      this.state = 'list';
      // this.setState(this.state);
      // this.scrollToPos(this.pagemeta.scrollpos);
    },
    tampil(item,col){
      if(item[col+'_view']) return item[col+'_view'];
      else return item[col];
    },
    goSingle(index: any) {
       this.$emit("goSingle", index);
    },
    goAdd() {
       this.$emit("goAdd", Object());
    },
    doRefresh(event){
      this.$emit("goSearch");
      event.target.complete();
    },
    loadData(event){
      if(this.pagemeta.pagenumber<this.pagemeta.totalpage) {
        this.refresh(event, this.pagemeta.pagenumber + 1);
      } else {
        func.openToast("Tidak ada data lagi")
        event.target.complete()
        this.$emit('stopinf')
      }
    },
    refresh(event, pagenum: number = 1){
      
      funcdata.gotoPage(this.pagemeta,this.$router, pagenum).then(res=>{
        event.target.complete();
        this.$emit('goinf')
      });
    },
    async scrollToTop() {
      this.view.scrollToTop(500);
    },
    logScrolling(event){
      this.scrollpos = event.detail.currentY;
      this.view = this.content.$el;
    },
    picerror(e){
      func.picerror(e);
    },
    isIos: () => {
      const win = window as any;
      return win && win.Ionic && win.Ionic.mode === 'ios';
    },
    showFilter(){
      this.$emit("showFilter");
    }
     
  },
  data() {
    return { 
        scrollpos: 1,
        view: Object(),
        // viewitem: Object(),
        state: '',
      }
  }
});
</script>

<style lang='scss' scoped>
@import  "./ListItem.css"
</style>