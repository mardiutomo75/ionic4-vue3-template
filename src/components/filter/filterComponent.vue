<template src="./filterComponent.html"></template>

<script lang="ts">
import { IonIcon, IonThumbnail, IonItem, IonLabel, IonNote, IonContent,
IonTitle, IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle,
IonSearchbar, IonButton, IonCardContent, IonInput, IonList, IonSelectOption, IonSelect  } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FilterComponent',
  components: {
    IonIcon, IonItem, IonLabel, IonNote,IonThumbnail,IonTitle, IonContent,
    IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle,
    IonSearchbar, IonButton, IonCardContent, IonInput, IonList,  IonSelectOption, IonSelect
  },
  mounted() {
    this.searchtext = this.pagemeta.searchtext;
    // if(!this.pagemeta.tablemeta.relationView){
    //   for(let a of this.pagemeta.tablemeta.relationView){
    //      a = a.slice(0,-1);
    //     if(this.pagemeta.datafilter[a]) this.datafilter[a] = this.pagemeta.datafilter[a];
    //   }
    // }
    // console.log(this.datafilter)
    this.datafilter = this.pagemeta.datafilter;
  },
  props: {
    pagemeta: Object(),
  },
  methods: {
    resetFilter(){
      this.searchtext = '';
      this.$emit('resetFilter');
    },
    closeFilter(){
      // this.searchtext = this.pagemeta!.searchtext;
      // this.datafilter = this.pagemeta!.datafilter;
      this.$emit('closeFilter');
    },
    runFilter(){
      this.datafilter['searchtext']=this.searchtext;
      this.$emit('runFilter', this.datafilter);
    }
  },
  data() {
    return {
      searchtext: '',
      datafilter: Object(),
    }
  },
});
</script>

<style lang='scss' scoped>
@import  "./filterComponent.css"
</style>