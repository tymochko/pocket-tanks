import { canvasModel } from './canvasModel';

export function initCanvas() {

    const sky = document.getElementById('skyCanvas');
    const ground = document.getElementById('groundCanvas');
    const lightning = document.getElementById('lightningCanvas');
    const tank = document.getElementById('tankCanvas');
    const bullet = document.getElementById('bulletCanvas');

    canvasModel.setSky(sky, sky.getContext('2d'));
    canvasModel.setGround(ground, ground.getContext('2d'));
    canvasModel.setLightning(lightning, lightning.getContext('2d'));
    canvasModel.setTank(tank, tank.getContext('2d'));
    canvasModel.setBullet(bullet, bullet.getContext('2d'));
}
