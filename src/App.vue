<template>
  <div id="app">
    <ccMap3d id="map"></ccMap3d>
  </div>
</template>

<script>
import ccMap3d from "./components/ccMap3d.vue";

export default {
  name: "App",
  components: {
    ccMap3d,
  },
};
</script>

<style lang="scss">
#map {
  width: 1000px;
  height: 700px;
  margin: 0 auto;
}
</style>
