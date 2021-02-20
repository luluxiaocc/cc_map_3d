import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"

// 我自己写个dom也一样, 差别是无法随着经纬度移动


function tag() {
    var div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.width = '200px';
    div.style.height = '100px';
    div.style.background = 'rgba(10,18,51,0.8)';
    div.style.color = '#fff'
    div.textContent = '中文'
    div.className = 'label'
    // 可以设置位置属性了, 因为他是模型
    const label = new CSS2DObject(div);
    label.position.set(50, 1, 0)
    return label;
}

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(800, 700);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = 0;
labelRenderer.domElement.style.left = 0;
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement)

export { tag, labelRenderer }