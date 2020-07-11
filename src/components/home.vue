<template>
  <div class="home">
    <div class="search">
      <el-input v-model="keyword" placeholder="搜索红人" clearable></el-input>
      <div v-show="!keyword" class="el-icon-search"></div>
    </div>
    <div class="shadow" v-show="keyword"></div>
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <div class="nav flex" v-show="!keyword">
        <div
          v-for="(v, i) in alllist"
          :key="v.name"
          @click="changeTab(v, i)"
          :class="{ active: i === index }"
        >{{ v.name }}</div>
        <b :style="translateX"></b>
      </div>
    </transition>
    <transition
      enter-active-class="animated fadeIn faster"
      leave-active-class="animated fadeOut faster"
    >
      <div class="page" :style="{opacity:this.showpage?1:0}" v-show="!keyword">
        {{this.alllist.find(v=>v.id===activeId).current}}/{{this.alllist.find(v=>v.id===activeId).total}}
      </div>
    </transition>
    <transition>
      <div class="content" v-show="!keyword">
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
            <div class="swiper-slide outside" v-for="(list) in alllist" :key="list.name">
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
                          <span v-if="v.fans" class="el-icon-arrow-right"></span>
                        </div>
                      </div>
                    </div>
                    <div
                      :data-id="list.id"
                      v-observe.always="getlistdata"
                      class="footer flex-center"
                    >{{list.complete?'到底了~':''}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition
      enter-active-class="animated slideInUp faster"
      leave-active-class="animated slideOutDown faster"
    >
      <div class="result" v-show="keyword">
        <div v-for="plat in result" :key="plat.id">
          <div
            v-if="plat.data.length"
            class="result-title hordivider"
            @click="plat.collapse=!plat.collapse"
          >
            {{plat.name}}
            <i
              class="el-icon-arrow-down"
              :style="{transform:`rotate(${plat.collapse?'-90deg':'0deg'})`}"
            ></i>
          </div>
          <div class="result-list" :style="{height:plat.collapse?'0':plat.height}">
            <div class="list flex" ref="result">
              <div
                v-for="v in plat.data"
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
                  <span v-if="v.fans" class="el-icon-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="noresult"
          v-show="!result.map(v=>v.data.length).reduce((acc,v)=>acc+v,0)"
        >未搜索到符合条件的红人</div>
      </div>
    </transition>
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
      size: 10,
      delay: 300,
      font: null,
      columnStyle: {
        "2": {
          radio: 1,
          width: "44%",
          height: 0,
          imgsize: "78%",
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
      cc: 3,
      firstLoad: true,
      alllist: Object.entries({ 微博: 1, 小红书: 5, B站: 3, 抖音: 4 }).map(
        ([name, id]) => ({
          id,
          name,
          listdata: [],
          loading: false,
          preload: false,
          nextlist: [],
          total: 0,
          current:0,
        })
      ),
      defaultHead: require("@/assets/user.png"),
      visible: false,
      slidestyle: [{}, {}, {}, {}],
      msg: null,
      keyword: "",
      result: Object.entries({ 微博: 1, 小红书: 5, B站: 3, 抖音: 4 }).map(
        ([name, id]) => ({
          id,
          name,
          data: [],
          collapse: false,
          height: 0
        })
      ),
      showpage:false,
    };
  },
  watch: {
    font() {
      let font = parseInt(this.font);
      this.$Message.config({
        top: font * 6,
        duration: 0
      });
      this.initColumn();
    },
    cc(now, old) {
      localStorage["column"] = now;
      this.initColumn();
      if (now > old) {
        this.alllist.find(v => v.id === this.activeId).swiper.slideTo(0, 600);
      }
    },
    index() {
      if (this.index === parseInt(this.index)) {
        this.activeId = this.alllist[this.index].id;
      }
    },
    activeId(id) {
      console.log(id);
      localStorage["platform_id"] = id;
    },
    keyword(word) {
      if (word) {
        if (!location.hash) {
          location.hash = "search";
        }
        setTimeout(() => {
          if (word === this.keyword) {
            if (word) {
              this.search(word);
            } else {
              this.result.forEach(v => {
                v.collapse = false;
                v.data = [];
              });
            }
          }
        }, 300);
      } else {
        location.hash = "";
      }
      localStorage["hongren_keyword"] = this.keyword;
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
        (this.deviceHeight - font * 5.5) /
          ((parseInt(this.column.width) / 100) *
            this.deviceWidth *
            this.column.radio)
      );
      this.column.height = (this.deviceHeight - font * 5.5) / num + "px";
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
    initinside(name, list) {
      return this.$swiper(".swiper1-" + name, {
        direction: "vertical",
        slidesPerView: "auto",
        resistanceRatio: 0.7,
        freeModeMomentumRatio: 0.7,
        freeMode: true,
        on:{
          sliderMove:()=>{
            this.showpage=true
          },
          touchEnd:()=>{
            this.showpage=false
          },
          progress:()=>{
            if(list.swiper){
              list.current=parseInt(list.swiper.progress*list.listdata.length)
            }
          }
        }
      });
    },
    goto({ url }) {
      if (url) {
        if (!url.trim().startsWith("http")) url = "http://" + url;
        location.href = url;
      }
    },
    toformat(num) {
      if (num > 10000) {
        return (num / 10000).toFixed(1) + "W 粉丝";
      } else if (num > 1000) {
        return (num / 1000).toFixed(2) + "K 粉丝";
      } else {
        return num + " 粉丝";
      }
    },
    async search() {
      console.warn("search");
      // let result=await this.axios.post("/rest/api/red/queryAll",{
      //   current:0,
      //   size:500,
      //   name:this.keyword
      // }).then(res=>{
      //   return res.data.totalElements.map(v => ({
      //         url: v.customItem13c,
      //         head: v.imgUrl,
      //         user: v.name,
      //         plat: v.customItem1c,
      //         fans: this.toformat(v.customItem3c)
      //       }));
      // })

      //模拟
      let result = Array.from({ length: this.size }, () => {
        return {
          url: "http://www.baidu.com",
          head: require("@/assets/head1.jpeg"),
          user: "67893848",
          plat: [3, 4, 5][parseInt(Math.random() * 3)],
          fans: "666 W 粉丝"
        };
      });
      //
      this.result.forEach((v, i) => {
        v.collapse = false;
        v.data = [];
        requestAnimationFrame(() => {
          v.height = getComputedStyle(this.$refs.result[i]).height;
        });
      });
      result.forEach(v1 => {
        this.result.find(v2 => v2.id === v1.plat).data.push(v1);
      });
      this.result.forEach(v => {
        if (v.data.length % this.cc > 1) {
          console.log(this.cc - (v.data.length % this.cc))
          v.data.push(...new Array(this.cc - (v.data.length % this.cc)).fill({}));
        }
      });
    },
    request(list) {
      if (list.loading) return;
      list.loading = true;
      return this.axios
        .post("/rest/api/red/queryAll", {
          // .post("http://10.228.88.220:17734/rest/api/red/queryAll", {
          current: list.listdata.length,
          size: this.size,
          customItem1c: list.id
        })
        .then(async res => {
          if (res.status === 200) {
            // console.log(res.data);
            let { totalElements, content } = res.data;
            let data = totalElements.map(v => ({
              url: v.customItem13c,
              head: v.imgUrl,
              user: v.name,
              plat: v.customItem1c,
              fans: this.toformat(v.customItem3c)
            }));

            let heads = await Promise.all(
              data.map(v => loadimg(v.head, this.defaultHead))
            );
            data.forEach((v, i) => {
              const load = async () => {
                if (v.head !== heads[i]) {
                  v.head = heads[i];
                }
              };
              setTimeout(load, 3000);
            });
            list.listdata.push(...data);
            list.loading = false;
            list.total = content;
            this.updateinside();
            if (list.listdata.length >= content) {
              if (list.listdata.length % this.cc > 1) {
                list.listdata.push(
                  ...new Array(this.cc - (list.listdata.length % this.cc)).fill({})
                );
              }
              list.complete = true;
            }
          }
          return res.status === 200;
        });
    },
    async getlistdata(id) {
      if (!id) {
        id = this.activeId;
      }
      console.warn("getlistdata");
      let list = this.alllist.find(v => v.id === id);
      if (list.complete) return;
      if (!this.msg) {
        this.msg = this.$Message.loading({
          content: "加载中...",
          duration: 0
        });
      }
      // let success = await this.request(list);
      // if (this.firstLoad) {
      //   this.alllist.forEach(v => {
      //     if (v.id !== this.activeId) {
      //       this.request(v);
      //     }
      //   });
      //   this.firstLoad = false;
      // }
      // console.log(list);
      // console.log(success);
      // if (success) {
      //   if(this.alllist.every(v=>!v.loading)){
      //     this.msg&&this.msg();
      //     this.msg=null
      //   }
      // }

      //模拟
      list.loading = true;
      await wait();
      list.listdata.push(
        ...Array.from({ length: this.size }, () => {
          return {
            url: "",
            head: require("@/assets/head1.jpeg"),
            user: "67893848",
            plat: 1,
            fans: "666 W 粉丝"
          };
        })
      );
      list.loading = false;
      list.total = 100;
      this.updateinside();
      if (this.alllist.every(v => !v.loading)) {
        this.msg && this.msg();
        this.msg = null;
      }
    }
  },
  mounted() {
    this.flexView();
    this.initswiper();
    this.alllist.forEach(v => {
      v.swiper = this.initinside(v.id,v); //这里这个属性值不能被vue观测，否则会被改变该值的__proto__
    });
    this.activeId = parseInt(localStorage["platform_id"]);
    this.index = this.alllist.findIndex(v => v.id === this.activeId);
    this.cc = parseInt(localStorage["column"]) || 3;
    this.s1.slideTo(this.index);
    this.slidestyle.forEach((v, i) => {
      v.left = this.deviceWidth * i + "px";
    });
    setTimeout(() => {
      this.keyword = localStorage["hongren_keyword"];
    }, 1000);
    window.onhashchange = () => {
      if (!location.hash) this.keyword = "";
    };
  }
};
</script>

