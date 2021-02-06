import * as THREE from 'three';

function choosePoint(camera, chooseMeshArr = [], dom = document.body) {
    // 数组里必须是mesh类型的才有效
    var chooseMesh = null
    function choosePointMesh(event) {
        var Sx = event.clientX - dom.getBoundingClientRect().left;
        var Sy = event.clientY - dom.getBoundingClientRect().top;
        // 左上角转中心
        var x = (Sx / dom.offsetWidth) * 2 - 1;
        var y = -(Sy / dom.offsetHeight) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        var intersects = raycaster.intersectObjects(chooseMeshArr);
        if (intersects.length > 0) {
            chooseMesh = intersects[0].object;
            console.log('选中模型是: ', intersects[0].object.countryName)
            chooseMesh.material.color.set(0xff0000);
        } else {
            chooseMesh = null;
        }
    }

    // addEventListener('mousemove', choosePointMesh);

    dom.addEventListener('click', function (event) {
        // 这里有bug, 需要封装一下
        choosePointMesh(event);//鼠标单击进行拾取计算
    });

}

export default choosePoint;