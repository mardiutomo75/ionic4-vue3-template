<template src="./AddComponent.html"></template>

<script lang="ts">
import { IonIcon, IonThumbnail, IonItem, IonLabel, IonNote, IonContent,
IonTitle, IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle,
IonSearchbar, IonButton, IonCardContent, IonInput, IonList, IonSelectOption, IonSelect  } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddComponent',
  components: {
    IonIcon, IonItem, IonLabel, IonNote,IonThumbnail,IonTitle, IonContent,
    IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle,
    IonSearchbar, IonButton, IonCardContent, IonInput, IonList,  IonSelectOption, IonSelect
  },
  mounted() {
    this.field = Object();
    if(!this.pagemeta.item){
      if(this.pagemeta.tablemeta.fieldAdd) this.field = this.pagemeta.tablemeta.fieldAdd;
      this.data  = Object();
    } else {
      if(this.pagemeta.tablemeta.fieldEdit) this.field = this.pagemeta.tablemeta.fieldEdit;
      this.data  = this.pagemeta.item;
    }
    if(!this.field) this.field = this.pagemeta.tablemeta.fillable;
    if(this.field){
      for(const a of this.field){
        if(this.pagemeta.item[a]) this.data[a] = this.pagemeta.item[a];
        if(this.pagemeta.tablemeta.fieldValidation[a]) this.ftype[a] = this.pagemeta.tablemeta.fieldValidation[a].split('|')[0]; else this.ftype[a]='string';
        if(this.pagemeta.tablemeta.relationView.indexOf(a+'s')>=0) this.ftype[a] = 'select';
        if(this.pagemeta.tablemeta.fieldUpload.indexOf(a)>=0) this.ftype[a] = 'file';
        if(this.$store.state.fixoption[a]) this.ftype[a]= 'selectfo';
      }
    }
    // console.log(this.pagemeta);
  },
  props: {
    pagemeta: Object(),
  },
  emits: ['closeAdd'],
  methods: {
    closeAdd(){
      this.$emit('closeAdd');
    },
    goSave(data){
      
    }
  },
  data() {
    return {
      data: Object(),
      ftype: Object(),
      field: Object(),
    }
  },
});
</script>

<style lang='scss' scoped>
@import  "./AddComponent.css"
</style>