<template src="./singleComponent.html"></template>

<script lang="ts">
import { IonIcon, IonThumbnail, IonItem, IonLabel, IonNote, IonContent,
IonTitle, IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle, IonList,
IonSearchbar, IonButton, IonCardContent, IonInput, alertController  } from '@ionic/vue';
import { defineComponent } from 'vue';
import {func} from '../../components/function/func';


export default defineComponent({
  name: 'SingleComponent',
  components: {
    IonIcon, IonItem, IonLabel, IonNote,IonThumbnail,IonTitle, IonContent,
    IonToolbar, IonFabList, IonCard, IonCardHeader, IonCardTitle, IonList,
    IonSearchbar, IonButton, IonCardContent, IonInput, alertController
  },
  props: {
    pagemeta: Object(),
  },
   mounted() {
     this.viewitem = this.pagemeta.item;
  },
  emits: ['closeSingle','goEdit','goDelete'],
  methods: {
    tampil(col){
      if(this.viewitem[col+'_view']) return this.viewitem[col+'_view'];
      else return this.viewitem[col];
    },
    picerror(e){
      func.picerror(e);
    },
    goEdit(){
      this.$emit('goEdit',this.pagemeta.item);
    },
    closeSingle(){
      this.$emit('closeSingle');
    },
    async goDelete(){
      const alert = await alertController
      .create({
        header: 'HAPUS!!',
        message: 'Hapus data Ini?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'OK',
            handler: () => {
              this.$emit('goDelete');            
            },
          },
        ],
      });
      
    }
  },
  data() {
    return {
      viewitem: Object(),
    }
  },
});
</script>

<style lang='scss' scoped>
@import  "./singleComponent.css"
</style>