var Bomba = Entity.extend(function () {
    this.gameTimer = Object.create(GameTimer);

    this.exploded = false;
    this.exploding = false;
    this.notify = undefined;

    this.width = 32;
    this.height = 32;
    this.contador = 0;
    this.owner = undefined;
    this.somBomba = undefined;
    this.on = false;

    this.states = {
        ATIVO: "BOMBA",
    };

    this.constructor = function (spriteSheet, x, y, owner, callBack, somBomba) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.notify = callBack;
        this.somBomba = somBomba;
        this.somBomba.load();

        this.setup();
    };

    this.update = function () {
        this.frames = this.eStates[this.currentState];
        if (this.contador < 3) this.contador++;
        else {
            if (this.currentFrame < this.frames.length - 1) this.currentFrame++;
            else this.currentFrame = 0;
            this.contador = 0;
        }

        if (!this.on && this.somBomba != undefined) {
            this.somBomba.volume = 0.2;
            this.somBomba.play();
            this.on = true;
        }
    };

    this.setup = function () {
        this.eStates[this.states.ATIVO] = this.spriteSheet.getStats(
            this.states.ATIVO
        );

        this.currentState = this.states.ATIVO;

        this.currentFrame = 0;

        this.gameTimer.setup(1, 1000, this.countDown);
        this.gameTimer.start();
    };

    this.countDown = function () {
        this.gameTimer.stop();
        this.somBomba.pause();
        this.exploding = true;
        this.active = false;
        this.notify();
    };
});