<template>
<div class="col-sm-8 autocomplete" >
  <input :placeholder="col.label" v-bind:class="{ required: col.required }" type="text" 
    v-model="defval" class="form-control" @keyup="getLink(col)" :readonly="col.readonly"/>
  <input type="text"  v-model="row[col.field]"/>  
    <!-- <ul class="autocomplete-results">
      <li class="autocomplete-result">
      </li>
    </ul> -->
  </div>
</template>

<style>
  .autocomplete {
    padding-left:0px !important;
    padding-right:0px !important;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }
</style>
<script>
import axios from "axios";
  export default {
    name: 'autocomplete',
    props: ['col','row','tablename','defval'],
    created() {    
        this.tablemeta = this.$store.state.tablemeta[this.tablename]
        this.vcolumns = this.$store.state.columns[this.tablename]
        this.roles = this.$store.state.roles[this.tablename]
        this.headers = { 'headers': { 'X-Authorization': 'Bearer ' + this.$store.state.token } };
    } ,
    data() {
      return {
        
      };
    },
    methods: {
        async getLink(item) {
            let goapi = ''
            let filter = '&filter=' + item.linkdisplay1 + ':like:'+ this.row[item.field]
            goapi = this.$store.state.baseUrl + this.$store.state.endpoint + '?object=' + this.tablename;
            goapi = goapi + '&action=link&link=' + item.field + '&offset=0&limit=10&pageid=' + this.$store.state.pageid + filter;
            await axios
            .get( goapi, this.headers)
            .then(res => {
                if(res.data.success == 1 ) {
                    let tagvalue = [];
                    for (const rows of res.data.data) {
                        tagvalue.push({value: rows[item.linkfield], label: rows[item.linkdisplay1]})
                    }
                    for(let i = 0 ; i<  this.vcolumns.length ; i++ ){
                        if(item.field == this.vcolumns[i].field) {
                            this.vcolumns[i].tagval = tagvalue;
                        }
                    }
                } 
            })
            .catch(error => { });
            },
        },
    };
</script>
