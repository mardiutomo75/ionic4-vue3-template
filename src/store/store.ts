import { createStore } from 'vuex'
import { model } from './model';
import { menus } from './menus';
export const store = createStore({
    state: {
        model : model,
        menus : menus,
        baseUrl : 'http://127.0.0.1:8000/',
        endpoint: '',
        token: '',
        deviceId: '',
        pagetitle: 'Home',
        language: 'id',
        loginattr: {
            usertbl: 'users', 
            userpermissiontbl: 'userlevelpermissions',
            userleveltbl: 'userlevels',
            loginfld: 'email',
            passwordfld: 'password',
            levelfld: 'userlevels_id',
            levelnamefld: 'nama',
            tblnamefld: 'tablename',
            permissionfld: 'permission',
        },
        permissions: Array(),
        deviceData: Array(),
        appversion:  '1.37',
        pageid: '',
        currentroute: '', 
        pageTitle: '',
        user: {
            fullname: '',
            username: '',
            email: '',
            level: '',
            levelname: '',
            plant_id: '',
            badges: '23',
        },
        refreshTime: new Date().getTime(),
        masterdata: Array(),
        columns: Array(),
        roles: Array(),
        pagemeta: Array(),
        tablemeta: Array(),
        dbmodel: Array(),
        detiltable: Array(),
        small_foreign: ['departemen','subkon','proyek','j_pekerja','agama','pendidikan','hari','darah','bulan','jenis_alat','j_departemen','kat_dok'],
        hometabs: [{name: 'dashboard', label: 'Dashboard', icon: 'fa fa-tachometer' },
            {name: 'pesan', label: 'Pesan', icon: 'fa fa-comments' },
            {name: 'faq', label: 'Bantu', icon: 'fa fa-question-circle' }],
        notiftable: 'notifikasi',
        settingmenu: 'pengaturan',
        helptable:  'faq',
        hometable: 'plant,masalah',
        fixoption:{ 
            blacklist: { 'Y':{id:'Y', nama_en:'Yes', nama_id:'Ya'}, 'N': {id:'N', nama_en:'No', nama_id:'Tidak'}},
            na: { 0:{id:0, nama_en:'No', nama_id:'Ya'}, 1: {id:1, nama_en:'Yes', nama_id:'Tidak'}},
            kelamin_id: { 1:{id:1, nama_en:'Man', nama_id:'Pria'}, 2: {id:2, nama_en:'Women', nama_id:'Wanita'}}
        }
    },
    mutations: {
        refreshTime (state) {
			state.refreshTime = new Date().getTime()	
        },
        setState (state, payload) {
			state[payload.prop] = payload.value	
        },
        clearLogin(state: any){
            state.token = ''
            state.user = {}
            delete(localStorage.user)
            delete(localStorage.token)
            delete(localStorage.permissions)
            delete(localStorage.small_foreign)
        },
    },
    actions: {
        setLogin(context){
            context.commit('setState',{prop:"user", value: JSON.parse(localStorage.user)})
            context.commit('setState',{prop:"token", value: localStorage.token})
            // context.commit('setState',{prop:"permissions", value: JSON.parse(localStorage.permissions)})
            // context.commit('setState',{prop:"small_foreign", value: JSON.parse(localStorage.small_foreign)})
        },
    },
  
});


