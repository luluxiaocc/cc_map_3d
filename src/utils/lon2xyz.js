// 经纬度转坐标
function lon2xyz(R, longitude, latitude) {
    let lon = longitude * Math.PI / 180;//转弧度值
    let lat = latitude * Math.PI / 180;//转弧度值
    lon = -lon;// three.js坐标系z坐标轴对应经度-90度，而不是90度

    // 经纬度坐标转球面坐标计算公式
    let x = R * Math.cos(lat) * Math.cos(lon);
    let y = R * Math.sin(lat);
    let z = R * Math.cos(lat) * Math.sin(lon);
    // 返回球面坐标
    return {
        x: x,
        y: y,
        z: z,
    };
}
export default lon2xyz;