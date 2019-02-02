function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime -= this.totalTime;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = -800;
    this.y = 1;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    // Entity.call(this, game, 0, 400);
    this.radius = 200;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Background.prototype.update = function () {
    this.x += 1;
    if(this.x > 0) this.x = -800;
}

function Foreground(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    // Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Foreground.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Foreground.prototype.update = function () {
    this.x -= 1;
    if(this.x < -800) this.x = 0;
}

function Demon(game, spritesheet) {
    this.x = 20;
    this.y = -100;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Demon.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Demon.prototype.update = function () {
}

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.onCollide = function(Object) {
    // console.log('OOF!');
    // if (364 - this.right <= 3 && 364 - this.right > 0 && this.bottom > 350) {
    //     Object.x = 232;
    //     console.log('OOF!');
    //     return true;
    // }
    // if (this.left - 428 <= 3 && this.left - 428 > 0 && this.bottom > 350) {
    //     Object.x = 368;
    //     console.log('OOF!');
    //     return true;
    // }
    // if (364 - this.left <= 64 && this.right - 428 <= 64) {
    //     Object.ground = 280;
    //     Object.update;
    //     console.log('OOF!');
    //     return true;
    // }
    // if (this.bottom - 350 <= 3 && this.bottom - 350 > 0) {
    //     Object.y = 414;
    //     Object.floor = 414;
    //     console.log('OOF!');
    //     return true;
    // }
    return false;
}

function Cube(game) {
    cubeSlideRightBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide_right.png"), 0, 0, 64, 64, 0.10, 14, true, false);
    cubeSlideLeftBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide_left.png"), 0, 0, 64, 64, 0.10, 14, true, false);
    this.animation = cubeSlideRightBeginning;
    cubeRightSpin = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, false);
    cubeLeftSpin = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, true);
    this.jumpAnimation = cubeRightSpin;
    this.jumping = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.ground = 350;
    Entity.call(this, game, 336, 350);
}

Cube.prototype = new Entity();
Cube.prototype.constructor = Cube;

Cube.prototype.update = function () {
    if (this.game.w) {
        this.jumping = true;
    } 
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }  
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    if(this.boundingbox.left < 128) {
        this.x = 64;
    }
    if(this.boundingbox.right > 672) {
        this.x = 544;
    }    
    this.boundingbox.onCollide(this);
    Entity.prototype.update.call(this);
}

Cube.prototype.draw = function (ctx) {
    if (this.game.a && !this.game.d) {
        this.animation = cubeSlideLeftBeginning;
        if (!this.jumping) {
            this.jumpAnimation = cubeLeftSpin;
        }
        this.x -= 3;
    } 
    if (this.game.d && !this.game.a) {
        this.animation = cubeSlideRightBeginning;
        if (!this.jumping) {
            this.jumpAnimation = cubeRightSpin;
        }
        this.x += 3;
    }
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }     
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    // ctx.strokeRect(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);   
    Entity.prototype.draw.call(this);
}

function Crate(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 1, 2, true, false);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.ground = 350;
    Entity.call(this, game, 672, 350);
}

Crate.prototype = new Entity();
Crate.prototype.constructor = Crate;

Crate.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Crate.prototype.draw = function (ctx) {
    if(this.x < -64) {
        this.x = 800;
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    // ctx.strokeRect(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - 64, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - 128, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, -64, this.y, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, -64, this.y - 64, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, -64, this.y - 128, 3);
    Entity.prototype.draw.call(this);
}

function Spike(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.ground = 350;
    Entity.call(this, game, 608, 350);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;

Spike.prototype.update = function () {
    // this.boundingbox.onCollide(this.game.Entity.Cube.boundingbox);
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if(this.x < -64) {
        this.x = 800;
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    // ctx.strokeRect(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    this.animation.drawFrame(this.game.clockTick, ctx, 0, this.y, 3);
    Entity.prototype.draw.call(this);
}

function Fire(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/fire.png"), 0, 0, 128, 128, 0.1, 64, true, false);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, this.animation.frameWidth, this.animation.frameHeight);
    this.ground = 350;
    Entity.call(this, game, 400, -110);
}

Fire.prototype = new Entity();
Fire.prototype.constructor = Fire;

Fire.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Fire.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 4);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - 500, this.y, 4);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x - 250, this.y, 4);
    Entity.prototype.draw.call(this);
}

// the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/cube_jump.png");
ASSET_MANAGER.queueDownload("./img/cube_slide_right.png");
ASSET_MANAGER.queueDownload("./img/cube_slide_left.png");
ASSET_MANAGER.queueDownload("./img/block.png");
ASSET_MANAGER.queueDownload("./img/spike.png");
ASSET_MANAGER.queueDownload("./img/fire.png");
ASSET_MANAGER.queueDownload("./img/bg.png");
ASSET_MANAGER.queueDownload("./img/transparent_bg.png");
ASSET_MANAGER.queueDownload("./img/demon.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da shield");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
 
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    gameEngine.addEntity(new Demon(gameEngine, ASSET_MANAGER.getAsset("./img/demon.png")));
    gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    gameEngine.addEntity(new Fire(gameEngine));
    gameEngine.addEntity(new Cube(gameEngine));
    gameEngine.addEntity(new Crate(gameEngine));
    gameEngine.addEntity(new Spike(gameEngine));
});
