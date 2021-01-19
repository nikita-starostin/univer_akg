import React, { useEffect } from 'react';
import { GlobalCanvasContextProvider } from '../../../../utils/canvasContext';
import Ipr1Shape from '../components/ipr1Shape/Ipr1Shape';
import { ICrossState } from '../components/ipr1Shape/Ipr1Shape.models';

const cross = {
    x1: 100,
    y1: 150,
    width1: 150,
    height1: 50,
    x2: 150,
    y2: 100,
    width2: 50,
    height2: 150,
} as ICrossState;

function drawCross() {
    const context = GlobalCanvasContextProvider.getContext();
    context.fillStyle = `rgba(125, 125, 125, 255)`;
    const {x1, y1, width1, height1, x2, y2, width2, height2} = cross;
    context.fillRect(x1, y1, width1, height1);
    context.fillRect(x2, y2, width2, height2);
}

export default function Ipr2Clipping() {
    useEffect(() => {
        drawCross();
    }, []);
    return <>
        <h1>
            Индивидуальная практическа работа 2. Отсечение прямоугольным окном. Вариант 1.
        </h1>
        <h2>Задание</h2>
        <p>
            Продемонстрировать отсечение фигурой из варианта на фигуре полученной в результате ИПР 1.
        </p>
        <h3>Реализация</h3>
        <Ipr1Shape cross={cross}
                   onClear={drawCross}/>
    </>
}
