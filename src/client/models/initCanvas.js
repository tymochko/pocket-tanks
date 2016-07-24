import { canvasModel } from './canvasModel';

// let canvas, 
// 	ctx,
// 	backCanvas,
// 	backCtx;

export function initCanvas () {
    let sky = document.getElementById('skyCanvas'),
        ground = document.getElementById('groundCanvas'),
        lightning = document.getElementById('lightningCanvas'),
        tank = document.getElementById('tankCanvas'),
        bullet = document.getElementById('bulletCanvas');
    
    canvasModel.setSky(sky, sky.getContext('2d'));
    canvasModel.setGround(ground, ground.getContext('2d'));
    canvasModel.setLightning(lightning, lightning.getContext('2d'));
    canvasModel.setTank(tank, tank.getContext('2d'));
    canvasModel.setBullet(bullet, bullet.getContext('2d'));
	
	// backCanvas = document.createElement('canvas');
	// canvas = document.getElementById('myCanvas');
	// ctx = canvas.getContext('2d');
	// backCanvas.width  = 800;
    // backCanvas.height = 500;
    // backCtx = backCanvas.getContext('2d');
	//
	// canvasModel.setCtx(ctx);
    //
	// return { 'ctx': ctx, 'backCanvas': backCanvas, 'backCtx': backCtx };
}