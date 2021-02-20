<template>
  <div id="app">
    <ccMap3d
      id="map"
      :handleMousemove="handleMousemove"
      :handleClick="handleClick"
    ></ccMap3d>
  </div>
</template>

<script>
import ccMap3d from "./components/ccMap3d.vue";

export default {
  name: "App",
  components: {
    ccMap3d,
  },
  methods: {
    handleMousemove() {
      // obj.material.color.set(0xff0000);
      // console.log("移动:", obj.countryName);
    },
    handleClick(obj) {
      // obj.material.color.set(0xff0000);
      console.log("点击:", obj.countryName);
    },
  },
};
</script>

<style lang="scss">
#map {
  width: 800px;
  height: 700px;
  margin: 0 auto;
}
</style>
