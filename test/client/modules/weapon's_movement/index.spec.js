describe ("Test weapon's movement", function () {

	let angle;

	beforeEach(function(){
		angle = 0;
	})

    fit ("Initial state of weapon", function(){
		expect(angleWeapon.toEqual(0));
    });

    fit ("Increase angle", function(){
    	angle = 30;
    	getId('moreAngle').onclick;
    	expect(angle.toEqual(35));
		expect(angleWeapon.toEqual(35*Math.PI/180));
    });

    fit ("Increase maximum angle", function(){
    	angle = 80;
    	getId('moreAngle').onclick;
    	expect(angle.toEqual(80));
		expect(angleWeapon.toEqual(80*Math.PI/180));
    });

    fit ("Decrease angle", function(){
    	angle = 10;
    	getId('lessAngle').onclick;
    	expect(angle.toEqual(5));
		expect(angleWeapon.toEqual(5*Math.PI/180));
    });

    fit ("Decrease minimum angle", function(){
    	angle = 0;
    	getId('lessAngle').onclick;
    	expect(angle.toEqual(0));
		expect(angleWeapon.toEqual(0));
    });

});