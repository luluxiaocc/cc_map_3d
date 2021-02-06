import { pointInPolygon } from './pointInPolygon.js'//判断点是否在多边形中

// polygon:一个表示平面多边形轮廓的数组  菽粟元素结构[x,y](x,y表示经纬度)
function gridPoint(polygon) {
  var lonArr = [];//polygon的所有经度坐标
  var latArr = [];//polygon的所有纬度坐标
  polygon.forEach(elem => {
    lonArr.push(elem[0])
    latArr.push(elem[1])
  });
  // minMax()计算polygon所有经纬度返回的极大值、极小值
  var [lonMin, lonMax] = minMax(lonArr);
  var [latMin, latMax] = minMax(latArr);
  // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
  //  设置均匀填充点的间距
  var 间隔 = 3; //polygon轮廓内填充顶点的经纬度间隔距离，选择一个合适的值，太小，计算量大，太大，国家球面不够光滑
  var 行 = Math.ceil((lonMax - lonMin) / 间隔);//经度方向填充多少行的顶点
  var 列 = Math.ceil((latMax - latMin) / 间隔)//纬度方向填充多少列的顶点
  var rectPointsArr = [];//polygon对应的矩形轮廓内生成均匀间隔的矩形网格数据rectPointsArr
  for (var i = 0; i < 行 + 1; i++) {
    for (var j = 0; j < 列 + 1; j++) {
      //两层for循环在矩形范围内批量生成等间距的网格顶点数据
      rectPointsArr.push([lonMin + i * 间隔, latMin + j * 间隔])
    }
  }
  // 处理矩形网格顶点数据rectPointsArr，仅仅保留多边形轮廓polygon内的顶点数据
  var polygonPointsArr = [];//polygon轮廓内的网格顶点数据
  rectPointsArr.forEach(function (coord) {//coord:点经纬度坐标
    if (pointInPolygon(coord, polygon)) {//判断点coord是否位于多边形中
      polygonPointsArr.push(coord)
    }
  })
  //polygon：多边形轮廓边界顶点数据
  // polygonPointsArr：polygon内部的等间距顶点数据
  // 多边形polygon边界坐标和polygon内等间距顶点坐标合并返回
  return [...polygon, ...polygonPointsArr];
}

//   经纬度坐标进行排序
function minMax(arr) {
  // 数组元素排序
  arr.sort(compareNum);
  // 通过向两侧取整，把经纬度的方位稍微扩大
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])]
}
// 数组排序规则
function compareNum(num1, num2) {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  } else {
    return 0;
  }
}


export { gridPoint };