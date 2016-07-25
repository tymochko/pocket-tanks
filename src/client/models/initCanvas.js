import { canvasModel } from './canvasModel';

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
}