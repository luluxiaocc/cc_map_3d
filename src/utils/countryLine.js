import * as THREE from 'three';
import lon2xyz from './lon2xyz'
function countryLine(R, polygonArr) {
  let group = new THREE.Group();
  polygonArr.forEach(polygon => {
    let pointArr = [];
    polygon[0].forEach(elem => {
      let coord = lon2xyz(R, elem[0], elem[1])
      pointArr.push(coord.x, coord.y, coord.z);
    });
    group.add(line(pointArr));
  });
  return group;
}
function line(pointArr) {
  let geometry = new THREE.BufferGeometry();
  let vertices = new Float32Array(pointArr);
  let attribue = new THREE.BufferAttribute(vertices, 3);
  geometry.attributes.position = attribue;
  let material = new THREE.LineBasicMaterial({
    color: 0x00aaaa //线条颜色
  });
  let line = new THREE.LineLoop(geometry, material);
  return line;
}



export default countryLine;