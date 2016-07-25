import { canvasModel } from './canvasModel';

let canvas, 
	ctx,
	backCanvas,
	backCtx;

export function initCanvas () {
	backCanvas = document.createElement('canvas');
	canvas = document.getElementById('myCanvas');
	ctx = canvas.getContext('2d');
	backCanvas.width  = 800;
    backCanvas.height = 500;
    backCtx = backCanvas.getContext('2d');
	
	canvasModel.setCtx(ctx);

	return { 'ctx': ctx, 'backCanvas': backCanvas, 'backCtx': backCtx };
}

// export function getCtx() {
// 	canvas = document.getElementById('myCanvas');
// 	return canvas.getContext('2d');
// }
