<template>
  <img v-bind:srcset="srcset" v-bind:src="newSrc" v-bind:alt="alt" />
</template>

<script>
export default {
  props: ["src", "alt"],
  computed: {
    srcset() {
      return `${this.newSrc}, ${this.newSrc} 2x`;
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
