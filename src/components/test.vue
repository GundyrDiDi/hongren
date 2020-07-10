<!-- Demo styles -->

<template>
  <div class="swiper-container swiper-container-h">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Horizontal Slide 1</div>
      <div class="swiper-slide">
        <div class="swiper-container swiper-container-v">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Vertical Slide 1</div>
            <div class="swiper-slide">Vertical Slide 2</div>
            <div class="swiper-slide">Vertical Slide 3</div>
            <div class="swiper-slide">Vertical Slide 4</div>
            <div class="swiper-slide">Vertical Slide 5</div>
          </div>
          <div class="swiper-pagination swiper-pagination-v"></div>
        </div>
      </div>
      <div class="swiper-slide">
          <div class="swiper-container swiper-container-v2">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Vertical Slide 1</div>
            <div class="swiper-slide">Vertical Slide 2</div>
            <div class="swiper-slide">Vertical Slide 3</div>
            <div class="swiper-slide">Vertical Slide 4</div>
            <div class="swiper-slide">Vertical Slide 5</div>
          </div>
          <div class="swiper-pagination swiper-pagination-v"></div>
        </div>
      </div>
      <div class="swiper-slide">Horizontal Slide 4</div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination swiper-pagination-h"></div>
  </div>
</template>
<!-- Swiper -->

<!-- Initialize Swiper -->
<script>
import Swiper from "swiper";
export default {
  name: "test",
  data() {
    return {};
  },
  mounted() {
    var swiperH = new Swiper(".swiper-container-h", {
    //   spaceBetween: 50,
      pagination: {
        el: ".swiper-pagination-h",
        clickable: true
      }
    });
    var swiperV = new Swiper(".swiper-container-v", {
      direction: "vertical",
      freeMode:true,
    //   spaceBetween: 50,
    });
    var swiperV2 = new Swiper(".swiper-container-v2", {
      direction: "vertical",
      freeMode:true,
    //   spaceBetween: 50,
    });
    console.log(swiperH,swiperV,swiperV2)
  }
};
</script>
<style scoped>

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-container-v {
  background: #eee;
}
</style>
