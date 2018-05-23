import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)
export const store = new Vuex.Store({
  state:{
    // isgoodssave:false,//是否存在id
    goodsInfo:{
      id:0,
      name:'',
      desc:'',
      mainImg:[],
      loopImg:[],
      detail:'',
      number: 0,
      ishot: 0,
      isnew: 0,
      issale: 0,
      relprice: 0,
      sort: 0,
      exprice: 0,

    }
  }
})


// export default new Vuex.Store({
//     state:{
//       abc:"123465789"
//     },
//   // modules,
//   // strict: process.env.NODE_ENV !== 'production',
//
// })
