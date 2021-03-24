<template src="./ListComponent.html"></template>

<script lang="ts">
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonFabButton, IonFab, IonList, IonPage, 
IonRefresher, IonRefresherContent, IonTitle, IonToolbar, IonIcon, IonFabList, IonCard, IonCardHeader, IonCardTitle,
IonSearchbar, IonButton, IonCardContent, IonInput, IonLabel, IonItem, alertController, IonNote, IonThumbnail } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import ListItemComponent from '../listitem/ListItem.vue';
import FilterComponent from '../filter/filterComponent.vue';
import {funcdata} from '../function/funcdata';
import {func} from '../function/func';

export default defineComponent({
  name: 'ListComponent',
  components: {
    IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonFabButton, IonFab, IonList, IonPage, 
    IonRefresher, IonRefresherContent, IonTitle, IonToolbar, IonIcon, IonFabList, IonCard, IonCardHeader, IonCardTitle,
    IonSearchbar, IonButton, IonCardContent, IonInput, IonLabel, IonItem, alertController,
    IonNote, IonThumbnail, ListItemComponent, FilterComponent
  },
   setup() {
    const content = ref();
    return {
      content
    }
   },
  props: {
    pagemeta: Object()
  },
  methods: {
     async scrollToTop() {
      this.view.scrollToTop(500);
    },
    async scrollToPos(Y: any = 1) {
      // console.log(this.content);
      // console.log(document.querySelector('ion-content')) 
      // document.querySelector('ion-content').scrollToPoint(0,Y,500);
      // this.view.scrollToPoint(0,Y,500);
    },
    logScrolling(event){
      this.pagemeta.scrollpos = event.detail.currentY;
      this.view = this.content.$el;
    },
    refresh(event, pagenum: number = 1){
      funcdata.gotoPage(this.pagemeta,this.$router, pagenum).then(res=>{
        event.target.complete();
      });
    },
    showFilter(){
      this.pagemeta.state = 'filter';
      this.datafilter = this.pagemeta.datafilter;
    },
    closeFilter(){
      this.pagemeta.state = 'list';
      this.pagemeta.datafilter = this.datafilter;
      this.searchtext = this.pagemeta.searchtext;
      this.scrollToPos(this.pagemeta.scrollpos);
    },
    loadData(event){
      if(this.pagemeta.pagenumber<this.pagemeta.totalpage) {
        this.refresh(event, this.pagemeta.pagenumber + 1);
      } else {
        func.openToast("Tidak ada data lagi")
        event.target.complete()
        this.infinitescroll = false
      }
    },
    doRefresh(event){
      this.goSearch().then( res=>{
        event.target.complete();
        this.infinitescroll= true;
      })
    },
    runFilter(param) {
      // this.pagemeta = param;
      this.searchtext = this.pagemeta.searchtext;
      this.datafilter = param.datafilter;
      this.goSearch();
    }, 
    resetFilter() {
      this.searchtext = '';
      this.pagemeta.searchtext = this.searchtext;
      this.datafilter = Object();
      this.pagemeta.datafilter = this.datafilter
      this.goSearch();
    },
    async goSearch() {
      this.pagemeta.state = 'list';
      this.infinitescroll= true;
      return funcdata.gotoPage(this.pagemeta,this.$router,1);
    },
    goEdit(){
      this.pagemeta.state = 'list';
      this.scrollToPos(this.pagemeta.scrollpos);
    },
    goDelete(){
      this.pagemeta.state = 'list';
      this.scrollToPos(this.pagemeta.scrollpos);   
    },
    closeSingle(){
      this.pagemeta.state = 'list';
      this.scrollToPos(this.pagemeta.scrollpos);
    },
    goSingle(item: any) {
      this.pagemeta['item'] = item;
      this.pagemeta['state'] = 'single';
    },
    async goAdd(id) {
      await this.$router.push('/' + this.pagemeta!.tablename + '/add/' + id)
    },

    sortCol: function(para){
      alert(para)
    },
  },
  data() {
    return { 
      infinitescroll: true,
      searchtext: '',
      item: Object(),
      datafilter: Object(),
      view: Object(),
      }
  }
});
</script>

<style lang='scss' scoped>
@import  "./ListComponent.css"
</style>