import { TrianglesStore } from './TrianglesStore';

const trianglesStore = new TrianglesStore();

export function useTrianglesStore() {
    return trianglesStore;
}
