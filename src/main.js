import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import './plugins/swiper.js'
import './assets/animate.css'
import 'normalize.css'
import './plugins/directive'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
