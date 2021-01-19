export function randomInteger(min: number, max: number): number {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export function getVectorLength(v: number[]) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

export function scalarMultiplyVectors(v1: number[], v2: number[]): number {
    const dotProduct = v1
        .map((n, i) => n * v2[i])
        .reduce((acc, curr) => acc + curr);
    const vectorsMagnitude = getVectorLength(v1) * getVectorLength(v2);
    const cos = dotProduct / vectorsMagnitude;
    return dotProduct * cos;
}
