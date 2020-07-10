import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import './plugins/swiper.js'
import './assets/animate.css'
import 'normalize.css'
import './plugins/directive'
import './plugins/iview.js'
import './assets/swiper.css'
import VConsole from 'vconsole'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

let vc=new VConsole()
console.log(vc)
