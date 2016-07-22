import explosion from '/home/olga/Desktop/project/pocket-tanks/src/client/models/shotTrajectory'; 
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
			const bullet = { pos: [50, 100],
            imgInf: new ImgInf(bulletImg.src, [0,0], 30, 5),
            angle: 30,
            bulletSpeed: 5
            };

			//console.log(explosion.bullet);
			explosion.generateExplosion(dt2);
			expect(bullet.pos[0]).toEqual(58.66);
			expect(bullet.pos[1]).toEqual(114.62);
 	        //expect(generateExplosion(dt2)).toEqual(5);
 	    })
	    
});