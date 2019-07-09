<template>
  <img v-bind:srcset="srcset" v-bind:src="src" v-bind:alt="alt" />
</template>

<script>
export default {
  props: ["src", "alt"],
  computed: {
    srcset() {
      return `${this.src}, ${this.src} 2x`;
    }
  }
};
</script>
