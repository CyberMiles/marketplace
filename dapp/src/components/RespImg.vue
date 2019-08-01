<template>
  <div>
    <img v-bind:srcset="srcset" v-bind:src="newSrc" v-bind:alt="alt" />
    <div v-if="src == undefined" class="prePic"></div>
  </div>
</template>

<script>
export default {
  props: ["src", "alt"],
  computed: {
    srcset() {
      return `${this.newSrc}, ${this.newSrc} 2x`;
    },
    minHeight() {
      return (window.innerWidth - 15) / 2; //px
    }
  },
  data() {
    return {
      newSrc: this.src
    };
  },
  created() {
    if (
      this.src !== undefined &&
      this.src.slice(0, 27) == "https://res.cloudinary.com/"
    ) {
      this.newSrc = this.src
        .split("upload/")
        .join("upload/w_"+window.innerWidth*2+",h_"+window.innerWidth*2+",c_scale/");
    }
  },
  watch: {
    src: function() {
      console.log(window.innerWidth*2)
      if (this.src.slice(0, 27) == "https://res.cloudinary.com/") {
        this.newSrc = this.src
          .split("upload/")
          .join("upload/w_"+window.innerWidth*2+",h_"+window.innerWidth*2+",c_scale/");
      }
    }
  }
};
</script>

<style lang="stylus">
img
  display block
  max-width 100%
.prePic
  background #f2f2f2
  width 200px
</style>
