<template src="./Login.html"></template>
<script>
import { IonPage, IonButton, IonList, IonItem, IonInput, IonContent } from '@ionic/vue';
import {func} from '../../../components/function/func';
import axios from "axios"
export default {
  name: 'Login',
   components: {
    IonPage, IonButton, IonList, IonItem, IonInput, IonContent
  },
  created() {
    this.username = 'mardiutomo@gmail.com';
    this.password = '1975';
    //  delete(localStorage.user);
    if (localStorage.user) {
      this.$store.dispatch('setLogin')
      this.$router.push('/')
    } 
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods:{
    async goLogin(){
      if(!this.username || !this.password){
        this.$toasted.show('Username & Password Required !!!!');
        return;
      }
      let goapi = '';
      goapi = this.$store.state.baseUrl + this.$store.state.endpoint ;
      goapi = goapi + 'login';
      let data={};
      data[this.$store.state.loginattr.loginfld] = this.username;
      data[this.$store.state.loginattr.passwordfld] = this.password;

      let options =   { 
        method: 'POST', 
        url: goapi, 
        headers: {
            'Content-Type' : 'application/json'
        },
        data: data
      }

      await axios(options)
      .then(res => {
          res = res.data;
          if(res.success) {
            localStorage.user = JSON.stringify(res.data.user)
            localStorage.token = res.data.api_token
            this.$store.state.token = res.data.api_token
            this.$store.state.user = res.data.user
            // this.getPermission().then(res =>{
              func.openToast('Login Berhasil')
              this.$router.push('/')
            // })
          } 
      })
      .catch(error => {
            func.openToast('Koneksi Gagal !! ');
      });
    },
    async getPermission(){
      let goapi = '';
      this.headers = { 'headers': { 'X-Authorization': 'Bearer ' + this.$store.state.token } };
      goapi = this.$store.state.baseUrl + this.$store.state.endpoint + '?object=' + this.$store.state.loginattr.userpermissiontbl;
      goapi = goapi + '&action=list&filter=' + this.$store.state.loginattr.levelfld + ':=:' + this.$store.state.user[this.$store.state.loginattr.levelfld] 
      goapi = goapi +'&offset=0&limit=1000';
      await axios
      .get( goapi, this.headers)
      .then(res => {
          if(res.data.success == 1 ) {
            let permissions = [];
            const key = this.$store.state.loginattr.permissionfld;
            for(let item of res.data.data){
               let tabel = item[this.$store.state.loginattr.tblnamefld].split('}');
               tabel = tabel[1].replace('.php','');
               tabel = tabel.trim();
               try {
                 permissions[tabel]=item[key];
               } catch(e) {
                 permissions[tabel]=0;
               }
            }
            localStorage.permissions = JSON.stringify(Object.assign({}, permissions))
            Object.assign(this.$store.state.permissions, JSON.parse(localStorage.permissions))
            this.getSmallforeign()
             
          } 
      })
      .catch(error => { });
    },
    async getSmallforeign(){
      let goapi = '';
      this.headers = { 'headers': { 'X-Authorization': 'Bearer ' + this.$store.state.token } };
      goapi = this.$store.state.baseUrl + this.$store.state.endpoint + '?object=' + this.$store.state.loginattr.userpermissiontbl;
      goapi = goapi + '&action=small_foreign'
      await axios
      .get( goapi, this.headers)
      .then(res => {
          if(res.data.success == 1 ) {
            let small =  res.data.data.replace(/ /g,'')
            small = small.split(',')
            localStorage.small_foreign = JSON.stringify(Object.assign({}, small))
            Object.assign(this.$store.state.small_foreign, JSON.parse(localStorage.small_foreign))
            this.$router.push('/');  
          } 
          this.$func.getAllmeta()
      })
      .catch(error => { });
    }
  }
   
}
</script>
<style lang='scss' scoped>
@import  "./Login.css"
</style>
