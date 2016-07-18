//<------Maks's part-------->


    var lastTime;
    var dt2=0;
    var bullets = [];
    var bullet;
    var lastFire = Date.now();
    var gameTime = 0;
    const g = 9.81;
    var bulletImg=new Image();
    bulletImg.src='./public/images/bullet2.png';

    function makeShot() {
        dt2=0;
        bullets.push({ pos: [tankX+45, tankY-44],
            imgInf: new ImgInf(bulletImg.src,[0,0],angle,power),
            angle: angle,
            bulletSpeed: power
        });
        lastFire = Date.now();
        shotStart();
    }

    function drawBullet() {
        clear();

        fillBackground();
        drawTank(tankX,tankY);

        var now = Date.now();
        var dt = (now - lastTime) / 1000.0;
        update(dt);
        render();
        lastTime = now;
    }

    function shotStart() {
        lastTime = Date.now();
        drawBullet();
    }

    function update(dt) {
        gameTime += dt;
        updateEntities(dt);
    }

    function updateEntities(dt) {
        for(var i = 0; i < bullets.length; i++) {
            bullet = bullets[i];
            bullet.pos[0] = tankX + weaponWidth * Math.cos(angleWeapon + angle*Math.PI/180) + bullet.bulletSpeed * dt2*Math.cos(bullet.angle*Math.PI/180 + angleWeapon);
            bullet.pos[1] = tankY-30 - weaponWidth * Math.sin(angleWeapon + angle*Math.PI/180)- (bullet.bulletSpeed * dt2*Math.sin(bullet.angle*Math.PI/180 + angleWeapon) - g * dt2 * dt2 / 2);
            dt2 += 4*dt;
                // creating path for bullet and originalPoints
                var bull = new paper.Path.Rectangle(bullet.pos[0],bullet.pos[1], 45, 7);
            //check angle for accuracy of point
            bull.rotate(-bullet.imgInf.currAngle);

            var groundPath = new paper.Path(
                new paper.Point(originalPoints[0][0], originalPoints[0][1])
                );
            for(let i = 1; i < originalPoints.length; i++) {
                groundPath.add(new paper.Point(originalPoints[i][0], originalPoints[i][1]))
            }
            // check if intersect the original points
            var intersect = bull.getIntersections(groundPath);
            if(intersect.length > 0 ) {
                bullets.splice(i, 1);
                i--;

                let crossPoint = {
                    x: intersect[0]._point.x,
                    y: intersect[0]._point.y
                };
                console.log( 'x:' +  crossPoint.x, 'y:' + crossPoint.y );
                tick(crossPoint);                                   // <------ Explosion ------>
                window.cancelAnimationFrame(requestAnimFrame);

                originalPoints = calculateDamageArea(originalPoints, crossPoint.x, crossPoint.y);

                // temporary solution for redrawing updated array originalPoints
                clear();
                drawSky();
                drawGround();

                pattern = ctx.createPattern(backCanvas, "no-repeat");
                tankY = findLinePoints(tankX);

                fillBackground();
                drawTank(tankX, tankY);
            }
            else if(bullet.pos[0]>WIDTH || bullet.pos[1]>HEIGHT)
            {
                bullets.splice(i, 1);
                window.cancelAnimationFrame(requestAnimFrame);
                i--;
                clear();
                drawSky();
                drawGround();

                pattern = ctx.createPattern(backCanvas, "no-repeat");
                tankY = findLinePoints(tankX);

                fillBackground();
                drawTank(tankX, tankY);
            }
            else
            {
                requestAnimFrame(drawBullet);
            }
        }
    }

    function render() {
        renderEntities(bullets);
    };

    function renderEntities(list) {
        for(var i=0; i<list.length; i++) {
            renderEntity(list[i]);
        }
    }

    function renderEntity(entity) {
        ctx.save();
        ctx.translate(entity.pos[0], entity.pos[1]);
        entity.imgInf.render(ctx,dt2);
        ctx.restore();
    }

    function reset() {
        gameTime = 0;
        bullets = [];
    };

    (function() {
        function ImgInf(url, pos, angle, v0) {
            this.pos = pos;
            this.url = url;
            this.angle=angle;
            this.v0=v0;
            this.currAngle = 0;
        };

        ImgInf.prototype = {

            render: function(ctx, dt2) {
                var x = this.pos[0];
                var y = this.pos[1];
                ctx.translate(x,y);

                var A=this.v0*Math.cos(this.angle*Math.PI/180 + angleWeapon);
                this.currAngle=Math.atan(((this.v0)*Math.sin(this.angle*Math.PI/180 + angleWeapon)-g*dt2)/A);
                ctx.rotate(-this.currAngle);
                ctx.drawImage(bulletImg,x, y);
                ctx.restore();
            }
        };

        window.ImgInf = ImgInf;
    })();