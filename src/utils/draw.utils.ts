import { ICrossState, IKr1Shape, IPoint } from '../modules/akg/pages/components/ipr1Shape/Ipr1Shape.models';
import { GlobalCanvasContextProvider } from './canvasContext';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;

export function drawPoint(point: IPoint, color: number[] = [0, 0, 0, 255]) {
    const context = GlobalCanvasContextProvider.getContext();
    context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
    context.fillRect(point.x, point.y, 1, 1);
}

export function clearCanvas() {
    const context = GlobalCanvasContextProvider.getContext();
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function getLinePoints(point1: IPoint, point2: IPoint): IPoint[] {
    const resultPoints = [];
    let {x: x1, y: y1} = point1;
    let {x: x2, y: y2} = point2;
    const steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
    if (steep) {
        [x1, y1] = [y1, x1];
        [x2, y2] = [y2, x2];
    }
    if (x1 > x2) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
    }
    const dx = x2 - x1;
    const dy = Math.abs(y2 - y1);
    let err = dx / 2;
    const ystep = y1 < y2 ? 1 : -1;
    let y = y1;
    for (let x = x1; x <= x2; ++x) {
        resultPoints.push({
            x: steep ? y : x,
            y: steep ? x : y,
        });
        err -= dy;
        if (err < 0) {
            y += ystep;
            err += dx;
        }
    }
    return resultPoints;
}

export function drawLine(point1: IPoint, point2: IPoint, color?: number[]) {
    getLinePoints(point1, point2).forEach(point => {
        drawPoint(point, color);
    })
}

export function drawLineSatherlandKoenInCross(point1: IPoint, point2: IPoint, cross: ICrossState): void {
    const points = getLinePoints(point1, point2);
    points.forEach(point => {
        const {x, y} = point;
        const satherlandKoenArr1 = [
            x >= cross.x1 ? 0 : 1,
            x <= cross.x1 + cross.width1 ? 0 : 1,
            y >= cross.y1 ? 0 : 1,
            y <= cross.y1 + cross.height1 ? 0 : 1,
        ]
        const satherlandKoenArr2 = [
            x >= cross.x2 ? 0 : 1,
            x <= cross.x2 + cross.width2 ? 0 : 1,
            y >= cross.y2 ? 0 : 1,
            y <= cross.y2 + cross.height2 ? 0 : 1,
        ]

        const sum1 = satherlandKoenArr1
            .reduce((prev, curr) => curr + prev, 0);
        const sum2 = satherlandKoenArr2
            .reduce((prev, curr) => curr + prev, 0);
        if (sum1 > 0 && sum2 > 0) {
            drawPoint(point);
        }
    })
}

interface ITriangle {
    edges: IPoint[][],
    vertices: IPoint[]
}

export function getKr1ShapeEdges(kr1Shape: IKr1Shape): ITriangle[] {
    // defined edges by vertices
    const {x, y, width, height} = kr1Shape;
    const dy = height / 2;
    const dx = width / 2;
    const topLeft = {x, y};
    const topMiddle = {x: x + dx, y};
    const topRight = {x: x + width, y};
    const rightMiddle = {x: x + width, y: y + dy};
    const bottomRight = {x: x + width, y: y + height};
    const bottomMiddle = {x: x + dx, y: y + height};
    const bottomLeft = {x, y: y + height};
    const leftMiddle = {x, y: y + dy};

    const buildTriangle = (points: IPoint[]): ITriangle => ({
        edges: points.map((p, i) => [p, points[i === points.length - 1 ? 0 : i + 1]]),
        vertices: points,
    })

    return [
        // top left
        buildTriangle([topLeft, topMiddle, leftMiddle]),

        // top right
        buildTriangle([topMiddle, topRight, rightMiddle]),

        // bottom right
        buildTriangle([rightMiddle, bottomRight, bottomMiddle]),

        // bottom left
        buildTriangle([bottomMiddle, bottomLeft, leftMiddle]),
    ];
}

