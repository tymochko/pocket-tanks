describe("Test tank's movement", function () {
    fit("should be true",function(){
        //var k=tankMove(30);
        var f = initGame();
        var k = f.tankMove(30);
        expect(k).toBeDefined();
    })

});
