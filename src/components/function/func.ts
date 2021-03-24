import axios from "axios"
import { store } from "../../store/store";
import { toastController, alertController } from '@ionic/vue';
import router from '../../router';
import { funcapi } from './funcapi';

export const func =  {
  ucword(str){
    return str.toLowerCase().replace(/(?<= )[^\s]|^./g, a=>a.toUpperCase())
  },
  checktabs(tablename, route){
    const hometabs = {}
    if(route.query.referal == 'home' || tablename == 'home') {
        hometabs['referal'] = route.query.referal
        if(store.state.hometabs.find( x => x.name == tablename) || tablename == 'home'){
            hometabs['tabs'] = [{name: 'home', label: 'Home', icon: 'fa fa-home'}]
            hometabs['tabs'] = hometabs['tabs'].concat(store.state.hometabs)
        }
        hometabs['deftab'] = tablename
    } else if(route.query.mtable && route.query.mvalue && route.query.dfield) {
        const dbmodel = store.state.dbmodel[route.query.mtable]
        
        if(dbmodel.detil){
            const tabs = Object();
            Object.assign(tabs, dbmodel.detil)
            for(const item of tabs) {
              item['name'] = item['tablename'] + '?mtable=' + route.query.mtable + '&dfield=' + item['detilfield'] + '&mvalue=' + route.query.mvalue 
              if(item.tablename == tablename ) hometabs['deftab'] = item['name']
            }
            tabs.unshift({name : route.query.mtable + '/' + route.query.mvalue , label: dbmodel.tablemeta.label, icon: 'fa fa-info' })
            hometabs['tabs'] = tabs
            hometabs['referal'] = route.query.referal
            hometabs['mvalue'] = route.query.mvalue
            hometabs['mtable'] = route.query.mtable
            hometabs['dfield'] = route.query.dfield
        }
    }
    return hometabs
},
arraytoapifilter(obj){
  let filter = ''
  Object.keys(obj).forEach(function(key) { 
      filter = filter + key + ':=:' + obj[key] + ';';
  });
  return filter
},
setUnique(array,key){
    let unique = Array();
    let distinct = Array()
    for( let i = 0; i < array.length; i++ ){
        if( !unique[array[i][key]]){
            distinct.push(array[i])
            unique[array[i][key]] = 1
        }
    }
    return distinct
},
  async filterChange(tablename,vcolumns,col,row,rem) {
      if(!rem) {
          const rem = 0
      }
      if(!col.childselect) return
      for(const item of col.childselect){
          const temp = item.split(';')
          if(temp[0]){
            const field = vcolumns.filter(obj=>obj.field===temp[0])
            if(field[0]){
                  if(rem==1)  delete(row[field[0].field])
              
                  let filter = '';
                  for(const item2 of field[0].parentselect){
                      const temp2 = item2.split(';')
                      if(rem==1) {
                          if(!row[temp2[0]] || row[temp2[0]]=='') row[temp2[0]] = 0
                      }
                      filter = filter + temp2[1]+':=:' + row[temp2[0]] + ';'
                      
                  }    
                  await this.getLink(tablename,vcolumns,field[0],filter)
            }
          }
      } 
      return new Date().getTime() + Math.random();
  }, 
  async openToast(msg) {
    const toast = await toastController
      .create({
        message: msg,
        duration: 2000
      })
    return toast.present();
  },
  extractFilter(obj){
    const datafilter = {}
    if(obj) {
        Object.keys(obj).forEach(function(key) { 
            if(key.includes('x_')) {
                const tkey = key.replace('x_','')
                datafilter[tkey]=obj[key]
            }
        });
    }
    return datafilter
  },
  async getAlllink(tablename,vcolumns,row,rem){
    if(!rem) {
        const rem=0
    }
    for(const item of vcolumns){
      if(item.linktable && !item.hasparent && item.tag != 'TEXT' && item.tag != 'TEXTAREA') {
          await this.getLink(tablename,vcolumns,item,'')
      }
    }
    if(rem==0){
        for(const item of vcolumns){
            if(item.haschild) {
            await this.filterChange(tablename,vcolumns,item,row,'')
            }
        } 
    }
    return new Date().getTime() + Math.random();
  },
  async getLink(tablename,vcolumns,item, filter) {
    if(item == undefined || item == '') return
    let goapi = ''
    filter = '&filter=' + filter
    goapi = '?object=' + tablename;
    goapi = goapi + '&action=link&link=' + item.field + '&offset=0&limit=1000&pageid=' + store.state.pageid + filter;
    await this.apiget(goapi)
    .then(res => {
        if(res.data.success == 1 ) {
            let tagvalue = Array();
            for (const rows of res.data.data) {
              tagvalue.push({value:rows[item.linkfield], label: rows[item.linkdisplay1], text: rows[item.linkdisplay1]})
            }
            for(let i = 0 ; i<  vcolumns.length; i++ ){
                if(item.field == vcolumns[i].field) {
                    vcolumns[i].tagval = tagvalue;
                }
            }
        } 
    })
    .catch(error => { 
        this.openToast('Connection Error Single Link ' + item.field);
    });
  },
  goSingle(tablename,id){
    router.push('/'+tablename+'/'+id)
  },
  async goLogout(tablename,id){
    const alert = await alertController
    .create({
      cssClass: 'my-custom-class',
      header: 'LOGOUT?',
      message: 'Logout Sekarang?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'OK',
          handler: () => {
            store.commit('clearLogin');
            router.push('/login');
          },
        },
      ],
    });
      
  },
  goAdd(tablename,id){
      router.push('/'+tablename+'/add/'+id)
  },
  goEdit(tablename,id){
      router.push('/'+tablename+'/edit/'+id)
  },
  async goDelete(tablemeta,id){
    if(!store.state.roles[tablemeta.name]) return;
    const roles = store.state.roles[tablemeta.name]
    if(!roles['delete']) {
        this.openToast('Maaf anda tidak mempunyai akses hapus !!!!');
        return;
    }
    const alert = await alertController
    .create({
      cssClass: 'my-custom-class',
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
            const delapi = store.state.baseUrl + store.state.endpoint + '?action=delete&'+ tablemeta.primary+ '=' + id + '&object=' + tablemeta.name;
            this.sureDelete(delapi,tablemeta)
          },
        },
      ],
    });
  },
  async sureDelete(api,tablemeta){
    await axios
    .get(api, funcapi.createheader('json'))
    .then(res => {
        if(res.data.success == 1 ) {            
            this.openToast('Hapus data berhasil !!!!')
            router.push('/'+tablemeta.name)
        } else {
          this.openToast('Gagal hapus data !!!! ' + res.data.message)
        }
    })
    .catch(error => { 
        this.openToast('Connection Error !!!')
    });
  },
  searchLink(str,col): string{
    let isi='';
    let data = []; 
    if(!store.state.masterdata[col.linktable]) return '';
    data = store.state.masterdata[col.linktable];
    data.forEach( function(item) {
        if(item[col.linkfield] == str){
            isi = item[col.linkdisplay1]
            if(col.linkdisplay2) isi = isi + ' - ' + item[col.linkdisplay2]
            if(col.linkdisplay3) isi = isi + ' - ' + item[col.linkdisplay3]
        }
        
    });
    return isi
  },
  getHeaders(){
    return funcapi.createheader('json');
  },
  async apiget(goapi) {
    return await axios.get(goapi, funcapi.createheader('json'))
  },

  tampildata(col,row){
    let str = row[col.field]
    if(!str) return;
    if(col.tagval && !col.link){
      col.tagval.forEach( function(item) {
        if(item.value == str){
          str = item.label;
        }
      });
    } else if(col.file) {
      const s1 = this.getFiletype(str,col,row);  
      return s1;
    } else if(col.link) {
      if(Object.values(store.state.small_foreign).includes(col.linktable)){
        let strc = [str]
        
        if(col.tag=='CHECKBOX'){ 
          strc = str.split(',')
        }
        let tmp: string;
        let out: any;
        for(const isi of strc){
          tmp=this.searchLink(isi,col)
          if(tmp!='') {
            out.push(tmp)
          } else  out.push(isi)
        }
        if(out.length>0) str = out.join()
      } else {
        str = col.linktable+'_'+col.field
        return row[str]
      } 
    }
    str = str.replace(/<script>/gi,'');
    str = str.replace(/<\/script>/gi,'');
    str = str.replace(/javascript/gi,'java scripts');
    return str
  },
  getFiletype(str,col,row){
    let s1 = str.toLowerCase();
    s1 = s1.split(/\./gi);
    s1 = s1[s1.length -1 ];
    const image = ['jpg','jpeg','png','bmp'];
    const pdf = ['pdf'];
    const doc = ['doc','docx'];
    const xls = ['xls','xlsx'];
    const zip = ['zip','rar','7zip','tar'];
    if (image.includes(s1)) {
      const imgurl = row['thumb_' + col.field];
      return '<a href="' + str + '" target="_blank"><img src="' + imgurl + '"/></a>';
    } else if (pdf.includes(s1)) {
      return 'pdf';
    } 
  },
  
  hasPermission(tipe, url) {
    if(Object.keys(store.state.permissions).length <= 0 && store.state.user[store.state.loginattr.levelfld] == -1) return true
    if(url==undefined) return true
    let turl = url.split('/')
    const par = store.state.permissions
    turl = turl[turl.length-1]
    const misi = par[turl]
    if ((misi & 8) > 0 && tipe == 'list' ) { return true; }
    if ((misi & 2) > 0 && tipe == 'del' ) { return true; }
    if ((misi & 4) > 0 && tipe == 'edit' ) { return true; }
    if ((misi & 1) > 0 && tipe == 'add' ) { return true; }
    return false;
  },
  getMeta(metadata){
    // meta : field | label | viewfield | flag | align | tag | type | default 
    // flag : 11.haschild 10.hasparent 9.number, 8.primary, 7.required, 6.readonly, 5.filter, 4.search, 3.add, 2.view, 1.list, 0.edit
    // link : linktablename | linkfield | displayfield1, displayfield12, displayfield3
    // childselect: FldName ; FldSelectFilterFld | ..dst 
    // let roles = this.roles
    const tcolumns = Array();
    const stringtype = ['VARCHAR', 'TEXT', 'TEXTAREA'];
    const tablename = metadata.tablemeta.name; 
    // tableflag : Search,Delete,Add,View,List,Edit
    const tableflag = metadata.tablemeta.flag;
    let lenf = tableflag.length - 1;
    metadata.roles.edit = (tableflag.substr(lenf - 0, 1) === '1');
    metadata.roles.list = (tableflag.substr(lenf - 1, 1) === '1');
    metadata.roles.view = (tableflag.substr(lenf - 2, 1) === '1');
    metadata.roles.add = (tableflag.substr(lenf - 3, 1) === '1');
    metadata.roles.delete = (tableflag.substr(lenf - 4, 1) === '1');
    metadata.roles.search = (tableflag.substr(lenf - 5, 1) === '1');
    delete(metadata.tablemeta.flag);
    for (let item of metadata.columns) {
        const meta = item.meta.split('|');
        item.field = meta[0];
        item.label = meta[1];
        item.viewfield = meta[2];
        item.flag = meta[3];
        item.align = meta[4];
        item.tag = meta[5];
        item.type = meta[6];
        lenf = item.flag.length - 1;
        item.edit = (item.flag.substr(lenf - 0, 1) === '1') && metadata.roles.edit;
        item.list = (item.flag.substr(lenf - 1, 1) === '1') && metadata.roles.list;
        item.view = (item.flag.substr(lenf - 2, 1) === '1') && metadata.roles.view;
        item.add = (item.flag.substr(lenf - 3, 1) === '1') && metadata.roles.add;
        item.search = (item.flag.substr(lenf - 4, 1) === '1') && metadata.roles.search;
        item.filter = (item.flag.substr(lenf - 5, 1) === '1');
        item.readonly = (item.flag.substr(lenf - 6, 1) === '1');
        item.required = (item.flag.substr(lenf - 7, 1) === '1');
        item.primary = (item.flag.substr(lenf - 8, 1) === '1');
        item.isnumber = (item.flag.substr(lenf - 9, 1) === '1');
        item.hasparent = (item.flag.substr(lenf - 10, 1) === '1');
        item.haschild = (item.flag.substr(lenf - 11, 1) === '1');
        item.iscustom = (item.flag.substr(lenf - 12, 1) === '1');
        if (!metadata.tablemeta.thumbnail && item.file) metadata.tablemeta.thumbnail = 'thumb_' + item.field;
        if (!item.iscustom && !metadata.tablemeta.h2 && item.type === 'VARCHAR' && stringtype.includes(item.tag) ) metadata.tablemeta.h2 = item.field;
        else {
            if (!item.iscustom && !metadata.tablemeta.h3 && item.type === 'VARCHAR' && stringtype.includes(item.tag) ) metadata.tablemeta.h3 = item.field;
            else if (!item.iscustom && !metadata.tablemeta.span && stringtype.includes(item.type) && stringtype.includes(item.tag) ) metadata.tablemeta.span = item.field;
        }
        if (item.flag.substr(lenf - 1, 1) === '1') item.visibility = '1'; else item.visibility = '0';
        let def = '';
        if (item.isnumber) def = '0'; else def = '';
        if (item.primary) metadata.tablemeta.primary = item.field;
        if (item.link) {
            const link = item.link.split('|');
            item.linktable = link[0];
            item.linkfield = link[1];
            item.linkdisplay1 = link[2];
            if (link[3]) { item.linkdisplay2 = link[3]; }
            if (link[4]) { item.linkdisplay3 = link[4]; }
        }
        if (item.tagval) {
            let itemval = Array();
            const aval = item.tagval.split('|');
            if (aval.length > 0) {
                for (const itval of aval) {
                    const rinci = itval.split(',');
                    if (rinci[0].length > 0 && rinci[1].length > 0) {
                        rinci[0] = rinci[0].replace(/"/gi, '');
                        rinci[1] = rinci[1].replace(/"/gi, '');
                        const temp = { value: rinci[0], label: rinci[1] };
                        itemval.push(temp);
                    }
                }
            }
            item.tagval = itemval;
        }
        delete(item.flag);
        delete(item.meta);
        tcolumns.push(item);
    }
    for (const item of tcolumns) {
        if (!item['iscustom'] && !metadata.tablemeta.h2 && item['type'] === 'LONGTEXT' && stringtype.includes(item['tag']) ) metadata.tablemeta.h2 = item['field'];
        else {
            if (!item['iscustom'] && !metadata.tablemeta.h3 && item['type'] === 'LONGTEXT' && stringtype.includes(item['tag']) ) metadata.tablemeta.h3 = item['field'];
            else if (!item['iscustom'] && !metadata.tablemeta.span && stringtype.includes(item['type']) && stringtype.includes(item['tag']) ) metadata.tablemeta.span = item['field'];
        }
    }
    metadata.columns = tcolumns;
    return metadata;
  },

  async getAllmeta(){
      for(let item of store.state.model){
          item['roles'] = { view: true, add: false, edit: false, list: false, delete: false, copy: false, search: false, filter: false };
          store.state.dbmodel[item.name]={}
          Object.assign(store.state.dbmodel[item.name],Object.assign({}, this.getMeta(item)))
      }
  },

  fieldIsfilter(col){
      // console.log()
      return  (col.tag == 'SELECT' || col.tag == 'RADIO') && col.search && col.filter
  },

  rolescheck(meta, isadd) {
    return ((meta.edit && !isadd) || (meta.add && isadd));
  },

  tagtype(col, tipe) {
      tipe = tipe.toLowerCase();
      if ( tipe === 'text') return col.tag === 'TEXT' && col.type !== 'DATE' && col.type !== 'TIME' && col.type !== 'DATETIME';
      else if ( tipe === 'date') return col.tag === 'TEXT' && col.type === 'DATE';
      else if ( tipe === 'time') return col.tag === 'TEXT' && col.type === 'TIME';
      else if ( tipe === 'datetime') return col.tag === 'TEXT' && col.type === 'DATETIME';
      else if ( tipe === 'textarea') return col.tag === 'TEXTAREA';
      else if ( tipe === 'hidden') return col.tag === 'HIDDEN';
      else if ( tipe === 'select') return col.tag === 'SELECT' || col.tag === 'CHECKBOX' || col.tag === 'RADIO';
  },

  concatlinkdisplay(link, col,joinchar: any = ' - ') {
      let out = '';
      if (col.linkdisplay1) out = link[col.linkdisplay1];
      if (col.linkdisplay2) out = out + joinchar + link[col.linkdisplay2];
      if (col.linkdisplay3) out = out + joinchar + link[col.linkdisplay3];
      return out;
  },

  isString(x) {
      return Object.prototype.toString.call(x) === '[object String]';
  },

  tampiltag(tag, row, columns) {
      if (row[tag]) {
        if(columns) {
          const col = columns.find(x => x.field === tag);
          return this.tampildata(col,row); 
        } else return row[tag]
      } else return '';
  },
  
  tampilpic(url, tipes = 'produk') {
      if(!url) {
          if(tipes=='produk') url = './assets/images/noimage.png'; else  {
              const idx = Math.floor(Math.random() * 20) + 1 
              url = './assets/images/faces/face' + idx + '.jpg'
          }
      }
      return url
  },
  
  picerror(e, tipes = 'produk') {
      let url =''
      if(tipes=='produk') url = './assets/images/noimage.png'; else  {
          const idx = Math.floor(Math.random() * 20) + 1
          url = './assets/images/faces/face' + idx + '.jpg'
      }
      e.target.src = url;
  },
  
  async getAllsmall(){
      return new Promise(() => {
          for(let small in store.state.small_foreign){
          small  = store.state.small_foreign[small]
          store.state.masterdata[small] = Array();
          const pagemeta = {tablename : small, page : 1, pagesize : 2000, pageid : small+'|list' }
          let goapi = funcapi.createurl(pagemeta);
          axios
              .get(goapi!.url+goapi!.param, funcapi.createheader('json'))
              .then(res => {
                const ares = funcapi.getresult(res);
                if(ares.success == 1 && ares.data) Object.assign(store.state.masterdata[small],Object.assign({},ares.data.data));
              })
              .catch(error => {});
          }
      })
  },  
}
