<template>
  <div>
    <img v-bind:srcset="srcset" v-bind:src="newSrc" v-bind:alt="alt" />
    <div v-if="src == undefined" class="prePic"></div>
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
      newSrc2x: this.src
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
          this.newSrc = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                Math.round(window.innerWidth / this.division) +
                ",h_" +
                Math.round(window.innerWidth / this.division) +
                ",c_fill/"
            );
          this.newSrc2x = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                Math.round(window.innerWidth / this.division) * 2 +
                ",h_" +
                Math.round(window.innerWidth / this.division) * 2 +
                ",c_fill/"
            );
        } else {
          this.newSrc = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                window.innerWidth +
                ",h_" +
                window.innerWidth +
                ",c_fill/"
            );
          this.newSrc2x = this.src
            .split("upload/")
            .join(
              "upload/w_" +
                window.innerWidth * 2 +
                ",h_" +
                window.innerWidth * 2 +
                ",c_fill/"
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
  width 200px
</style>
