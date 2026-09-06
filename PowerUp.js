var PowerUp = Entity.extend(function () {
    this.width = 50;
    this.height = 50;
    this.nome = "";

    this.states = {
        ATIVO: "",
    };

    this.constructor = function (spriteSheet, x, y, nome) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.states.ATIVO = nome;
        this.nome = nome;
        this.setup();
    };

    this.update = function () {
        this.frames = this.eStates[this.currentState];

        this.currentFrame = 0;
    };

    this.setup = function () {
        this.eStates[this.states.ATIVO] = this.spriteSheet.getStats(
            this.states.ATIVO
        );

        this.currentState = this.states.ATIVO;

    };
});