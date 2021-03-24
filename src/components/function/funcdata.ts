import { store } from "../../store/store";
import axios from "axios";
import { funcapi } from './funcapi';
import { func } from './func';
import router from '../../router';

export const funcdata =  {
  beforerender(tablemeta: any, items: any){
    if(!items) return;
    let ganti = Array();
    let gantif = Array();
    let gantio = Array();
    for (const col of tablemeta.fieldList) {
      if(tablemeta.relationView){
        if(tablemeta.relationView.indexOf(col+'s')>-1) ganti.push({col: col, id: col+'s', view:'nama'});
      }
      if(store.state.fixoption[col]) gantio.push({col: col, id: col, view:'nama'});
    }
    for(const col of tablemeta.fieldUpload)  gantif.push({col: col, path: store.state.baseUrl+tablemeta.fileRoot});
     
    let i=0;
    for(const item of items) {
      for(const ag of ganti) if(item[ag.id]) if(item[ag.id][ag.view]) item[ag.col+'_view'] = item[ag.id][ag.view];
      for(const ag1 of gantif) if(item[ag1.col]) item[ag1.col] = ag1.path+item[ag1.col];
      if(tablemeta.dates) for(const col of tablemeta.dates) {
        if(item[col]!==null)  item[col] = item[col].substr(0, 10); else item[col]='1930-01-01';
      }
      for(const ag of gantio) {
        const col = ag.col;
        if(item[col]) 
          if(store.state.fixoption[col]) 
            if(store.state.fixoption[col][item[col]]) 
              item[ag.col+'_view'] = store.state.fixoption[col][item[col]]['nama_'+store.state.language];
      }
      items[i]= item;
      i=i+1;
    }
    return items;
  },
  async getstruc(pagemeta){
    const goapi = funcapi.createurl(pagemeta, 'struc');
    await axios
    .get(goapi!.url+goapi!.param, funcapi.createheader('json'))
    .then(res => {
      const ares = funcapi.getresult(res);
      if(ares['success'] == 1 ) {
        pagemeta['tablemeta']=ares['data'];
        pagemeta.judul = ares['data'][store.state.language].field['table_label'];
        return;
      }
    })
    .catch(error => {});
    return;
  },
  getlistwillenter(table){
    return { 
        tablename : table + '',pagesize: 20, totalcount:0, items: Array(), viewitems: Array(), item: 0,
        pagenumber: 1, searchtext: '', totalpage: 2, datafilter: [],
        sort: 'desc', order :'id', pathSingle : '/single/' + table  + '/',
        judul: 'Data ' + func.ucword(table + ''), infinitescroll: false,
        state: 'list', scrollpos: 1
    };
  },
  prepareApilist(pagemeta, route) {
    let filter= Array();
    // if(store.state.currentroute == route.currentRoute._value.fullPath){
    //   pagemeta.datafilter = func.extractFilter(route.query)
    // } else {
    //   pagemeta.datafilter = Object();
    //   return
    // }
    // if(pagemeta.mtable) pagemeta.datafilter[pagemeta.dfield] = pagemeta.mvalue
    if(pagemeta.datafilter) {
      let obj = pagemeta.datafilter;
      Object.keys(obj).forEach(function(key) { 
        if(key!='searchtext') filter.push({key : key, operator : '=', value : obj[key] });
      });
    }
    // console.log(filter);
    pagemeta.filter = filter;
  },
  async gotoPage(pagemeta, router, pageNum: number = 1){
    if(pageNum==1){
      pagemeta.items = Array();
      pagemeta.pagenumber = 1
      pagemeta.totaldata = 0
      pagemeta.totalpage = 2
      pagemeta.infinitescroll = true
      pagemeta.scrollpos = 1
    }
    pagemeta.pagenumber = pageNum;
    pagemeta.relation = 'all';
    pagemeta.loading = true;
    store.state.pageid=pagemeta.tablename+'|list';
    this.prepareApilist(pagemeta, router);
    const goapi = funcapi.createurl(pagemeta); 
    await func.apiget(goapi!.url+goapi!.param)
    .then((ares) => {
        pagemeta.loading = false;
        const res = funcapi.getresult(ares);
        if(res.success == 1 ) {
          // const data = res.data.data.map((x) => x);
          // pagemeta.items = pagemeta.items.concat(data);
          pagemeta.items = pagemeta.items.concat(this.beforerender(pagemeta.tablemeta,res.data.data));
          pagemeta.totaldata = res.data.total;
          pagemeta.totalpage = Math.ceil(pagemeta.totaldata/pagemeta.limit);   
          if(res.data.data.length<=0)  func.openToast('Empty');
          // console.log(data);
        } else {
          pagemeta.loading = false;
          func.openToast(res.data.title+' - '+res.message)
          if(res.message.toLowerCase().includes('token')) {
            store.commit('clearLogin');
            router.push('login');
            return
          }
        }
    })
    .catch(error => {
      func.openToast('Connection Error')
    });
  },
  goFilter: function(pagemeta, route){
    if(pagemeta.mtable) return
    if(pagemeta.roles.search){
      let filter = ''
      if(pagemeta.mtable) {
          pagemeta.datafilter[pagemeta.dfield] = pagemeta.mvalue
          filter = '&mtable=' + pagemeta.mtable + '&mvalue=' + pagemeta.mvalue + '&dfield=' + pagemeta.dfield +'&refereal=' + pagemeta.referal
      }
      if(pagemeta.datafilter) {
        let obj = pagemeta.datafilter;
        Object.keys(obj).forEach(function(key) { 
          filter = filter + '&x_' + key + '=' + obj[key];
        });
      }
      // if(route.query.filter) filter =  + route.query.filter; else filter = '?filter=';
      if(route.query.q) filter = '?q=' + route.query.q + filter; else filter = '?q=' + filter
      router.replace('/' + pagemeta.tablename + '/filter' + filter)
    } else {
      func.openToast('Maaf anda tidak mempunyai akses filter data ' + ' !!!!');
    }
  },
}