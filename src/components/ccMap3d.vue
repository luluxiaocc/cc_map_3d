<template>
  <div class="map" ref="map"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import earthConfig from "../config/earth.config";
import envConifg from "../config/env.config";
import countryLine from "../utils/countryLine";
import countryMesh from "../utils/countryMesh";
import choosePoint from "../utils/choosePoint";
import worldGeo from "../config/world.geo.js";
import countryNameObj from "../config/country.name";
import { tag, labelRenderer } from "../utils/css2DObject";

export default {
  name: "ccMap3d",
  props: {
    msg: String,
    handleClick: Function,
    handleMousemove: Function,
  },
  data() {
    return {
      lab: null,
      mapDom: null,
      renderer: null,
      camera: null,
      scene: null,
      orbitControls: null,
      axisHelper: new THREE.AxisHelper(260),
      object: new THREE.Object3D(),
      textureLoader: new THREE.TextureLoader(),
    };
  },
  methods: {
    initBg() {
      const texture = this.textureLoader.load(envConifg.bg);
      const sphereGeometry = new THREE.SphereGeometry(1000, 50, 50);
      sphereGeometry.scale(-1, 1, 1);
      const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(this.sphere);
      this.scene.add(this.object);
    },
    initAxisHelper() {
      this.object.add(this.axisHelper);
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
      const texture = this.textureLoader.load(earthConfig.spriteBg);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.5,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(earthConfig.r * 3.0, earthConfig.r * 3.0, 1);
      this.scene.add(sprite);
    },
    // 绘制地球
    initEarth() {
      const R = earthConfig.r;
      var earthGroup = new THREE.Group();
      worldGeo.features.forEach((country) => {
        // 单一轮廓
        if (country.geometry.type === "Polygon") {
          country.geometry.coordinates = [country.geometry.coordinates];
        }
        var line = countryLine(R * 1.002, country.geometry.coordinates);
        var mesh = countryMesh(
          R * 1.001,
          country.geometry.coordinates,
          countryNameObj[country.id]
        );
        earthGroup.add(line);
        earthGroup.add(mesh);
      });
      // 这个要加入进来, 要不然地球会出现穿透选中的现象
      earthGroup.add(this.initEarthBg());
      this.scene.add(earthGroup);
      // 绑定事件
      choosePoint(
        this.camera,
        earthGroup.children,
        this.renderer.domElement,
        this.handleClick,
        this.handleMousemove
      );
    },
    initEarthBg() {
      const texture = this.textureLoader.load(earthConfig.earthBg);
      // 传入地球半径
      const geometry = new THREE.SphereBufferGeometry(earthConfig.r, 40, 40);
      const material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
      });
      return new THREE.Mesh(geometry, material);
      // this.object.add(mesh);
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.mapDom.clientWidth / this.mapDom.clientHeight,
        1,
        2000
      );
      this.camera.position.z = -300;
      this.camera.position.y = 140;
      this.camera.position.x = -80;
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(0, 0, 0);
    },
    initTHREE() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.mapDom = this.$refs.map;
      this.renderer.setSize(this.mapDom.clientWidth, this.mapDom.clientHeight);
      this.renderer.setClearColor(envConifg.color, 1.0);
      this.mapDom.appendChild(this.renderer.domElement);
    },
    initPopup() {
      // 没法让他在背面的时候隐藏
      const tag1 = tag();
      this.scene.add(tag1);
      tag1.element.innerHTML = "说明文字";
      // 出现
      // tag1.element.style.visibility = "visible";
    },
    glRender() {
      labelRenderer.render(this.scene, this.camera);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.glRender);
    },
  },
  mounted() {
    this.initTHREE();
    this.initCamera();
    this.initScene();
    this.initOrbitControls();
    // this.initEarthBg();
    this.initEarth();
    this.initLight();
    this.initSprite();
    this.initBg();
    this.initAxisHelper();
    this.initPopup();
    this.glRender();
  },
};
</script>

<style scoped lang="scss">
.map {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
