"use strict";

import Vue from "vue";
// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/swiper-bundle.css";

const Plugin = {};
Plugin.install = function(Vue) {
  Vue.prototype.$swiperSpeed = 800;
  Vue.prototype.$swiper = function(el, config) {
    return new Swiper(el, {
      speed: this.$swiperSpeed,
      updateOnWindowResize: false,
      // roundLengths:true,
      ...config
    });
  };
};

Vue.use(Plugin);

export default Plugin;
