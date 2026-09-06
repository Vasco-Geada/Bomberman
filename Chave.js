var Chave = Entity.extend(function () {
    this.width = 32;
    this.height = 32;
    this.clockWise = true;

    this.states = {
        KEY: "KEY",
    };

    this.constructor = function (spriteSheet, x, y) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;

        this.setup();
    };

    this.update = function () {
        this.frames = this.eStates[this.currentState];
        /*if (this.currentFrame < this.frames.length - 1 && this.clockWise) this.currentFrame++;
        else if (this.currentFrame < this.frames.length - 1) this.clockWise = false
        else if (this.currentFrame < 1 && !this.clockWise) this.currentFrame--;
        else this.clockWise = true;*/
        if (this.currentFrame < this.frames.length - 1) this.currentFrame++;
        else this.currentFrame = 0;
    };

    this.setup = function () {
        this.eStates[this.states.KEY] = this.spriteSheet.getStats(
            this.states.KEY
        );

        this.currentState = this.states.KEY;

        this.currentFrame = 0;
    };
});