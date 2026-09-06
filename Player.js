var Player = Entity.extend(function () {
    this.gameTimer = Object.create(GameTimer);

    this.width = 64;
    this.height = 64;

    this.animationEnd = false;
    this.isDead = false;
    this.bombCounter = 1;
    this.hasKey = false;
    this.lost = false;
    this.vitoria = false;
    this.contador = 0;
    this.speed = 6;
    this.bombLimit = 1;
    this.bombsPlaced = 0;

    this.somAndar = undefined;
    this.somMorrer = undefined;
    this.sons = [];
    this.isPlacing = false;
    this.id = "player";


    this.direcao = {
        cima: false,
        lado: false,
        baixo: false,
    };

    this.flipH = 1;
    this.canShoot = true;

    this.states = {
        ANDARE: "ANDARE",
        ANDARD: "ANDARD",
        SUBIR: "SUBIR",
        DESCER: "DESCER",
        IDLECIMA: "IDLECIMA",
        IDLEBAIXO: "IDLEBAIXO",
        IDLELADOE: "IDLELADOE",
        IDLELADOD: "IDLELADOD",
        MORRER: "DEAD",
        WIN: "WIN",
        LOSE: "LOSE",
    };
    this.constructor = function (spriteSheet, x, y, somAndar, somMorrer) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.somAndar = somAndar;
        this.somMorrer = somMorrer;

        this.somAndar.volume = 0.1;
        this.somMorrer.volume = 0.1;

        this.setup();
    };
    this.contador = 0;
    this.update = function () {
        this.x += this.vx; // vx é a velocidade em x
        this.y += this.vy; // vy é a velocidade em y
        if (!this.lost && !this.vitoria) this.andar();

        this.frames = this.eStates[this.currentState];
        if (this.lost || this.vitoria) {
            if (this.contador < 3) this.contador++;
            else {
                if (this.currentFrame < this.frames.length - 1) this.currentFrame++;
                else this.currentFrame = 0;
                this.contador = 0;
            }
        } else if (this.contador > 0) {
            if (this.currentFrame < this.frames.length - 1) {
                this.currentFrame++;
                this.contador = 0;
            } else if (!this.isDead) {
                this.currentFrame = 0;
                this.animationEnd = true;
                this.contador = 0;
            }
        } else {
            this.contador++;
        }


        if (this.vy < 0 && this.direcao.cima) this.currentState = this.states.SUBIR;
        else if (this.vy > 0 && this.direcao.baixo) this.currentState = this.states.DESCER;
        else if (this.vx > 0 && this.direcao.direita) this.currentState = this.states.ANDARD;
        else if (this.vx < 0 && this.direcao.esquerda) this.currentState = this.states.ANDARE;

        if (this.bombCounter > this.bombLimit)
            this.bombCounter = this.bombLimit;

        if (this.isDead && this.currentFrame == this.frames.length - 1)
            this.killed = true;
    };

    this.setup = function () {
        //Associar as animações de ANDAR
        this.eStates[this.states.ANDARE] = this.spriteSheet.getStats(
            this.states.ANDARE
        );
        this.eStates[this.states.ANDARD] = this.spriteSheet.getStats(
            this.states.ANDARD
        );
        this.eStates[this.states.SUBIR] = this.spriteSheet.getStats(
            this.states.SUBIR
        );
        this.eStates[this.states.DESCER] = this.spriteSheet.getStats(
            this.states.DESCER
        );

        //Associar as animações de IDLE
        this.eStates[this.states.IDLECIMA] = this.spriteSheet.getStats(
            this.states.IDLECIMA
        );
        this.eStates[this.states.IDLEBAIXO] = this.spriteSheet.getStats(
            this.states.IDLEBAIXO
        );
        this.eStates[this.states.IDLELADOE] = this.spriteSheet.getStats(
            this.states.IDLELADOE
        );
        this.eStates[this.states.IDLELADOD] = this.spriteSheet.getStats(
            this.states.IDLELADOD
        );

        //Associar as animações de MORRER
        this.eStates[this.states.MORRER] = this.spriteSheet.getStats(
            this.states.MORRER
        );

        //Associar as animações de Vitória/Derrota
        this.eStates[this.states.WIN] = this.spriteSheet.getStats(this.states.WIN);
        this.eStates[this.states.LOSE] = this.spriteSheet.getStats(
            this.states.LOSE
        );

        this.currentState = this.states.IDLECIMA;
    };

    this.andar = function () {
        if (this.isDead) return;
        if (this.vx == 0 && this.vy == 0) {
            this.currentFrame = 0;
            this.animationEnd = false;
        }

        if (teclas[65] || touchKeys[3]) { // Esquerda
            //  if (this.flipH > 0) this.flipHorizontal();
            this.vx = -this.speed;
            //this.vy = 0;

            //Definir a direção em que está a andar
            this.direcao.esquerda = true;
            this.direcao.direita = false;
            this.direcao.cima = false;
            this.direcao.baixo = false;
        }
        if (teclas[68] || touchKeys[1]) { // Direita
            // if (player.flipH < 0) this.flipHorizontal();
            this.vx = this.speed;
            //  this.vy = 0;


            //Definir a direção em que está a andar
            this.direcao.direita = true;
            this.direcao.esquerda = false;
            this.direcao.cima = false;
            this.direcao.baixo = false;
        }
        if (teclas[87] || touchKeys[0]) { // Cima
            this.vy = -this.speed;
            //   this.vx = 0;


            //Definir a direção em que está a andar
            this.direcao.cima = true;
            this.direcao.esquerda = false;
            this.direcao.direita = false;
            this.direcao.baixo = false;
        }
        if (teclas[83] || touchKeys[2]) { // Baixo
            this.vy = this.speed;
            //    this.vx = 0;


            //Definir a direção em que está a andar
            this.direcao.baixo = true;
            this.direcao.cima = false;
            this.direcao.esquerda = false;
            this.direcao.direita = false;
        }
        if (teclas[65] || teclas[68] || teclas[87] || teclas[83] || touchKeys[0] || touchKeys[1] || touchKeys[2] || touchKeys[3]) {
            this.somAndar.play();
            this.sons.push(this.somAndar);
        }
    };

    this.parar = function () {
        if (this.shooting || this.isDead || this.lost) return;
        if (!teclas[87] && !teclas[83] && !touchKeys[0] && !touchKeys[2]) this.vy = 0;
        if (!teclas[65] && !teclas[68] && !touchKeys[1] && !touchKeys[3]) this.vx = 0;

        if (this.vx != 0 || this.vy != 0) return;

        if (this.direcao.cima) this.currentState = this.states.IDLECIMA;
        else if (this.direcao.baixo) this.currentState = this.states.IDLEBAIXO;
        else if (this.direcao.esquerda) this.currentState = this.states.IDLELADOE;
        else if (this.direcao.direita) this.currentState = this.states.IDLELADOD;

        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.currentFrame = 0;
        this.animationEnd = false;
    };

    this.morrer = function () {
        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.somMorrer.play();
        this.sons.push(this.somMorrer);
        this.isDead = true;
        this.currentFrame = 0;
        this.currentState = this.states.MORRER;
        this.animationEnd = false;
        this.vx = 0;
        this.vy = 0;
    };

    this.ganhou = function () {
        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.currentFrame = 0;
        this.currentState = this.states.WIN;
        this.animationEnd = false;
        this.vx = 0;
        this.vy = 0;
        this.vitoria = true;
    };
    this.perdeu = function () {
        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.currentFrame = 0;
        this.currentState = this.states.LOSE;
        this.animationEnd = false;
        this.vx = 0;
        this.vy = 0;
        this.lost = true;
    };

    this.disparar = function () {
        if (this.bombCounter < 1) return;
        if (this.bombCounter > this.bombLimit) return;
        if (this.waittime > 0) return;
        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.currentFrame = 0;
        this.isPlacing = true;

        this.bombCounter--;
    };

    this.removerMusica = function (musica) {
        let music = sons.indexOf(musica);
        musica.loop = false;
        musica.pause();
        sons.splice(music, 1);
    }
});