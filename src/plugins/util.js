export function flexView() {
  this.deviceHeight = window.innerHeight;
  this.deviceWidth = window.innerWidth;
  const docEl = document.documentElement.style;
  document.body.style.height = this.deviceHeight + "px";
  window.addEventListener("resize", () => {
    if (document.body.scrollHeight < this.deviceHeight) {
      document.body.style.height = this.deviceHeight + "px";
    }
    recalc();
  });
  const recalc = () => {
    this.font=docEl.fontSize = 18 * (window.innerWidth / 375) + "px";
  };
  window.addEventListener("orientationchange", recalc, false);
  window.addEventListener("pageshow", recalc, false);
  document.addEventListener("DOMContentLoaded", recalc, false);
}
export function wait(time = 1000, promise) {
  let delay = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
  if (promise instanceof Promise) {
    delay = Promise.all([promise, delay]).then((res) => res[0]);
  }
  return delay;
}

export function preload(){
    
}
