import config from '../config/earth.config'
var R = config.r;//地球半径
// 引入three.js
import * as THREE from 'three'
import lon2xyz from './lon2xyz';

/**输入地球上任意两点的经纬度坐标，通过函数flyArc可以绘制一个飞线圆弧轨迹
 * lon1,lat1:轨迹线起点经纬度坐标
 * lon2,lat2：轨迹线结束点经纬度坐标
*/
function flyArc(lon1, lat1, lon2, lat2) {
  var sphereCoord1 = lon2xyz(R, lon1, lat1);//经纬度坐标转球面坐标
  // startSphereCoord：轨迹线起点球面坐标
  var startSphereCoord = new THREE.Vector3(sphereCoord1.x, sphereCoord1.y, sphereCoord1.z);
  var sphereCoord2 = lon2xyz(R, lon2, lat2);
  // startSphereCoord：轨迹线结束点球面坐标
  var endSphereCoord = new THREE.Vector3(sphereCoord2.x, sphereCoord2.y, sphereCoord2.z);

  //计算绘制圆弧需要的关于y轴对称的起点、结束点和旋转四元数
  var startEndQua = _3Dto2D(startSphereCoord, endSphereCoord)
  // 调用arcXOY函数绘制一条圆弧飞线轨迹
  var arcline = arcXOY(startEndQua.startPoint, startEndQua.endPoint);
  arcline.quaternion.multiply(startEndQua.quaternion)

  return arcline;
}
/*把3D球面上任意的两个飞线起点和结束点绕球心旋转到到XOY平面上，
 同时保持关于y轴对称，借助旋转得到的新起点和新结束点绘制
一个圆弧，最后把绘制的圆弧反向旋转到原来的起点和结束点即
可*/
function _3Dto2D(startSphere, endSphere) {
  /*计算第一次旋转的四元数：表示从一个平面如何旋转到另一个平面*/
  var origin = new THREE.Vector3(0, 0, 0);//球心坐标
  var startDir = startSphere.clone().sub(origin);//飞线起点与球心构成方向向量
  var endDir = endSphere.clone().sub(origin);//飞线结束点与球心构成方向向量
  // dir1和dir2构成一个三角形，.cross()叉乘计算该三角形法线normal
  var normal = startDir.clone().cross(endDir).normalize();
  var xoyNormal = new THREE.Vector3(0, 0, 1);//XOY平面的法线
  //.setFromUnitVectors()计算从normal向量旋转达到xoyNormal向量所需要的四元数
  // quaternion表示把球面飞线旋转到XOY平面上需要的四元数
  var quaternion3D_XOY = new THREE.Quaternion().setFromUnitVectors(normal, xoyNormal);
  /*第一次旋转：飞线起点、结束点从3D空间第一次旋转到XOY平面*/
  var startSphereXOY = startSphere.clone().applyQuaternion(quaternion3D_XOY);
  var endSphereXOY = endSphere.clone().applyQuaternion(quaternion3D_XOY);

  /*计算第二次旋转的四元数*/
  // middleV3：startSphereXOY和endSphereXOY的中点
  var middleV3 = startSphereXOY.clone().add(endSphereXOY).multiplyScalar(0.5);
  var midDir = middleV3.clone().sub(origin).normalize();// 旋转前向量midDir，中点middleV3和球心构成的方向向量
  var yDir = new THREE.Vector3(0, 1, 0);// 旋转后向量yDir，即y轴
  // .setFromUnitVectors()计算从midDir向量旋转达到yDir向量所需要的四元数
  // quaternion2表示让第一次旋转到XOY平面的起点和结束点关于y轴对称需要的四元数
  var quaternionXOY_Y = new THREE.Quaternion().setFromUnitVectors(midDir, yDir);

  /*第二次旋转：使旋转到XOY平面的点再次旋转，实现关于Y轴对称*/
  var startSpherXOY_Y = startSphereXOY.clone().applyQuaternion(quaternionXOY_Y);
  var endSphereXOY_Y = endSphereXOY.clone().applyQuaternion(quaternionXOY_Y);

  /**一个四元数表示一个旋转过程
  *.invert()方法表示四元数的逆，简单说就是把旋转过程倒过来
  * 两次旋转的四元数执行.invert()求逆，然后执行.multiply()相乘
  *新版本.invert()对应旧版本.invert()
  */
  var quaternionInverse = quaternion3D_XOY.clone().invert().multiply(quaternionXOY_Y.clone().invert())


  return {
    // 返回两次旋转四元数的逆四元数
    quaternion: quaternionInverse,
    // 范围两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
    startPoint: startSpherXOY_Y,
    endPoint: endSphereXOY_Y,
  }
}
/*通过函数arcXOY()可以在XOY平面上绘制一个关于y轴对称的圆弧曲线
startPoint, endPoint：表示圆弧曲线的起点和结束点坐标值，起点和结束点关于y轴对称*/
function arcXOY(startPoint, endPoint) {
  // 计算两点的中点
  var middleV3 = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
  // 弦垂线的方向dir(弦的中点和圆心构成的向量)
  var dir = middleV3.clone().normalize()
  // 计算球面飞线的起点、结束点和球心构成夹角的弧度值
  var earthRadianAngle = radianAOB(startPoint, endPoint, new THREE.Vector3(0, 0, 0))
  /*设置飞线轨迹圆弧的中间点坐标
  弧度值 * R * 0.2：表示飞线轨迹圆弧顶部距离地球球面的距离
  起点、结束点相聚越远，构成的弧线顶部距离球面越高*/
  var arcTopCoord = dir.multiplyScalar(R + earthRadianAngle * R * 0.2)
  //求三个点的外接圆圆心(飞线圆弧轨迹的圆心坐标)
  var flyArcCenter = threePointCenter(startPoint, endPoint, arcTopCoord)
  // 飞线圆弧轨迹半径flyArcR
  var flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y);
  /*坐标原点和飞线起点构成直线和y轴负半轴夹角弧度值
  参数分别是：飞线圆弧起点、y轴负半轴上一点、飞线圆弧圆心*/
  var flyRadianAngle = radianAOB(startPoint, new THREE.Vector3(0, -1, 0), flyArcCenter);
  var startAngle = -Math.PI / 2 + flyRadianAngle;//飞线圆弧开始角度
  var endAngle = Math.PI - startAngle;//飞线圆弧结束角度
  // 调用圆弧线模型的绘制函数
  var arcline = circleLine(flyArcCenter.x, flyArcCenter.y, flyArcR, startAngle, endAngle)
  arcline.center = flyArcCenter;//飞线圆弧自定一个属性表示飞线圆弧的圆心
  arcline.topCoord = arcTopCoord;//飞线圆弧自定一个属性表示飞线圆弧中间也就是顶部坐
  return arcline
}
/*计算球面上两点和球心构成夹角的弧度值
参数point1, point2:表示地球球面上两点坐标Vector3
计算A、B两点和顶点O构成的AOB夹角弧度值*/
function radianAOB(A, B, O) {
  // dir1、dir2：球面上两个点和球心构成的方向向量
  var dir1 = A.clone().sub(O).normalize();
  var dir2 = B.clone().sub(O).normalize();
  //点乘.dot()计算夹角余弦值
  var cosAngle = dir1.clone().dot(dir2);
  var radianAngle = Math.acos(cosAngle);//余弦值转夹角弧度值,通过余弦值可以计算夹角范围是0~180度
  return radianAngle
}
/*绘制一条圆弧曲线模型Line
5个参数含义：(圆心横坐标, 圆心纵坐标, 飞线圆弧轨迹半径, 开始角度, 结束角度)*/
function circleLine(x, y, r, startAngle, endAngle) {
  var geometry = new THREE.BoxGeometry(); //声明一个几何体对象Geometry
  // THREE.ArcCurve创建圆弧曲线
  var arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false);
  //getSpacedPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
  var points = arc.getSpacedPoints(50); //分段数50，返回51个顶点
  geometry.setFromPoints(points);// setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
  var material = new THREE.LineBasicMaterial({ color: 0x00ffff, });//线条材质
  var line = new THREE.Line(geometry, material);//线条模型对象
  return line;
}
//求三个点的外接圆圆心，p1, p2, p3表示三个点的坐标Vector3。
function threePointCenter(p1, p2, p3) {
  var L1 = p1.lengthSq();//p1到坐标原点距离的平方
  var L2 = p2.lengthSq();
  var L3 = p3.lengthSq();
  var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y, x3 = p3.x, y3 = p3.y;
  var S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2;
  var x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2;
  var y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2;
  // 三点外接圆圆心坐标
  var center = new THREE.Vector3(x, y, 0);
  return center
}


export { arcXOY, flyArc }