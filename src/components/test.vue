<!-- Demo styles -->

<template>
  <div class="swiper-container swiper-container-h">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(v,i) in 4" :key="v">
        <div class="swiper-container swiper-container-v" :class="'swiper-container-v'+i">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div style="height:1000px;">
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
                1<br/>
              </div>
            </div>
            <div class="swiper-slide"></div>
          </div>
          <div class="swiper-pagination swiper-pagination-v"></div>
        </div>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination swiper-pagination-h"></div>
  </div>
</template>
<!-- Swiper -->

<!-- Initialize Swiper -->
<script>
export default {
  name: "test",
  data() {
    return {};
  },
  mounted() {
    var swiperH = this.$swiper(".swiper-container-h", {
    //   spaceBetween: 50,
      pagination: {
        el: ".swiper-pagination-h",
        clickable: true
      }
    });
    new Array(4).fill(0).forEach((v,i)=>{
      var swiperV2 = this.$swiper(".swiper-container-v"+i, {
        direction: "vertical",
        freeMode:true,
      //   spaceBetween: 50,
      });
      setTimeout(()=>{
      swiperV2.updateSlides();
      },1000)
      console.log(swiperV2)
    })
    console.log(swiperH)
  }
};
</script>
<style>
  html,
    body {
      position: relative;
      height: 100%;
    }

    body {
      background: #eee;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 140px;
      color: #000;
      margin: 0;
      padding: 0;
    }
</style>
<style scoped>
.swiper-container {
  width: 100%;
  height: 100%;
}
.swiper-slide .swiper-slide{
  height:auto !important;
}
.swiper-slide {
  
  text-align: center;
  font-size: 180px;
  background: #fff;
  display: flex;
}

.swiper-container-v {
  background: #eee;
}
</style>
