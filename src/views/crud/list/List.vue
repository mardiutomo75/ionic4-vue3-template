<template src="./List.html"></template>

<script lang="ts">
import { IonPage, useBackButton } from '@ionic/vue';
import ListItemComponent from '../../../components/listitem/ListItem.vue';
import HeaderComponent from '../../../components/header/Header.vue';
import FooterComponent from '../../../components/footer/Footer.vue';
import FilterComponent from '../../../components/filter/filterComponent.vue';
import AddComponent from '../../../components/add/AddComponent.vue';
import SingleComponent from '../../../components/single/singleComponent.vue';
import { defineComponent } from 'vue';
import {funcdata} from '../../../components/function/funcdata';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'List',
  computed: mapState(['currentroute']),
  watch: {
    currentroute(newValue, oldValue) {
      // console.log(`Updating from ${oldValue} to ${newValue}`);
      this.mulai(newValue);
    }
  },
  ionViewWillEnter() {
   this.mulai(this.$route.fullPath); 
  },
  data() {
    return {
      pagemeta: Object(),
      searchtext: '',
      datafilter: Object(),
      view: Object(),
      judul: '',
    }
  },
  methods: {
    mulai(path){
      console.log(this.$store.state.masterdata);
      const tablename = path.split('/')[2]
      if(this.$store.state.pagemeta[tablename]){
        this.pagemeta = this.$store.state.pagemeta[tablename]; 
        funcdata.gotoPage(this.pagemeta, this.$router,1);
      } else {
        this.pagemeta = {};
        this.pagemeta = funcdata.getlistwillenter(tablename);
        funcdata.getstruc(this.pagemeta).then(res =>{
          this.pagemeta.infinitescroll= true;
          this.$store.state.pagemeta[tablename] = this.pagemeta;
          funcdata.gotoPage(this.pagemeta, this.$router,1);
        });
      }
      this.judul = this.pagemeta.judul;
    },
    startinfinite(){
      this.pagemeta.infinitescroll= true;
    },
    stopinfinite(){
      this.pagemeta.infinitescroll= false;
    },
    showFilter(){
      this.pagemeta.infinitescroll= true;
      this.judul = 'Filter '+this.pagemeta.judul;
      this.datafilter = this.pagemeta.datafilter;
      useBackButton(10, () => { this.closeFilter(); });
      this.pagemeta.state = 'filter';
    },
    closeFilter(){
      this.judul = this.pagemeta.judul;
      this.pagemeta.datafilter = this.datafilter;
      this.searchtext = this.pagemeta.searchtext;
      useBackButton(10, () => {this.$router.go(-1); });
      this.pagemeta.state = 'list';
    },
    
    runFilter(param) {
      // console.log(param);
      if(param.searchtext){
        this.searchtext = param.searchtext;
        this.pagemeta.searchtext = param.searchtext;
        delete(param.searchtext);
      }
      this.pagemeta.datafilter = param;
      this.datafilter = param;
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
      this.pagemeta.infinitescroll= true;
      this.judul = this.pagemeta.judul;
      useBackButton(10, () => { this.$router.go(-1);});
      return funcdata.gotoPage(this.pagemeta,this.$router,1);
    },
    async goSingle(index) {
      // this.pagemeta.index = index;
      this.pagemeta.item  = index;
      this.pagemeta.state = 'single';
      this.judul = this.pagemeta.judul+' #'+this.pagemeta.item[this.pagemeta.tablemeta.primaryKey];
      useBackButton(10, () => { this.closeSingle();});
    },
    async closeSingle() {
      this.pagemeta.state = 'list';
      this.judul = this.pagemeta.judul;
      useBackButton(10, () => { this.$router.go(-1);});
    },
    async goAdd(index) {
      this.pagemeta.state = 'add';
      if(index){ 
        this.judul = 'Edit '+this.pagemeta.judul;
      } else {
        this.judul = 'Tambah '+this.pagemeta.judul;
      }
      this.pagemeta.item  = index;
      useBackButton(10, () => { this.closeFilter(); });
    }, 
  },
  components: {
    IonPage, ListItemComponent, HeaderComponent, FooterComponent, SingleComponent, FilterComponent, AddComponent
  },
});
</script>
<style lang='scss' scoped>
@import  "./List.css"
</style>