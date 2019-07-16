<template>
  <transition
    :name="transitionName"
    :mode="transitionMode"
    :enter-active-class="transitionEnterActiveClass"
    @beforeLeave="beforeLeave"
    @enter="enter"
    @afterEnter="afterEnter"
  >
    <slot />
  </transition>
</template>

<script>
const DEFAULT_TRANSITION = "fade";
const DEFAULT_TRANSITION_MODE = null;

export default {
  name: "TransitionPage",
  data() {
    return {
      prevHeight: 0,
      transitionName: DEFAULT_TRANSITION,
      transitionMode: DEFAULT_TRANSITION_MODE,
      transitionEnterActiveClass: ""
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      let transitionName =
        to.meta.transitionName ||
        from.meta.transitionName ||
        DEFAULT_TRANSITION;

      if (transitionName === "slideX") {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        transitionName = toDepth < fromDepth ? "slide-left" : "slide-right";
      }

      if (transitionName === "slideY") {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        transitionName = toDepth < fromDepth ? "slide-top" : "slide-bottom";
      }

      this.transitionMode = DEFAULT_TRANSITION_MODE;
      this.transitionEnterActiveClass = `${transitionName}-enter-active`;

      if (to.meta.transitionName === "zoom") {
        this.transitionMode = "in-out";
        this.transitionEnterActiveClass = "zoom-enter-active";
        document.body.style.overflow = "hidden";
      }

      if (from.meta.transitionName === "zoom") {
        this.transitionMode = null;
        this.transitionEnterActiveClass = null;
        document.body.style.overflow = null;
      }

      this.transitionName = transitionName;

      next();
    });
  },
  methods: {
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = "auto";
    }
  }
};
</script>

<style lang="stylus">
.fade-enter-active,
.fade-leave-active
  transition-duration: 0.3s;
  transition-property: height, opacity;
  transition-timing-function: ease;
  overflow: hidden;

.fade-enter,
.fade-leave-active
  opacity: 0

// .slide-left-enter-active,
// .slide-left-leave-active,
// .slide-right-enter-active,
// .slide-right-leave-active
//   transition-duration 0.5s
//   transition-property height opacity transform
//   transition-timing-function cubic-bezier(0.55, 0, 0.1, 1)
//   overflow hidden

// .slide-left-enter,
// .slide-right-leave-active
//   opacity 0
//   transform translate(100%, 0)

// .slide-left-leave-active,
// .slide-right-enter
//   transform translate(100%, 0)

.slide-bottom-enter-active
  animation: slideTopBottom .5s cubic-bezier(0.55, 0, 1, 1)
.slide-bottom-leave-active
  animation: slideBottomTop .3s cubic-bezier(0.55, 0, 1, 1)

.slide-right-enter-active
  animation: slideLeftRight .5s cubic-bezier(0.55, 0, 1, 1)
.slide-right-leave-active
  animation: slideRightLeft .3s cubic-bezier(0.55, 0, 1, 1)
.slide-left-leave-active
  animation: slideRightLeft .3s cubic-bezier(0.55, 0, 1, 1)
.slide-left-enter-active
  animation: slideLeftRight .5s cubic-bezier(0.55, 0, 1, 1)

.zoom-enter-active,
.zoom-leave-active
  animation-duration 0.5s
  animation-fill-mode both
  animation-name zoom

.zoom-leave-active
  animation-direction reverse

@keyframes zoom
  from
    opacity 0
    transform scale3d(0.3, 0.3, 0.3)

  100%
    opacity 1

@keyframes slideBottomTop
  from
    opacity 1
    transform translateY(0)
  to
    opacity 0
    transform translateY(100%)

@keyframes slideTopBottom
  from
    opacity 0
    transform translateY(50%)
  to
    opacity 1
    transform translateY(0)

@keyframes slideRightLeft
  from
    opacity 1
    transform translateX(0)
  to
    opacity 0
    transform translateX(50%)

@keyframes slideLeftRight
  from
    opacity 0
    transform translateX(100%)
  to
    opacity 1
    transform translateX(0)

</style>