function clipKirusBack(x0: number, y0: number, x1: number, y1: number, normales: number[][]):
    {
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        visible: number
    } {
    let x0res = x0;
    let y0res = y0;
    let x1res = x1;
    let y1res = y1;

    let visible = 1;
    let t0 = 0;
    let t1 = 1;
    const xn = x0;
    const yn = y0;
    const dx = x1 - x0;
    const dy = y1 - y0;
    let qx = 0;
    let qy = 0;
    let pn = 0;
    let qn = 0;
    let r = 0;

    for (let i = 0; i < normales.length; ++i) {
        const nx = normales[i][0];
        const ny = normales[i][1];
        qx = xn - nx;
        qy = yn - ny;
        pn = dx * nx + dy * ny;
        qn = qx * nx + qy * ny;

        if (pn == 0) {
            if (qn < 0) {
                visible = 0;
                console.log('qn < 0');
                break;
            }
        } else {
            r = -(qn / pn);
            if (pn < 0) {
                if (r < t0) {
                    console.log('r < t0');
                    visible = 0;
                    break;
                }
                if (r < t1) {
                    t1 = r;
                }
            } else {
                if (r > t1) {
                    visible = 0;
                    console.log('r > t1');
                    break;
                }
                if (r > t0) {
                    t0 = r;
                }
            }
        }
    }

    if (visible) {
        if (t0 > t1) {
            visible = 0;
        } else {
            if (t0 > 0) {
                x0res = xn + t0 * dx;
                y0res = yn + t0 * dy;
            }
            if (t1 < 1) {
                x1res = xn + t1 * dx;
                y1res = yn + t1 * dy;
            }
        }
    }

    return {
        x0: x0res,
        y0: y0res,
        x1: x1res,
        y1: y1res,
        visible
    }
}

export function isPointInsideTriangle(s: IPoint, a: IPoint, b: IPoint, c: IPoint) {
    const as_x = s.x-a.x;
    const as_y = s.y-a.y;

    const s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0;

    if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0 == s_ab) return false;

    if((c.x-b.x)*(s.y-b.y)-(c.y-b.y)*(s.x-b.x) > 0 != s_ab) return false;

    return true;
}

export function drawLineKirusBack(point1: IPoint, point2: IPoint, kr1Shape: IKr1Shape): void {
    const points = getLinePoints(point1, point2);

    const triangles = getKr1ShapeEdges(kr1Shape);

    points.forEach(p=> {
        if(!triangles.some(t => isPointInsideTriangle(p, t.vertices[0], t.vertices[1], t.vertices[2]))) {
            drawPoint(p);
        }
    })
    // const edgeNormales = edges.map(([point1, point2]) => {
    //     const y = point2.x - point1.x;
    //     const x = point1.y - point2.y
    //     const c = point1.x * point2.y - point2.x * point1.y;
    //
    //     return [x, y];
    // });
    //
    // const clip = clipKirusBack(point1.x, point1.y, point2.x, point2.y, edgeNormales);
    // if(clip.visible) {
    //     points.forEach(point => {
    //         drawPoint(point);
    //     })
    // }

    // const belongToEdge = edges.map(([point1, point2]) => {
    //     const points = getLinePoints(point1, point2);
    //     return (x: number, y: number): boolean => {
    //         return points.some(p =>
    //             Math.abs(p.x - x) < 2
    //             && Math.abs(p.y - y) < 2);
    //     };
    // })
    // let visible = true;
    // let visibleCounter = 0;
    // points.forEach(point => {
    //     if (belongToEdge.some(b => b(point.x, point.y)) && visibleCounter > 4) {
    //         visibleCounter = 0;
    //         visible = !visible;
    //     }
    //     if (visible) {
    //         drawPoint(point);
    //     }
    //     visibleCounter++;
    // });
    // console.log(visibleCounter);
}
