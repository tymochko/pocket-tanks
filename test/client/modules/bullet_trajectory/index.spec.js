import explosion from '/home/olga/Desktop/project/pocket-tanks/src/client/models/shotTrajectory'; 
import paper from 'paper';
describe ("Test shot trajectory", function () {

		let dt2, tankX, tankY, angleWeapon, bulletSpeed, bulletImg, bullet;

		/*fit ("Trajectory should be defined", function(){
			expect(generateExplosion(dt2)).toBeDefined();
		})*/

		fit ("Trajectory in the beginning", function(){
			dt2 = 2;
			tankX = 50;
			tankY = 100;
			angleWeapon = 30;
			bulletSpeed = 5;
			//weaponWidth = 25;
				bulletImg = {};
			bullet = { pos: [50, 100],
            	imgInf: bulletImg,
            	angle: 30,
            	bulletSpeed: 5
            };

			console.log(bullet);
			explosion.generateExplosion(dt2, bullet, 50, 100, 30, 30, false);
			expect(bullet.pos[0]).toEqual(65.69003715549151);
			expect(bullet.pos[1]).toEqual(89.4633690315756);
 	        //expect(generateExplosion(dt2)).toEqual(5);
 	    })
	    
});