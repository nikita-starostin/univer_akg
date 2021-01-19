import React, { useEffect } from 'react';
import * as THREE from 'three';

function getPrism() {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2, 2);
    shape.lineTo(2, 4);
    shape.lineTo(0, 0);

    const extrudeSettings = {
        steps: 1,
        amount: 2,
        bevelEnabled: false,
    };

    const prismGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const prismMaterial = new THREE.MeshLambertMaterial({color: 0xff3300});
    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    return prism;
}

function oldInit() {
    /*environment begin*/
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1.4, .1, 500);
    camera.position.x = 20;
    camera.position.y = 20;
    camera.position.z = 20;
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('black', 1);
    renderer.setSize(500, 500);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    const prism = getPrism();
    prism.position.x = 2.5;
    prism.position.y = 1.5;
    prism.position.z = 2.5;
    prism.castShadow = true;
    scene.add(prism);

    const planeGeometry = new THREE.PlaneGeometry(20, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -.5 * Math.PI;
    plane.receiveShadow = true;

    const triangleGeometry = new THREE.Geometry();
    triangleGeometry.vertices.push(new THREE.Vector3(0, 0, 2));
    triangleGeometry.vertices.push(new THREE.Vector3(0, 2, 2));
    triangleGeometry.vertices.push(new THREE.Vector3(2, 0, 2));
    triangleGeometry.vertices.push(new THREE.Vector3(0, 0, 2));
    const triangleLine = new THREE.Line(
        triangleGeometry,
        new THREE.LineBasicMaterial({color: 0x00ff00})
    );
    triangleLine.position.x = 5;
    triangleLine.position.y = 5.5;
    triangleLine.position.z = 5;
    triangleLine.rotateOnWorldAxis(new THREE.Vector3(1, 1, 1), .5 * Math.PI);
    scene.add(triangleLine);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.castShadow = true;
    spotLight.position.set(15, 30, 60);
    scene.add(spotLight);

    let direction = true;
    const render = function () {
        requestAnimationFrame(render);
        // triangleLine.rotation.y += 0.1;
        if (triangleLine.position.x < -2) {
            direction = false;
        } else if (triangleLine.position.x > 6) {
            direction = true;
        }
        if (direction) {
            triangleLine.position.x -= 0.1;
            triangleLine.position.y -= 0.1;
        } else {
            triangleLine.position.x += 0.1;
            triangleLine.position.y += 0.1;
        }
        renderer.render(scene, camera);
    };

    document.querySelector('#threejs')!.appendChild(renderer.domElement);
    render();
    return () => renderer.domElement.remove();
}

export default function Kr2_3d(): React.ReactElement {
    useEffect(() => {
        return oldInit();
    }, []);
    return <>
        <h1>
            Контрольная работа 2. Построение проекции трёхмерной сцены. Вариант 13.
        </h1>
        <h2>Задание</h2>
        <p>
            Построить в 3Д треугольник, который анимируясь пересекает призму. Параметры анимации задаются вариантом:
            <ul>
                <li>Вид проекции диметрия</li>
                <li>Параметры проекции: угол а = 30 градусов - угол между Ох и Оу, угол b не используетяс</li>
                <li>
                    3х угольная призма
                </li>
                <li>
                    Тип анимации - перемещение по наклонной линии
                </li>
            </ul>
        </p>
        <h3>Реализация</h3>
        <div id='threejs'
             style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

        </div>
    </>
}
