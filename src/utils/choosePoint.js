/* eslint-disable */
import * as THREE from 'three';

function choosePoint(camera, chooseMeshArr = [], dom = document.body, handleClick, handleMousemove) {
    camera = camera;
    chooseMeshArr = chooseMeshArr || [];
    if (handleClick) {
        let timer = null;
        let pointerdownTime = true;
        dom.addEventListener('pointerdown', function () {
            pointerdownTime = true;
            timer = setInterval(() => {
                pointerdownTime = false;
            }, 80);
        });
        dom.addEventListener('pointerup', function (e) {
            clearInterval(timer)
            if (pointerdownTime) choosePointMesh(e, handleClick)
            pointerdownTime = true
        });
    }
    if (handleMousemove) {
        dom.addEventListener('mousemove', function (e) {
            choosePointMesh(e, handleMousemove)
        });
    }

    function choosePointMesh(event, fn) {
        let Sx = event.clientX - dom.getBoundingClientRect().left;
        let Sy = event.clientY - dom.getBoundingClientRect().top;
        // 左上角转中心
        let x = (Sx / dom.offsetWidth) * 2 - 1;
        let y = -(Sy / dom.offsetHeight) * 2 + 1;
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        let intersects = raycaster.intersectObjects(chooseMeshArr);
        if (intersects.length > 0) {
            fn(intersects[0].object, event)
        }
    }
}

export default choosePoint;