<script>
export default {
  install(Vue, options) {
    Vue.prototype.$toast = function(text) {
      const container = document.createElement('div');
      container.className = "toast";
      const ele = document.createElement('div');
      ele.appendChild(document.createTextNode(text));
      container.appendChild(ele);
      document.body.appendChild(container);

      setTimeout(() => {
        container.remove();
      }, 2000);
    }
  }
}
</script>

<style lang="stylus">
.toast
  position fixed
  z-index 100
  left 0
  right 0
  top 0
  bottom 0
  display flex
  align-items center
  justify-content center
  div
    border-radius (8/16)rem
    background-color rgba(0, 0, 0, 0.7)
    height (45/16)rem
    line-height (45/16)rem
    padding 0 (25/16)rem
    font-size (15/16)rem
    color #ffffff
</style>
