import React, { useEffect } from 'react';
import { GlobalCanvasContextProvider } from '../../../../utils/canvasContext';
import { drawLine, getKr1ShapeEdges } from '../../../../utils/draw.utils';
import Ipr1Shape from '../components/ipr1Shape/Ipr1Shape';
import { IKr1Shape } from '../components/ipr1Shape/Ipr1Shape.models';

const kr1Shape = {
    x: 100,
    y: 150,
    width: 100,
    height: 100,
} as IKr1Shape;

function drawKr1Shape() {
    const context = GlobalCanvasContextProvider.getContext();
    const triangles = getKr1ShapeEdges(kr1Shape);
    triangles.forEach(triangle => {
        context.beginPath();
        context.moveTo(triangle.edges[0][0].x, triangle.edges[0][0].y);
        triangle.edges.forEach(([point1, point2]) => {
            drawLine(point1, point2, [125, 125, 125, 255]);
            context.lineTo(point2.x, point2.y);
        })
        context.closePath();
        context.fillStyle = 'rgba(125, 125, 125, 255)';
        context.fill();
    })
}

export default function Ipr2Clipping() {
    useEffect(() => {
        drawKr1Shape();
    });
    return <>
        <h1>
            Контрольная работа 1. Отсечение непрямоугольным окном. Вариант 13.
        </h1>
        <h2>Задание</h2>
        <p>
            Продемонстрировать отсечение фигурой из варианта на фигуре полученной в результате ИПР 1.
        </p>
        <h3>Реализация</h3>
        <Ipr1Shape kr1Shape={kr1Shape}
                   onClear={drawKr1Shape}/>
    </>
}
