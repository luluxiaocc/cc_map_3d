<template>
  <div class="map" ref="map"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  name: "ccMap3d",
  props: {
    msg: String,
  },
  data() {
    return {
      mapDom: null,
      renderer: null,
      camera: null,
      scene: null,
      orbitControls: null,
      axisHelperz: null,
      object: new THREE.Object3D(),
      textureLoader: new THREE.TextureLoader(),
    };
  },
  methods: {
    initBg() {
      const texture = this.textureLoader.load(
        require("../assets/images/ball.jpg")
      );
      const sphereGeometry = new THREE.SphereGeometry(2000, 50, 50);
      sphereGeometry.scale(-1, 1, 1);
      const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(sphere);
    },
    initAxisHelper() {
      this.axisHelper = new THREE.AxisHelper(260);
      this.object.add(this.axisHelper);
      this.scene.add(this.object);
    },
    initLight() {
      const ambientLight = new THREE.AmbientLight("white");
      this.scene.add(ambientLight);
    },
    initOrbitControls() {
      const orbitControls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      orbitControls.target = new THREE.Vector3(0, 0, 0); //控制焦点
      orbitControls.autoRotate = false; //将自动旋转关闭
      orbitControls.enablePan = false; // 不禁止鼠标平移, 可以用键盘来平移
      orbitControls.maxDistance = 1000; // 最大外移动
      orbitControls.minDistance = 100; // 向内
      this.orbitControls = orbitControls;
    },
    initSprite() {
      var R = 80; //地球半径
      var texture = this.textureLoader.load(
        require("../assets/images/sprite-bg.png")
      );
      var spriteMaterial = new THREE.SpriteMaterial({
        map: texture, //设置精灵纹理贴图
        transparent: true, //开启透明
        opacity: 0.5, //可以通过透明度整体调节光圈
      });
      // 创建表示地球光圈的精灵模型
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(R * 3.0, R * 3.0, 1); //适当缩放精灵
      this.scene.add(sprite);
    },
    initEarthBg() {
      const texture = this.textureLoader.load(
        require("../assets/images/earth-bg.png")
      );
      // 传入地球半径
      const geometry = new THREE.SphereBufferGeometry(80, 40, 40);
      const material = new THREE.MeshLambertMaterial({
        map: texture,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.object.add(mesh);
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.mapDom.clientWidth / this.mapDom.clientHeight,
        1,
        20000
      );
      this.camera.position.z = 300;
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(0, 0, 0);
    },
    initTHREE() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.mapDom = this.$refs.map;
      this.renderer.setSize(this.mapDom.clientWidth, this.mapDom.clientHeight);
      this.renderer.setClearColor(0xffffff, 1.0); // config
      this.mapDom.appendChild(this.renderer.domElement);
    },
    glRender() {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.glRender);
    },
  },
  mounted() {
    this.initTHREE();
    this.initCamera();
    this.initScene();
    this.initOrbitControls();
    this.initEarthBg();
    this.initLight();
    this.initSprite();
    this.initBg();
    this.initAxisHelper();
    this.glRender();
  },
};
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
