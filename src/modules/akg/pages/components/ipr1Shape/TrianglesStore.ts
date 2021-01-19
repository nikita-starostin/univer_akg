import { action, observable } from 'mobx'
import { randomInteger } from '../../../../../utils/js.utils';
import { ICrossState, IKr1Shape, IPoint, ITriangleState } from './Ipr1Shape.models';

const RESIZE_STEP_AMOUNT = 30;

export class TrianglesStore {
    @observable history: {
        triangle: ITriangleState,
        drawn: boolean;
    }[] = [];

    @observable current: ITriangleState = {
        points: [{x: 100, y: 100,}, {x: 300, y: 300}, {x: 100, y: 400}],
    };
    private _size: number = RESIZE_STEP_AMOUNT;
    private _sizeChange = -1;

    constructor() {
        this.moveAndResize = this.moveAndResize.bind(this);
        this.move = this.move.bind(this);
    }

    @action.bound moveAndResize(move: boolean, resize: boolean): void {
        this.history.push({
            triangle: this.current,
            drawn: false,
        })
        if (move) {
            this.move();
        }
        if (resize) {
            this.resize();
        }
        this.current.points = [...this.current.points];
    }

    private resize() {
        // get centroid
        const centroid = {x: 0, y: 0} as IPoint;
        let signedArea = 0.0;
        let prev = this.current.points[this.current.points.length - 1];
        this.current.points.forEach(point => {
            const {x: x0, y: y0} = prev;
            const {x: x1, y: y1} = point;
            const a = x0 * y1 - x1 * y0;
            signedArea += a;
            centroid.x += (x0 + x1) * a;
            centroid.y += (y0 + y1) * a;
            prev = point;
        })
        signedArea *= 0.5;
        centroid.x /= (6 * signedArea);
        centroid.y /= (6 * signedArea);

        // resize
        this.current.points.forEach(point => {
            if (this._size + this._sizeChange === 0) {
                this._sizeChange = 1;
            } else if (this._size + this._sizeChange === RESIZE_STEP_AMOUNT) {
                this._sizeChange = -1;
            }
            this._size += this._sizeChange;
            point.x = centroid.x + (30 + this._sizeChange) / RESIZE_STEP_AMOUNT * (point.x - centroid.x);
            point.y = centroid.y + (30 + this._sizeChange) / RESIZE_STEP_AMOUNT * (point.y - centroid.y);
        })
    }

    private move(): void {
        const dx = randomInteger(-3, 3);
        const dy = randomInteger(-3, 3);
        this.current.points.forEach(point => {
            point.x += dx;
            point.y += dy;
        })
    }
}
