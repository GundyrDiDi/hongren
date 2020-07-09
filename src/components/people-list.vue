<template>
  <div class="swiper-container swiper2">
    <div class="swiper-wrapper">
      <div class="swiper-slide" ref="slide">
        <div class="list flex" ref="list">
          <transition
            v-for="(v,i) in data"
            :key="i"
            enter-active-class="animated zoomIn faster"
            appear
          >
            <div @click="goto(v)">
              <img :src="v.head" alt />
              <div class="title">{{v.ownerId}}</div>
              <div>{{v.customItem2__c}}</div>
            </div>
          </transition>
        </div>
        <div class="footer"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "people-list",
  props: ["data"],
  data() {
    return {
      s2: null
    };
  },
  watch: {
    data() {
        setTimeout(()=>{
            this.$refs.slide.style.height=getComputedStyle( this.$refs.list).height
        console.log(getComputedStyle( this.$refs.list).height)
        console.log(getComputedStyle( this.$refs.slide).height)
        this.s2.updateSlides()
        },300)
    }
  },
  methods: {
    initinside() {
      this.s2 = this.$swiper(this.$el, {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        allowSlidePrev:false,
      });
    },
    goto() {}
  },
  mounted() {
    this.initinside();
  }
};
</script>

<style scoped lang="less">
.list {
  background: #f3f3f0cc;
  justify-content: space-between;
  flex-wrap: wrap;
  > div {
    padding-top: 0.3rem;
    width: 28%;
    text-align: center;
    margin-top: 0.6rem;
    font-size: var(--xxsfont);
  }
  img {
    width: 80%;
    border-radius: 50%;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  }
  .title {
    line-height: 1.6rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 600;
    overflow: hidden;
    padding: 0 0.5rem;
    font-size: var(--xsfont);
  }
}
</style>