import Delaunator from './delaunator.js'//开源三角剖分库
import { pointInPolygon } from './pointInPolygon.js'//判断点在多边形

// polygon:一个平面多边形轮廓边界坐标
function delaunay(pointsArr, polygon) {
  //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  var indexArr = Delaunator.from(pointsArr).triangles;
  /**三角剖分获得的三角形索引indexArr需要进行二次处理，删除多边形polygon轮廓外面的三角形对应索引 */
  var usefulIndexArr = [];//二次处理后三角形索引，也就是保留多边形polygon内部三角形对应的索引
  // 删除多边形polygon外面三角形，判断方法非常简单，判断一个三角形的质心是否在多边形轮廓内部
  for (var i = 0; i < indexArr.length; i += 3) {
    // 三角形三个顶点坐标p1, p2, p3
    var p1 = pointsArr[indexArr[i]];
    var p2 = pointsArr[indexArr[i + 1]];
    var p3 = pointsArr[indexArr[i + 2]];
    // 三角形重心坐标计算
    var centralPoint = [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3];
    if (pointInPolygon(centralPoint, polygon)) {//pointInPolygon()函数判断三角形的重心是在多边形polygon内
      // 保留复合条件三角形对应的索引：indexArr[i], indexArr[i+1],indexArr[i+2]
      // usefulIndexArr.push(indexArr[i], indexArr[i+1],indexArr[i+2]);//这种情况需要设置three.js材质背面可见THREE.BackSide才能看到球面国家Mesh
      // 有一点需要注意，一个三角形索引逆时针和顺时针顺序对应three.js三角形法线方向相反，或者说Mesh正面、背面方向不同
      usefulIndexArr.push(indexArr[i + 2], indexArr[i + 1], indexArr[i]);
    }
  }
  return usefulIndexArr
}
export { delaunay };