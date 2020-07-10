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
      <el-popover placement="left" trigger="manual" v-model="visible">
        <div @click="visible = false">
          <el-radio-group v-model="cc">
            <el-radio-button :label="2" :key="2">2</el-radio-button>
            <el-radio-button :label="3" :key="3">3</el-radio-button>
            <el-radio-button :label="4" :key="4">4</el-radio-button>
          </el-radio-group>
        </div>
        <div slot="reference" class="right-bottom flex-center" @click="visible = !visible">
          <i class="el-icon-menu"></i>
        </div>
      </el-popover>
      <div class="swiper-container swiper1">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="list in alllist" :key="list.name">
            <div class="swiper-container swiper2" :class="'swiper1-'+list.id">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="list flex">
                    <div
                      v-for="v in list.listdata"
                      :key="v.id"
                      class="card flex-col flex-center"
                      @click="goto(v)"
                      v-observe="'animated zoomIn faster'"
                      :style="{width:column.width,height:column.height}"
                    >
                      <img :style="{width:column.imgsize}" :src="v.head" alt />
                      <div :style="{fontSize:column.fontsize+'rem'}" class="title">{{v.user}}</div>
                      <div :style="{fontSize:.8*column.fontsize+'rem'}">
                        {{v.fans}}
                        <span class="el-icon-arrow-right"></span>
                      </div>
                    </div>
                  </div>
                  <div v-observe.always="loadmore" class="footer">{{list.complete?'到底了~':''}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import peopleList from "./people-list";
import { flexView, wait, loadimg } from "../plugins/util";
export default {
  name: "Home",
  components: {
    // peopleList
  },
  data() {
    return {
      activeId: 1,
      tabsnum: 4,
      index: 0,
      deviceHeight: 0,
      deviceWidth: 0,
      touch: false,
      loading: false,
      page: 1,
      size: 10,
      delay: 300,
      font: null,
      columnStyle: {
        "2": {
          radio: 1,
          width: "44%",
          height: 0,
          imgsize: "82%",
          fontsize: 1
        },
        "3": {
          radio: 1.3,
          width: "28%",
          height: 0,
          imgsize: "78%",
          fontsize: 0.8
        },
        "4": {
          radio: 1.5,
          width: "21%",
          height: 0,
          imgsize: "67%",
          fontsize: 0.6
        }
      },
      cc: 2,
      firstLoad: true,
      alllist: Object.entries({ 微博: 1, 小红书: 5, B站: 3, 抖音: 4 }).map(
        ([name, id]) => ({
          id,
          name,
          page: 1,
          listdata: [],
          loading: false,
          preload: false,
          nextlist: []
        })
      ),
      defaultHead: require("@/assets/user.png"),
      visible: false
    };
  },
  watch: {
    font() {
      this.initColumn();
    },
    cc() {
      this.initColumn();
    },
    index() {
      if (this.index === parseInt(this.index)) {
        this.activeId = this.alllist[this.index].id;
      }
    },
    activeId(id) {
      localStorage["platform_id"] = id;
    }
  },
  computed: {
    translateX() {
      return {
        transform: `translateX(${this.index * 100}%)`,
        transition: this.touch ? "" : "all .5s ease-in-out"
      };
    },
    column() {
      return this.columnStyle[this.cc];
    }
  },
  methods: {
    flexView,
    updateinside() {
      setTimeout(() => {
        this.alllist.forEach(v => {
          v.swiper.updateSlides();
        });
      }, this.delay);
    },
    initColumn() {
      let font = parseInt(this.font);
      let num = parseInt(
        (this.deviceHeight - font * 3) /
          ((parseInt(this.column.width) / 100) *
            this.deviceWidth *
            this.column.radio)
      );
      // console.log((this.deviceHeight - font * 3) / num);
      this.column.height = (this.deviceHeight - font * 3) / num + "px";
      this.size = this.cc * num * 2;
      this.updateinside();
    },
    changeTab(v, i) {
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
    initinside(name) {
      return this.$swiper(".swiper1-" + name, {
        direction: "vertical",
        slidesPerView: "auto",
        resistanceRatio: 0.7,
        freeMode: true
      });
    },
    goto(v) {
      location.href = v.url;
    },
    loadmore() {
      this.getlistdata();
    },
    request(list) {
      if (list.loading) return;
      list.loading = true;
      return this.axios
        .post("http://10.228.88.220:17734/rest/api/red/queryAll", {
          current: list.page,
          size: this.size,
          customItem1c: list.id
        })
        .then(async res => {
          if (res.status === 200) {
            // console.log(res.data);
            let { content, totalElements: total } = res.data;
            let data = content.map(v => ({
              url: v.customItem13c,
              head: v.imgUrl,
              user: v.name,
              fans: (v.customItem3c / 10000).toFixed(1) + "w 粉丝"
            }));

            let heads = await Promise.all(
              data.map(v => loadimg(v.head, this.defaultHead))
            );
            data.forEach((v, i) => {
              v.head = heads[i];
            });
            list.listdata.push(...data);
            list.page++;
            list.loading = false;
            this.updateinside();
            console.log(total.total)
            console.log(list.listdata.length)
            if (list.listdata.length >=total.total) {
              list.complete = true;
            }
          }
          return res.status === 200;
        });
    },
    async getlistdata() {
      console.warn("getlistdata");
      let list = this.alllist.find(v => v.id === this.activeId);
      if (list.complete) return;
      let msg = this.$Message.loading({
        content: "加载中...",
        duration: 0
      });
      let success = await this.request(list);
      if (this.firstLoad) {
        this.alllist.forEach(v => {
          if (v.id !== this.activeId) {
            this.request(v);
          }
        });
        this.firstLoad = false;
      }
      if (success) {
        msg();
      }
      await wait();
      // list.listdata.push(
      //   ...Array.from({ length: this.size }, () => {
      //     return {
      //       user: "白小染ECHO",
      //       //粉丝数
      //       fans: "15.3w 粉丝",
      //       //头像
      //       head: require("../assets/head1.jpeg")
      //     };
      //   })
      // );
      // msg();
      // this.updateinside();
      // if (list.listdata.length >= 50) {
      //   list.complete = true;
      // }
    }
  },
  mounted() {
    this.flexView();
    this.initswiper();
    this.alllist.forEach(v => {
      v.swiper = this.initinside(v.id); //这里这个属性值不能被vue观测，否则会被改变该值的__proto__
    });
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
  z-index: 1200;
  position: fixed;
  width: 100%;
  background: #fff;
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
  position: relative;
  top: 3rem;
  height: calc(100% - 3rem);
  overflow: hidden;
  .swiper-container {
    height: 100%;
  }
  .swiper1-1 {
    background: #f3f3f0cc;
  }
  .swiper1-3 {
    background: #f0f2eca1;
  }
  .swiper1-5 {
    background: #f8f1f5cc;
  }
  .swiper1-4 {
    background: #e9f1ede3;
  }
  .swiper2 .swiper-slide {
    height: auto !important;
    width: auto !important;
  }
  .list {
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 0.5rem;
    .card {
      //   padding-top: 0.3rem;
      //   width: 28%;
      text-align: center;
      //   margin-top: 0.6rem;
    }
    img {
      margin: 2%;
      //   width: 80%;
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
    }
    .el-icon-arrow-right {
      color: #90cafb;
      font-weight: bold;
    }
  }
  .footer {
    height: 1rem;
  }
  .right-bottom {
    position: absolute;
    right: 0.5rem;
    bottom: 1.5rem;
    border-radius: 50%;
    height: 2.2rem;
    width: 2.2rem;
    background: #61b0e8fc;
    box-shadow: 0 0 2px 2px rgba(6, 119, 212, 0.1),
      0 0 4px 4px rgba(6, 119, 212, 0.1);
    z-index: 10;
    font-size: var(--xmfont);
    color: #fff;
  }
  .el-radio-button__inner {
    font-size: var(--mfont);
  }
}
</style>
