import { draw } from '/mnt/pocket-tanks/src/client/models/tankMovement';
import { findLinePoints } from '/mnt/pocket-tanks/src/client/models/tankMovement';
import externalVariables from '/mnt/pocket-tanks/src/client/models/externalVariables';

describe ("Test tank's movement", function () {
	describe ("Test Y coordinate", function () {
		let coord;

		beforeEach (function(){
			coord = {
				"x": 0,
				"y": 0
			}
		})

		it ("should be defined", function(){
			expect(findLinePoints(coord.x)).toBeDefined();
		})
	    it ("should be equal in the beginning", function(){
	    	coord = {
				"x": 0,
				"y": 500
			}
	        expect(findLinePoints(coord.x)).toEqual(coord.y);
	    })
	    it ("should be equal in the middle", function(){
	    	coord = {
				"x": 400,
				"y": 183
			}
	        expect(findLinePoints(coord.x)).toEqual(coord.y);
	    })
	    it ("should be equal in the end", function(){
	    	coord = {
				"x": 800,
				"y": 250
			}
	        expect (findLinePoints(coord.x)).toEqual(coord.y);
	    })
	});

    describe ("Test tank's move", function () {
    	let tankX = 0;
    	let values = {
    		'right': tankX + 1,
    		'left': tankX
    	},
    		iteration;

    	beforeEach (function() {
    		iteration = 1;
    	});

	    it ("should be equal in the move right", function(){
			tankX = draw('right', iteration, false);
	        expect(tankX).toEqual(values.right);
	    });

	    it ("should be equal in the move left", function(){
	        tankX = draw('left', iteration, false);
	        expect(tankX).toEqual(values.left);
	    });
	});
});