<style lang="less">
.home {
  height: 100%;
  width: 100%;
}
.search {
  position: relative;
  height: 2.5rem;
  padding: 0.5rem 2rem 0 2rem;
  input {
    height: 2rem;
    font-size: var(--sfont);
    border-radius: 1rem;
  }
  .el-icon-search {
    position: absolute;
    top: 40%;
    right: 2.6rem;
    color: #f68dc7;
    font-size: 1rem;
  }
  .el-input__clear {
    font-size: 1rem;
    transform: translateY(-0.15rem);
  }
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
    height: 2.5rem;
    line-height: 2.5rem;
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
  top: 2.5rem;
  height: calc(100% - 5rem);
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
  .footer {
    height: 1rem;
    color: #aaa;
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
.result {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: calc(100% - 3.5rem);
  background: #fafcff;
  overflow: scroll;
  padding-top: 1px;
  .result-title {
    background: #fff;
    // border-top:1px solid #ddd;
    padding: 0.4rem 1rem;
    font-size: var(--sfont);
    color: #689dde;
    i {
      float: right;
      transition: all 0.5s;
      margin-top: 0.2rem;
    }
  }
  .result-list {
    overflow: hidden;
    transition: height 0.5s ease-in-out;
  }
  .list {
    box-shadow: 0 1px 1px inset rgba(0, 0, 0, 0.15);
  }
}
.noresult {
  color: #aaa;
  text-align: center;
  margin-top: 2rem;
}
.shadow {
  position: absolute;
  top: 2.5rem;
  width: 100%;
  z-index: 100;
  height: 1rem;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
}
.page {
  background: #fff;
  position: absolute;
  top: 5rem;
  width: 100%;
  text-align: center;
  z-index: 9999;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.7s;
  opacity: 1;
  padding:.2rem 0;
}
</style>
