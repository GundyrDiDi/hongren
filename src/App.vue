<template>
  <div id="app">
    <Home />
    <!-- <Test /> -->
  </div>
</template>

<script>
import Home from "@/components/home.vue";
// import Test from "@/components/test.vue";
export default {
  name: "app",
  components: {
    Home,
    // Test
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
@scrollcolor: #ccc;
@bgcolor: rgba(114, 203, 255, 0.3);
@rem: 1rem; // 18px / 375drp
div {
  box-sizing: border-box;
  position: relative;
}
:root {
  --base: @rem;
  --xxsfont: calc(@rem * 0.6);
  --xsfont: calc(@rem * 0.7);
  --sfont: calc(@rem * 0.8);
  --mfont: calc(@rem * 1);
  --xmfont: calc(@rem * 1.25);
  --lfont: calc(@rem * 1.33);
  --xl2font: calc(@rem * 1.5);
  --xlfont: calc(@rem * 2);
  --xxlfont: calc(@rem * 2.5);
  --xxxlfont: calc(@rem * 3);
  --lineshadow: 0 0px 2px 0px rgba(0, 0, 0, 0.2);
  --boxshadow: 0 0 3px 3px rgba(6, 119, 212, 0.02),
    0 0 6px 6px rgba(6, 119, 212, 0.02);
}
.bold {
  font-weight: 400;
}
.bolder {
  font-weight: 600;
}
.boldest {
  font-weight: bold;
}
.yahei {
  font-family: "yahei";
}
.h-title {
  font-size: var(--xxlfont);
  .bold();
  .yahei();
  letter-spacing: 4px;
}
.f-title {
  font-size: var(--xlfont);
  .bolder();
  .yahei();
  letter-spacing: 2px;
}
.s-title {
  .bold();
  .yahei();
  font-size: var(--xmfont);
}
.cen {
  margin: auto;
}
.con-cen > * {
  .cen();
}
.bg {
  position: absolute;
  transform: scale(0.8);
  z-index: -1;
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width:.4rem; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background: @scrollcolor;
  border-radius: 3px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
  border-radius: 1px;
  background: #ededed;
}
.grid {
  display: grid;
}
.flex {
  display: flex;
}
.flex-cen {
  .flex();
  justify-content: center;
}
.flex-ter {
  .flex();
  align-items: center;
}
.flex-center {
  .flex-cen();
  .flex-ter();
}
.flex-bwn {
  .flex();
  justify-content: space-between;
}
.flex-col {
  .flex();
  flex-direction: column;
}
.flex-rev {
  .flex();
  flex-direction: row-reverse;
}
.flex-col-rev {
  .flex();
  flex-direction: column-reverse;
}
.flex-col-cen {
  .flex-col();
  justify-content: center;
}
.flex-wrap {
  .flex();
  flex-wrap: nowrap;
}
a {
  text-decoration: none;
}
@color: rgba(114, 203, 255, 0.3);
@color2: #42a1f2;
@fontcolor: #0b96cc;
.el-button.el-button--light {
  background: @color;
  border: none;
  color: @fontcolor;
  font-size: var(--mfont);
  padding: 1rem 1.6rem;
  border-radius: 0.8rem;
  font-weight: 600;
  &:hover {
    color: darken(@fontcolor, 10%);
    background: darken(@color, 20%);
  }
  &:active {
    background: darken(@color, 30%);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}
.link {
  cursor: pointer;
  font-size: var(--xmfont);
  color: @fontcolor;
  position: relative;
  &:hover {
    color: desaturate(@fontcolor, 50%) !important;
  }
}
.box {
  box-shadow: 0 0 2px 8px rgba(0, 0, 0, 0.02), 0 0 2px 16px rgba(0, 0, 0, 0.02),
    0 0 2px 24px rgba(0, 0, 0, 0.02);
}
.hordivider,.verdivider{
  position:relative;
}
.hordivider:before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #ddd;
  transform: scaleY(0.5);
}
</style>
