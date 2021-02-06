/* eslint-disable */
// point-in-polygon库(判断点是否在多边形内)
// github地址：https://github.com/substack/point-in-polygon

// 从点发出一条射线, 接触到偶数边界就是外部的点 
function pointInPolygon(point, vs) {
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];
    const intersect = ((yi > y) != (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};
export { pointInPolygon };