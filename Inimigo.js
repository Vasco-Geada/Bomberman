var Inimigo = Entity.extend(function () {
    this.gameTimer = Object.create(GameTimer);

    this.width = 64;
    this.height = 64;

    this.animationEnd = false;
    this.isDead = false;
    this.bombCounter = 1;
    this.speed = 3;
    this.id = undefined;

    this.somAndar = undefined;
    this.somMorrer = undefined;
    this.sons = [];
    this.id = "inim";

    this.direcao = {
        cima: false,
        direita: false,
        baixo: false,
        esquerda: false,
    };

    this.collisionSide = false;
    this.colocarBomba = undefined;

    this.flipH = 1;
    this.isPlacing = false;

    this.preLoad = false;
    this.intervalo = undefined;
    this.collided = false;
    this.id = "inimigo";

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
    };
    this.constructor = function (spriteSheet, x, y, somAndar, somMorrer, colocarBomba) {
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.somAndar = somAndar;
        this.somMorrer = somMorrer;
        this.colocarBomba = colocarBomba;

        this.somAndar.volume = 0.1;
        this.somMorrer.volume = 0.1;

        this.setup();
    };

    this.contador = 0;
    this.update = function (caixas) {
        this.x += this.vx; // vx é a velocidade em x
        this.y += this.vy; // vy é a velocidade em y

        if (this.collisionSide !== "none")
            this.andar(caixas);

        this.frames = this.eStates[this.currentState];
        if (this.isDead) {
            if (this.contador > 2 && this.currentFrame < this.frames.length - 1) {
                this.currentFrame++;
                this.contador = 0;
            } else {
                this.contador++;
            }
        }
        if (this.contador > 0 && !this.isDead) {
            if (this.currentFrame < this.frames.length - 1 && !this.isDead) this.currentFrame++;
            else if (!this.isDead) {
                this.currentFrame = 0;
                this.animationEnd = true;
            }
            this.contador = 0;
        } else {
           this.contador++;

        }

        if (this.isDead && this.currentFrame == this.frames.length - 1)
            this.killed = true;

        if (!this.preLoad) {
            this.startInterval();
            this.preLoad = true;
        }
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

        this.currentState = this.states.IDLECIMA;
    };

    this.numeroAleatorio = function (max) {
        return Math.floor(Math.random() * max);
    }

    this.andar = function (caixas) {
        if (this.isDead) return
        // Verificar se a caixa onde o inimigo está tem alguma do seu lado esquerdo, direito, cima baixo
        var movimentos = [];
        var inimigoCentroX = this.x + this.width / 2;
        var inimigoCentroY = this.y + this.height / 2;
        var bombaMovimentos = [];
        this.collided = true;
        for (let row = 0; row < caixas.length; row++) {
            for (let column = 0; column < caixas[row].length; column++) {
                let caixaEsq = caixas[row][column].x;
                let caixaDrt = caixas[row][column].x + 50;
                let caixaCima = caixas[row][column].y;
                let caixaBaixo = caixas[row][column].y + 50;

                if (
                    inimigoCentroX >= caixaEsq &&
                    inimigoCentroX <= caixaDrt &&
                    inimigoCentroY >= caixaCima &&
                    inimigoCentroY <= caixaBaixo
                ) {
                    if (bombas.length > 0) {
                        for (let i = 0; i < bombas.length; i++) {
                            let bomba = bombas[i];
                            var bombaCentroX = bomba.x + bomba.width / 2;
                            var bombaCentroY = bomba.y + bomba.height / 2;


                            if ((bombaCentroX >= caixas[row][column - 1].x && bombaCentroX <= caixas[row][column - 1].x + 49 &&
                                    bombaCentroY >= caixas[row][column - 1].y && bombaCentroY <= caixas[row][column - 1].y + 49) == false &&
                                caixas[row][column - 1].id == 2) {
                                bombaMovimentos.push("right");
                            }

                            if ((bombaCentroX >= caixas[row][column + 1].x && bombaCentroX <= caixas[row][column + 1].x + 49 &&
                                    bombaCentroY >= caixas[row][column + 1].y && bombaCentroY <= caixas[row][column + 1].y + 49) == false &&
                                caixas[row][column + 1].id == 2) {
                                bombaMovimentos.push("left");
                            }

                            if (caixas[row + 1][column].id == 2 &&
                                (bombaCentroX >= caixas[row + 1][column].x && bombaCentroX <= caixas[row + 1][column].x + 49 &&
                                    bombaCentroY >= caixas[row + 1][column].y && bombaCentroY <= caixas[row + 1][column].y + 49) == false) {
                                bombaMovimentos.push("bottom");
                            }

                            if ((bombaCentroX >= caixas[row - 1][column].x && bombaCentroX <= caixas[row - 1][column].x + 49 &&
                                    bombaCentroY >= caixas[row - 1][column].y && bombaCentroY <= caixas[row - 1][column].y + 49) == false &&
                                caixas[row - 1][column].id == 2) {
                                bombaMovimentos.push("top");
                            }
                        }
                    } else {
                        if (caixas[row][column - 1] && caixas[row][column - 1].id == 2) {
                            movimentos.push("right");
                        }
                        // Verificação direita
                        if (caixas[row][column + 1] && caixas[row][column + 1].id == 2) {
                            movimentos.push("left");
                        }
                        // Verificação baixo
                        if (caixas[row + 1][column] && caixas[row + 1][column].id == 2) {
                            movimentos.push("bottom");
                        }
                        // Verificação cima
                        if (caixas[row - 1][column] && caixas[row - 1][column].id == 2) {
                            movimentos.push("top");
                        }
                    }


                }
            }
        }

        let numero;
        if (bombaMovimentos.length > 0) {
            numero = Math.floor(Math.random() * bombaMovimentos.length);
            switch (bombaMovimentos[numero]) {
                case "top":
                    this.direcao.cima = true;
                    this.direcao.baixo = false;
                    this.direcao.esquerda = false;
                    this.direcao.direita = false;
                    break;
                case "bottom":
                    this.direcao.baixo = true;
                    this.direcao.cima = false;
                    this.direcao.esquerda = false;
                    this.direcao.direita = false;
                    break;
                case "right":
                    this.direcao.esquerda = true;
                    this.direcao.cima = false;
                    this.direcao.baixo = false;
                    this.direcao.direita = false;
                    break;
                case "left":
                    this.direcao.direita = true;
                    this.direcao.cima = false;
                    this.direcao.baixo = false;
                    this.direcao.esquerda = false;
                    break;
            }

        } else if (movimentos.length > 0) {
            numero = Math.floor(Math.random() * movimentos.length);
            switch (movimentos[numero]) {
                case "top":
                    this.direcao.cima = true;
                    this.direcao.baixo = false;
                    this.direcao.esquerda = false;
                    this.direcao.direita = false;
                    break;
                case "bottom":
                    this.direcao.baixo = true;
                    this.direcao.cima = false;
                    this.direcao.esquerda = false;
                    this.direcao.direita = false;
                    break;
                case "right":
                    this.direcao.esquerda = true;
                    this.direcao.cima = false;
                    this.direcao.baixo = false;
                    this.direcao.direita = false;
                    break;
                case "left":
                    this.direcao.direita = true;
                    this.direcao.cima = false;
                    this.direcao.baixo = false;
                    this.direcao.esquerda = false;
                    break;
            }
        }
        this.collisionSide = "none";

        if (this.direcao.esquerda) {
            //  if (this.flipH > 0) this.flipHorizontal();
            this.vx = -this.speed;
            this.vy = 0;

            this.currentState = this.states.ANDARE;

            //Definir a direção em que está a andar
        } else if (this.direcao.direita) {
            // if (player.flipH < 0) this.flipHorizontal();
            this.vx = this.speed;
            this.vy = 0;

            this.currentState = this.states.ANDARD;

            //Definir a direção em que está a andar
        } else if (this.direcao.cima) {
            this.vy = -this.speed;
            this.vx = 0;

            this.currentState = this.states.SUBIR;
        } else if (this.direcao.baixo) {
            this.vy = this.speed;
            this.vx = 0;

            this.currentState = this.states.DESCER;
        }
        if (this.vx === 0 || this.vx === 0) return;

        this.somAndar.play();

    }

    this.parar = function () {
        if (this.shooting || this.isDead) return;

        if (this.vx != 0 || this.vy != 0) return;

        this.somAndar.pause();

        if (this.direcao.cima) this.currentState = this.states.IDLECIMA;
        else if (this.direcao.baixo) this.currentState = this.states.IDLEBAIXO;
        else if (this.direcao.esquerda) this.currentState = this.states.IDLELADOE;
        else if (this.direcao.direita) this.currentState = this.states.IDLELADOD;

        this.currentFrame = 0;
        this.animationEnd = false;
    };

    this.morrer = function () {
        this.vx = 0;
        this.vy = 0;
        this.isDead = true;
        this.gameTimer.stop();

        this.somMorrer.play();
        this.sons.push(this.somMorrer);
        this.somAndar.pause();
        this.removerMusica(this.somAndar);

        this.currentFrame = 0;
        this.animationEnd = false;

        this.direcao.baixo = false;
        this.direcao.cima = false;
        this.direcao.esquerda = false;
        this.direcao.direita = false;

        this.vx = 0;
        this.vy = 0;

        this.currentState = this.states.MORRER;
    };

    this.disparar = function () {
        if (this.bombCounter < 1) return;
        if (this.bombCounter > this.bombLimit) return;
        if (this.waittime > 0) return;
        this.somAndar.pause();
        this.removerMusica(this.somAndar);
        this.currentFrame = 0;

        this.bombCounter--;
        this.isPlacing = false;
    };

    this.countDown = function () {
        if (this.bombCounter < 1) {
            this.intervalo = setTimeout(this.countDown, this.numeroAleatorio(5) * 1000);
            return;
        }
        this.isPlacing = true;
        this.colocarBomba();
        this.intervalo = setTimeout(this.countDown, this.numeroAleatorio(5) * 1000);

    };

    this.startInterval = function () {
        this.intervalo = setTimeout(this.countDown, this.numeroAleatorio(5) * 1000);
    }

    this.removerMusica = function (musica) {
        let music = sons.indexOf(musica);
        musica.loop = false;
        musica.pause();
        sons.splice(music, 1);
    }
});