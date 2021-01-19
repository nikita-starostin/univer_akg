export class GlobalCanvasContextProvider {
   private static _canvasContext: CanvasRenderingContext2D | null;

   static setContext(canvasContext: CanvasRenderingContext2D): void {
      this._canvasContext = canvasContext;
   }

   static getContext(): CanvasRenderingContext2D {
      return this._canvasContext!;
   }
}
