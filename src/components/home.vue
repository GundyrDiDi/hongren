<template>
  <div class="home">
    <div class="nav flex">
      <div
        v-for="(v, i) in alllist"
        :key="v.name"
        @click="changeTab(v, i)"
        :class="{ active: i === index }"
      >{{ v.name }}</div>
      <b :style="translateX"></b>
    </div>
    <div class="content">
      <div class="swiper-container swiper1">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="swiper-container swiper2">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="list flex">
                    <transition v-for="(v,i) in listdata" :key="i">
                      <div @click="goto(v)" v-observe="'animated zoomIn faster'">
                        <img :src="v.head" alt />
                        <div class="title">{{v.ownerId}}</div>
                        <div>{{v.customItem2__c}}</div>
                      </div>
                    </transition>
                  </div>
                  <div v-observe.always="getlistdata" class="footer"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">2</div>
          <div class="swiper-slide">3</div>
          <div class="swiper-slide">4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import peopleList from "./people-list";
import { flexView, wait } from "../plugins/util";
export default {
  name: "Home",
  components: {
    // peopleList
  },
  data() {
    return {
      activeTab: "微博",
      tabsnum: 4,
      index: 0,
      deviceHeight: 0,
      deviceWidth: 0,
      touch: false,
      loading: false,
      page: 1,
      size: 10,
      alllist: [
        {
          id: "1",
          name: "微博",
          listdata: [],
          page: 1
        },
        {
          id: "5",
          name: "小红书",
          listdata: [],
          page: 1
        },
        {
          id: "3",
          name: "B站",
          listdata: [],
          page: 1
        },
        {
          id: "4",
          name: "抖音",
          listdata: [],
          page: 1
        }
      ],
      listdata: []
    };
  },
  watch: {
    listdata() {
      setTimeout(() => {
        this.s2.updateSlides();
      }, 1000);
    }
  },
  computed: {
    translateX() {
      return {
        transform: `translateX(${this.index * 100}%)`,
        transition: this.touch ? "" : "all .5s ease-in-out"
      };
    }
  },
  methods: {
    flexView,
    changeTab(v, i) {
      this.activeTab = v.name;
      this.index = i;
      this.s1.slideTo(i, 500);
    },
    initswiper() {
      let _this = this;
      this.s1 = this.$swiper(".swiper1", {
        on: {
          touchMove() {
            _this.touch = true;
          },
          touchEnd() {
            _this.touch = false;
          },
          progress() {
            _this.index = (_this.tabsnum - 1) * this.progress;
          }
        }
      });
    },
    initinside() {
      this.s2 = this.$swiper(".swiper2", {
        direction: "vertical",
        slidesPerView: "auto",
        resistanceRatio: 0.5,
        freeMode: true
      });
    },
    goto() {},
    loadmore() {
      this.getlistdata();
    },
    async getlistdata() {
      console.log("getlistdata");
      this.$Message.loading({
        content: '正在处理, 请稍后...',
        duration: 1000
    })
      await wait();
      //   this.axios
      //     .post("http://10.228.88.9:8000/rest/api/red/queryAll", {
      //       current: 1,
      //       size: 10
      //     })
      //     .then(res => {
      //       console.log(res);
      //     });
      this.loading = false;
      this.listdata = this.listdata.concat(
        Array.from({ length: 15 }, () => {
          return {
            //红人平台名称
            name: "微博",
            //业务类型
            entityType: "",
            //所有人
            ownerId: "白小染ECHO",
            //粉丝数
            customItem2__c: "15.3w粉丝",
            //头像
            head: require("../assets/head1.jpeg"),
            //所属部门
            dimDepart: "",
            //创建人
            createdBy: "",
            //创建日期
            createdAt: "",
            //修改人
            updatedBy: "",
            //修改日期
            updatedAt: "",
            //锁定状态
            lockStatus: ""
          };
        })
      );
    }
  },
  mounted() {
    this.flexView();
    this.initswiper();
    this.getlistdata();
    this.initinside();
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
}
.nav {
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  > div {
    font-size: var(--sfont);
    width: 25%;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    &.active {
      color: #4693da;
      //   font-weight: 600;
      transition: all 0.1s;
    }
  }
  b {
    display: block;
    height: 0.2rem;
    position: absolute;
    bottom: 0;
    width: 25%;
    background: #61a5e5;
    border-radius: 1px;
  }
}
.content {
  height: calc(100% - 3rem);
  overflow: hidden;
  .swiper-container {
    height: 100%;
  }
  .swiper2 {
    background: #f3f3f0cc;
  }
  .swiper2 .swiper-slide {
    height: auto !important;
    width: auto !important;
  }
  .list {
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 0.5rem;
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
  .footer {
    height: 1rem;
  }
}
</style>
