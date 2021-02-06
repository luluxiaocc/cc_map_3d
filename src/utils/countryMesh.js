import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import lon2xyz from './lon2xyz'
import { gridPoint } from './gridPoint.js'
import { delaunay } from './delaunay.js'

function countryMesh(R, polygonArr, name) {
  var geometryArr = [];
  polygonArr.forEach(obj => {
    var polygon = obj[0];
    var pointsArr = gridPoint(polygon);
    // 三角剖分生成顶点坐标对应三角形索引
    var trianglesIndexArr = delaunay(pointsArr, polygon)
    var spherePointsArr = [];//所有三角形球面坐标
    // 这里封装成utils的方法
    pointsArr.forEach((item) => {
      var pos = lon2xyz(R, item[0], item[1])
      spherePointsArr.push(pos.x, pos.y, pos.z)
    });
    var geometry = new THREE.BufferGeometry();
    // 设置几何体顶点索引
    geometry.index = new THREE.BufferAttribute(new Uint16Array(trianglesIndexArr), 1)
    // 设置几何体顶点位置坐标
    geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(spherePointsArr), 3)
    geometryArr.push(geometry);//geometryArr：一个国家多个轮廓，每个轮廓对应的所有几何体
  });
  // 合并几何体
  var newGeometry = null;
  if (geometryArr.length == 1) {
    newGeometry = geometryArr[0];
  } else {
    newGeometry = BufferGeometryUtils.mergeBufferGeometries(geometryArr);
  }
  newGeometry.computeVertexNormals();//如果使用受光照影响材质，需要计算生成法线
  // 版图的颜色
  var material = new THREE.MeshLambertMaterial({
    color: 0x002222,
    side: THREE.DoubleSide
  })
  var mesh = new THREE.Mesh(newGeometry, material)
  mesh.countryName = name;
  return mesh
}
export default countryMesh;