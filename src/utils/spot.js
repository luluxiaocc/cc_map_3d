import * as THREE from "three";
import earthConfig from '../config/earth.config';
import lon2xyz from './lon2xyz';

var geometry = new THREE.PlaneBufferGeometry(1, 1);
var textureLoader = new THREE.TextureLoader();

// 用户可以自定义图片, 让我加载打点
var texture = textureLoader.load(require('../assets/images/mark.png'));

export default function spot(lon, lat) {
    var R = earthConfig.r
    var material = new THREE.MeshBasicMaterial({
        // color: color || 0x22ff99,
        map: texture,
        transparent: true,
    });

    var mesh = new THREE.Mesh(geometry, material);
    // 经纬度转球面坐标
    var coord = lon2xyz(R * 1.01, lon, lat)
    var size = R * 0.05;//矩形平面Mesh的尺寸
    mesh.scale.set(size, size, size);//设置mesh大小
    mesh.position.set(coord.x, coord.y, coord.z);//设置mesh位置

    // mesh姿态设置
    // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
    // 也就是要在球面上行平行显示
    // 下面的写法 可以直接求出球面坐标
    var coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();
    // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    var meshNormal = new THREE.Vector3(0, 0, 1);
    // 四元数属性.quaternion表示mesh的角度状态
    //.setFromUnitVectors();计算两个向量之间构成的四元数值

    // 原理就是旋转前的位置, 与旋转后的位置传进来, 求出需要旋转的角度
    mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

    return mesh;
}