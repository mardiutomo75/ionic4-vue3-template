import { store } from "../../store/store";
import axios from "axios";

export const funcapi =  {
    createurl(pagemeta, action: any = 'list'){
        pagemeta = this.preparemeta(pagemeta);
        if(action == 'list'){
            let goapi = '';
            let url = '';
            let filter = '';
            if(pagemeta.filter){
                pagemeta.filter.forEach( function(item) {
                    filter = filter + item.key + ':' + item.operator + ':' + item.value + ';' ;
                });
            }
            filter = '?filter=' + filter;
            url = store.state.baseUrl + store.state.endpoint  + 'list/' + pagemeta.tablename; 
            goapi = filter + '&relation=' + pagemeta.relation + '&limit=' + pagemeta.pagesize + '&pageid=' + store.state.pageid
            goapi = goapi + '&page=' + pagemeta.pagenumber + '&orderby=' + pagemeta.order + '&sort' + pagemeta.sort
            goapi = goapi + '&search=' + pagemeta.searchtext;
            return {url: url, param: goapi};
        } else if(action == 'struc'){
            let goapi = '';
            let url = store.state.baseUrl + store.state.endpoint + 'classbuilder/'+  pagemeta.tablename + '/struc' ; 
            return {url: url, param: goapi};
        }
    },
    createpayload(pagemeta: any, action: any = 'list'){
        pagemeta = this.preparemeta(pagemeta);
        let goapi = Object;
        let filter = '';
        if(pagemeta.filter){
            pagemeta.filter.forEach( function(item) {
                filter = item.key + ':' + item.operator + ':' + item.value + ';' ;
            });
        }
        goapi['filter'] = filter;
        goapi['url'] = store.state.baseUrl + store.state.endpoint + action + '/' + pagemeta.tablename;
        goapi['relation'] = pagemeta.relation;
        goapi['limit'] = pagemeta.limit;
        goapi['pageid'] = pagemeta.pageid;
        goapi['page'] = pagemeta.pagenumber;
        goapi['orderby'] = pagemeta.order + '&sort' + pagemeta.sort
        goapi['sort'] = pagemeta.sort
        goapi['search'] = pagemeta.searchtext;
        return goapi;
    },
    createheader(type: any = 'json'){
        const aimage = ['jpg','png','tiff','gif','ico','bmp'];
        const adoc = ['doc','pdf','json','xls','txt'];
        if(aimage.includes(type)) type = 'image/'+type;
        else if(adoc.includes(type)) type = 'application/'+type;
        let token = '';
        if(store.state.token) token = 'bearer ' + store.state.token;
        return { 
            'headers': { 
                'Authorization': token,
                'Content-Type' : type
            } 
        }
    },
    preparemeta(pagemeta){
        const isi = ['tablename','url','relation','pageid','searchtext'];
        if(!pagemeta.filter) pagemeta['filter'] = Array();
        if(!pagemeta.limit) pagemeta['limit'] = 25;
        if(!pagemeta.order) pagemeta['order'] = 'id';
        if(!pagemeta.sort) pagemeta['sort'] = 'desc';
        if(!pagemeta.pagenumber) pagemeta['pagenumber'] = 1;
        isi.forEach( function(item) {
            if(!pagemeta[item]) pagemeta[item] = '';
        });
        return pagemeta;
    },
    getresult(res: any){
        return res.data;
    },
  
}