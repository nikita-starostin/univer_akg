import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { GlobalCanvasContextProvider } from '../../../../../utils/canvasContext';
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    clearCanvas,
    drawLine, drawLineKirusBack,
    drawLineSatherlandKoenInCross
} from '../../../../../utils/draw.utils';
import { ICrossState, IKr1Shape } from './Ipr1Shape.models';
import { useTrianglesStore } from './useTrianglesStore';

export default observer(function Ipr1Shape({onClear, cross, kr1Shape}: { onClear?: () => void; cross?: ICrossState; kr1Shape?: IKr1Shape }): React.ReactElement {
    const {current, moveAndResize} = useTrianglesStore();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [drawHistory, setDrawHistory] = useState(false);
    const [move, setMove] = useState(true);
    const [resize, setResize] = useState(true);
    const [updateFrequencyMs, setUpdateFrequencyMs] = useState(1000);
    const [stringUpdateFrequencyMs, setStringUpdateFrequencyMs] = useState('1000')
    useEffect(() => {
        GlobalCanvasContextProvider.setContext(canvasRef.current!.getContext("2d")!);
        const intervalId = setInterval(() => {
            moveAndResize(move, resize);
            if (!drawHistory) {
                clearCanvas();
                onClear && onClear();
            }
            for (let i = 0; i < current.points.length; ++i) {
                const endPointIndex = i + 1 === current.points.length ? 0 : i + 1;
                const point1 = current.points[i]
                const point2 = current.points[endPointIndex];
                if (cross != null) {
                    drawLineSatherlandKoenInCross(point1, point2, cross);
                } else if (kr1Shape != null) {
                    drawLineKirusBack(point1, point2, kr1Shape);
                } else {
                    drawLine(point1, point2);
                }
            }
        }, updateFrequencyMs)
        return () => {
            clearInterval(intervalId);
        }
    }, [drawHistory, move, resize, updateFrequencyMs]);
    return <>
        <div>
            <div className='d-inline-block'>
                <input type='checkbox'
                       className='mr-2'
                       onChange={() => setDrawHistory(!drawHistory)}
                       name='drawHistory'
                       checked={drawHistory}/>
                <label htmlFor='drawHistory'
                       onClick={() => setDrawHistory(!drawHistory)}
                       style={{
                           cursor: 'pointer',
                           userSelect: 'none'
                       }}>Показывать историю</label>
            </div>
            <div className='d-inline-block ml-3'>
                <input type='checkbox'
                       className='mr-2'
                       onChange={() => setMove(!move)}
                       name='move'
                       checked={move}/>
                <label htmlFor='drawHistory'
                       onClick={() => setMove(!move)}
                       style={{
                           cursor: 'pointer',
                           userSelect: 'none'
                       }}>Хаотическое движение</label>
            </div>
            <div className='d-inline-block ml-3'>
                <input type='checkbox'
                       className='mr-2'
                       onChange={() => setResize(!resize)}
                       name='drawHistory'
                       checked={resize}/>
                <label htmlFor='drawHistory'
                       onClick={() => setResize(!resize)}
                       style={{
                           cursor: 'pointer',
                           userSelect: 'none'
                       }}>Изменение размера</label>
            </div>
            <div className='ml-3'>
                <label htmlFor='drawHistory'
                       onClick={() => setResize(!resize)}
                       style={{
                           cursor: 'pointer',
                           userSelect: 'none'
                       }}>Частота обновления(мс = {updateFrequencyMs}):&nbsp;</label>
                <input type='number'
                       className='mr-2'
                       value={stringUpdateFrequencyMs}
                       onChange={({target: {value}}) => {
                           const ms = Number(value);
                           if (ms != null && !isNaN(ms) && ms > 100 && ms < 10000) {
                               setUpdateFrequencyMs(ms)
                           } else {
                               setUpdateFrequencyMs(100);
                           }
                           setStringUpdateFrequencyMs(value);
                       }}
                       name='drawHistory'
                       checked={resize}/>
            </div>
        </div>
        <div style={{
            border: '1px black solid',
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
        }}>
            <canvas ref={canvasRef}
                    id='c'
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}/>
        </div>
    </>
});
