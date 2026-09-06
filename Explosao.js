var Explosao = Entity.extend(function () {

    this.gameTimer = Object.create(GameTimer);

    this.width = 50;
    this.height = 47;

    this.range = 1;

    this.owner = undefined;

    this.states = {
        CENTRO: "MEIO",
        BAIXO: "BAIXO",
        CIMA: "CIMA",
        DIREITO: "DIREITO",
        ESQUERDO: "ESQUERDO",
        HORIZONTAL: "HORIZONTAL",
        VERTICAL: "VERTICAL",
    };

    this.constructor = function (spriteSheet, x, y, owner) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.owner = owner;

        this.setup();
    };

    this.update = function () {
        this.frames = this.eStates[this.currentState];

        if (this.currentFrame < this.frames.length - 1) this.currentFrame++;
        else this.currentFrame = 0;
    };

    this.setup = function () {
        this.eStates[this.states.CENTRO] = this.spriteSheet.getStats(
            this.states.CENTRO
        );
        this.eStates[this.states.BAIXO] = this.spriteSheet.getStats(
            this.states.BAIXO
        );
        this.eStates[this.states.DIREITO] = this.spriteSheet.getStats(
            this.states.DIREITO
        );
        this.eStates[this.states.ESQUERDO] = this.spriteSheet.getStats(
            this.states.ESQUERDO
        );
        this.eStates[this.states.HORIZONTAL] = this.spriteSheet.getStats(
            this.states.HORIZONTAL
        );
        this.eStates[this.states.CIMA] = this.spriteSheet.getStats(
            this.states.CIMA
        );
        this.eStates[this.states.VERTICAL] = this.spriteSheet.getStats(
            this.states.VERTICAL
        );

        this.currentFrame = 0;

        this.gameTimer.setup(1, 200, this.countDown);
        this.gameTimer.start();
    };

    this.countDown = function () {
        this.active = false;
        this.gameTimer.stop();
    };

});