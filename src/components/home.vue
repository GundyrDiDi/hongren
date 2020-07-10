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
      <el-popover placement="left" trigger="click">
        <div>
          <el-radio-group v-model="cc">
            <el-radio-button :label="2" :key="2">2</el-radio-button>
            <el-radio-button :label="3" :key="3">3</el-radio-button>
            <el-radio-button :label="4" :key="4">4</el-radio-button>
          </el-radio-group>
        </div>
        <div slot="reference" class="right-bottom flex-center">
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
                        v-for="(v,i) in listdata" :key="i"
                        class="card flex-col flex-center"
                        @click="goto(v)"
                        v-observe="'animated zoomIn faster'"
                        :style="{width:column.width,height:column.height}"
                      >
                        <img :style="{width:column.imgsize}" :src="v.head" alt />
                        <div class="title">{{v.ownerId}}</div>
                        <div>{{v.customItem2__c}}</div>
                      </div>
                  </div>
                  <div v-observe.always="getlistdata" class="footer"></div>
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
import { flexView, wait } from "../plugins/util";
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
          imgsize: "85%",
          fontsize: ""
        },
        "3": {
          radio: 1.3,
          width: "28%",
          height: 0,
          imgsize: "80%",
          fontsize: ""
        },
        "4": {
          radio: 1.5,
          width: "21%",
          height: 0,
          imgsize: "70%",
          fontsize: ""
        }
      },
      cc:2,
      alllist: [
        {
          id: "1",
          name: "微博",
          listdata: [],
          page: 1,
          swiper: null
        },
        {
          id: "5",
          name: "小红书",
          listdata: [],
          page: 1,
          swiper: null
        },
        {
          id: "3",
          name: "B站",
          listdata: [],
          page: 1,
          swiper: null
        },
        {
          id: "4",
          name: "抖音",
          listdata: [],
          page: 1,
          swiper: null
        }
      ],
      listdata: []
    };
  },
  watch: {
    listdata() {
      //   setTimeout(() => {
      //     this.s2.updateSlides();
      //   }, this.delay);
    },
    font() {
      let font = parseInt(this.font);
      this.$Message.config({
        top: font * 4,
        duration: 0
      });
      this.initColumn();
    },
    cc() {
      this.initColumn();
      //   setTimeout(() => {
      //     this.s2.updateSlides();
      //   }, this.delay);
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
    initColumn() {
      let font = parseInt(this.font);
      let num = parseInt(
        (this.deviceHeight - font * 3) /
          ((parseInt(this.column.width) / 100) *
            this.deviceWidth *
            this.column.radio)
      );
      console.log((this.deviceHeight - font * 3) / num);
      this.column.height = (this.deviceHeight - font * 3) / num + "px";
      this.size = this.cc * num;
    },
    changeTab(v, i) {
      this.activeTab = v.id;
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
        freeMode: true,
        on:{
            progress(){
                console.log(this)
            }
        }
      });
    },
    goto() {},
    loadmore() {
      this.getlistdata();
    },
    async getlistdata() {
      console.log("getlistdata");
      let msg = this.$Message.loading({
        content: "加载中, 请稍侯...",
        duration: 0
      });
      await wait();
      //   this.axios
      //     .post("http://10.228.88.9:8000/rest/api/red/queryAll", {
      //       current: 1,
      //       size: 10
      //     })
      //     .then(res => {
      //       console.log(res);
      //     });
      msg();
      this.listdata = this.listdata.concat(
        Array.from({ length: this.size*2 }, () => {
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
    this.alllist.forEach(v => {
      v.swiper = this.initinside(v.id);
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
    // height: auto !important;
    // width: auto !important;
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
      font-size: var(--xxsfont);
    }
    img {
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
      font-size: var(--xsfont);
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
}
</style>
