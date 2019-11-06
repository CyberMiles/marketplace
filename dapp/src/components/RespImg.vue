<template>
  <div class="wrapper">
    <transition :name="transition">
      <img
        v-bind:srcset="srcset"
        v-bind:src="newSrc"
        v-bind:alt="alt"
        @load="Loaded = true"
        v-show="Loaded"
        :key="newSrc"
      />
    </transition>
    <div class="prePic" v-if="!Loaded && newSrcLowQ != null">
      <img v-bind:src="newSrcLowQ" v-bind:alt="alt" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["src", "alt", "division"],
  computed: {
    srcset() {
      return `${this.newSrc}, ${this.newSrc2x} 2x`;
    }
  },
  data() {
    return {
      newSrc: this.src,
      newSrc2x: this.src,
      newSrcLowQ: null,
      Loaded: false,
      transition: ""
    };
  },
  created() {
    this.refactorSrc();
  },
  watch: {
    src: function(newVal, oldVal) {
      if (oldVal !== null && oldVal !== "") {
        this.transition = "fade";
      } else {
        this.transition = "";
      }
      this.refactorSrc();
    }
  },
  methods: {
    refactorSrc() {
      if (
        this.src !== undefined &&
        this.src.slice(0, 27) == "https://res.cloudinary.com/"
      ) {
        if (this.division !== undefined) {
          this.newSrcLowQ = this.src
            .split("upload/")
            .join(
              "upload/q_10/w_" +
                Math.round(window.innerWidth / this.division) +
                ",h_" +
                Math.round(window.innerWidth / this.division) +
                ",c_fill,f_auto/"
            );
          this.newSrc = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                Math.round(window.innerWidth / this.division) +
                ",h_" +
                Math.round(window.innerWidth / this.division) +
                ",c_fill,f_auto/"
            );
          this.newSrc2x = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                Math.round(window.innerWidth / this.division) * 2 +
                ",h_" +
                Math.round(window.innerWidth / this.division) * 2 +
                ",c_fill,f_auto/"
            );
        } else {
          this.newSrcLowQ = this.src
            .split("upload/")
            .join(
              "upload/q_10/w_" +
                window.innerWidth +
                ",h_" +
                window.innerWidth +
                ",c_fill,f_auto/"
            );
          this.newSrc = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                window.innerWidth +
                ",h_" +
                window.innerWidth +
                ",c_fill,f_auto/"
            );
          this.newSrc2x = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                window.innerWidth * 2 +
                ",h_" +
                window.innerWidth * 2 +
                ",c_fill,f_auto/"
            );
        }
      } else if (this.src !== undefined) {
        this.newSrcLowQ = this.src;
        this.newSrc = this.src;
        this.newSrc2x = this.src;
      }
    }
  }
};
</script>

<style lang="stylus">
.wrapper
    background #f2f2f2
  img
    display block
    max-width 100%
    object-fit cover

.fade-enter-active {
  transition: opacity .3s ease-in-out;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter {
  opacity: 0;
}
</style>
