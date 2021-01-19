export interface IPoint {
    x: number;
    y: number;
}

export interface ITriangleState {
    points: IPoint[];
}

export interface ICrossState {
    x1: number;
    y1: number;
    width1: number;
    height1: number;
    x2: number;
    y2: number;
    width2: number;
    height2: number;
}

export interface IKr1Shape {
    x: number;
    y: number;
    width: number;
    height: number;
}
