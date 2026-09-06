var Caixa = Entity.extend(function () {
    this.gameTimer = Object.create(GameTimer);

    this.width = 30;
    this.height = 32;

    this.active = true;

    this.id;
    this.isDead = false;
    this.hasKey = false;
    this.hasPowerUp = false;
    this.powerUpName = "";
    this.destroyed = false;
    this.somBloco = undefined;
    this.sons = [];
    this.morreu = false;

    this.states = {
        BOX: "",
        MORRER: "",
    };

    this.constructor = function (spriteSheet, nomeImagem, killed, somBloco, blocoAnimacao, id) {
        this.spriteSheet = spriteSheet;
        this.states.BOX = nomeImagem;
        this.id = id;
        this.isDead = killed;
        this.somBloco = somBloco
        this.states.MORRER = blocoAnimacao;

        this.setup();
    };
    this.contador = 0;
    this.update = function () {
        this.frames = this.eStates[this.currentState];
        if (this.destroyed && !this.morreu) {
            this.somBloco.play();
            this.sons.push(this.somBloco);
            this.morreu = true;
        }
        if (this.destroyed && this.contador < 2) {
            this.contador++;
        } else if (this.destroyed && this.contador >= 2 && this.currentFrame < this.frames.length - 1 && this.destroyed) {
            this.currentFrame++;
            this.contador = 0;
        } else if (this.currentFrame >= this.frames.length - 1 && this.destroyed) {
            this.somBloco.pause();
            this.active = false;
            if(this.sons.length > 0)
                this.sons.pop();
        }
    };

    this.setup = function () {
        //Associar as animações de ANDAR
        this.eStates[this.states.BOX] = this.spriteSheet.getStats(this.states.BOX);

        this.currentState = this.states.BOX;

        this.currentFrame = 0;
    };

   /* this.countDown = function () {
        this.somBloco.play();
        this.sons.push(this.somBloco);
        this.gameTimer.setup(1, 1000, this.killCrate);

        this.gameTimer.start();
    }*/

    this.killCrate = function () {
        this.somBloco.pause();
        this.active = false;
        this.isDead = true;
        //this.gameTimer.stop();
        this.sons.pop();
    }
});