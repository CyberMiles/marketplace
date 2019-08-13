<template>
  <div>
    <img
      v-bind:srcset="srcset"
      v-bind:src="newSrc"
      v-bind:alt="alt"
      @load="Loaded = true"
      v-show="Loaded"
    />
    <div class="prePic" v-if="!Loaded">
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
      newSrcLowQ: "",
      Loaded: false
    };
  },
  created() {
    this.refactorSrc();
  },
  watch: {
    src: function() {
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
      }
    }
  }
};
</script>

<style lang="stylus">
img
  display block
  max-width 100%
  object-fit cover
.prePic
  background #f2f2f2
</style>
