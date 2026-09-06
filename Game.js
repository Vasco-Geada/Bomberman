var canvas;
var drawingSurface;
var entities;
var inimigos;
var bombas;
var explosions;
var chaves;
var ended;

var pontos;
var pontosCounter;
var stageLvl;
var bombsAvailable;
var inimigoCounter;
var speedUp;
var speedUpCounter;
var speedDown;
var speedDownCounter;
var bombAdd;
var bombAddCounter;

var teclas;
var requestId;

var key;
var player;
var inimigo;
var caixas;
var portas;
var powerups;
var powers;

// Controlos Mobile
var touchKeys;
var btnRgt;
var btnUp;
var btnDwn;
var btnLft;
var touchBomb;

var up, down, left, right;

//Variáveis para controlar os fps
var stop;
var frameCount;
var fps;
var fpsInterval, startTime, now, then, elapsed;
var nivel;
var portaAberta;

window.addEventListener("load", init, false);

//Sons
const somAndar = new Audio("audio/somAndar.mp3");
const somBackground = new Audio("audio/somBackground.mp3");
const somBackground2 = new Audio("audio/somBackground2.mp3");
const somBloco = new Audio("audio/somBloco.mp3");
const somBomba = new Audio("audio/somBomba.mp3");
const somChave = new Audio("audio/somChave.mp3");
const somGameOver = new Audio("audio/somGameOver.mp3");
const somMorreu = new Audio("audio/somMorreu.mp3");
const somVitoria = new Audio("audio/somVitoria.mp3");
const somTrapdoor = new Audio("audio/somTrapdoor.mp3");
const somLoadBomba = new Audio("audio/somLoadBomba.mp3");
const somPickup = new Audio("audio/somPickup.mp3");
var backgroundSound;
var ultimoUpdate;

var sons;
var btnJogar;
// Variáveis do temporizador
var interval;
var minElement;
var secElement;
var tempoRestante;
var timeStopped;
var chave;

var touchToStart;

var inimigosRestantes;
var regrasAberto;
var portaDestrancada;
const ROWS = 11;
const COLUMNS = 15;
var keySpawned;
var campanha;
var controlosAberto;
var minutos;
var segundos;

function init() {
    canvas = document.querySelector("canvas");
    drawingSurface = canvas.getContext("2d");
    btnJogar = document.getElementById("jogar");
    document.getElementById("pontuacao").classList.add("hide");
    
    touchToStart = document.getElementById("touchToStart");
    touchToStart.addEventListener("click", openFullscreen);
    touchKeys = [false, false, false, false];
    key = document.getElementById("key");
    touchBomb = document.getElementById("touchBomb");
    btnUp = document.getElementById("btnUp");
    btnLft = document.getElementById("btnLft");
    btnRgt = document.getElementById("btnRgt");
    btnDwn = document.getElementById("btnDwn");

    //Tocar nos botões
    btnUp.addEventListener("touchstart", function () {
        touchDownHandler(0);
    });
    btnRgt.addEventListener("touchstart", function () {
        touchDownHandler(1);
    });
    btnDwn.addEventListener("touchstart", function () {
        touchDownHandler(2);
    });
    btnLft.addEventListener("touchstart", function () {
        touchDownHandler(3);
    });
    touchBomb.addEventListener("touchstart", function () {
        touchDownHandler(4);
    });
   
    //Parar de tocar nos botões
    btnUp.addEventListener("touchend", function () {
        touchUpHandler(0);
    });
    btnRgt.addEventListener("touchend", function () {
        touchUpHandler(1);
    });
    btnDwn.addEventListener("touchend", function () {
        touchUpHandler(2);
    });
    btnLft.addEventListener("touchend", function () {
        touchUpHandler(3);
    });
    touchBomb.addEventListener("touchend", function () {
        touchUpHandler(4);
    });

    //Cancelar o Toque
 btnUp.addEventListener("touchcancel", function () {
        touchUpHandler(0);
    });
    btnRgt.addEventListener("touchcancel", function () {
        touchUpHandler(1);
    });
    btnDwn.addEventListener("touchcancel", function () {
        touchUpHandler(2);
    });
    btnLft.addEventListener("touchcancel", function () {
        touchUpHandler(3);
    });
    touchBomb.addEventListener("touchcancel", function () {
        touchUpHandler(4);
    });

    minutos = 0;
    segundos = 0;
    controlosAberto = false;
    campanha = false;
    chave = null;
    caixas = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ];
    portas = [];
    powers = [];
    powerups = ["ADDBOMBA", "ADDSPEED", "TAKESPEED", "ADDBOMBA", "ADDSPEED", "TAKESPEED", "ADDBOMBA", "ADDSPEED", "TAKESPEED"];
    stop = false;
    fps = 30;
    frameCount = 0;
    nivel = 2;
    portaAberta = false;
    regrasAberto = false;
    portaDestrancada = false;
    timeStopped = false;
    sons = []
    entities = [];
    inimigos = [];
    bombas = [];
    explosions = [];
    chaves = [];
    ended = false;
    teclas = new Array(255);
    ultimoUpdate = 2

    somAndar.volume = 0.05;
    somBackground.volume = 0.1;
    somBackground2.volume = 0.06;
    somBloco.volume = 1;
    somBomba.volume = 0.1;
    somMorreu.volume = 0.1;
    somGameOver.volume = 0.1;
    somTrapdoor.volume = 0.1;
    somLoadBomba.volume = 0.3;
    somPickup.volume = 0.5;

    minElement = document.getElementById("min");
    secElement = document.getElementById("seg");

    pontosCounter = document.getElementById("score");
    stageLvl = document.getElementById("stageLvl");
    bombsAvailable = document.getElementById("bombsAvailable");
    inimigoCounter = document.getElementById("inimigoCounter");
    speedUp = document.getElementById("speedUpCounter");
    speedDown = document.getElementById("speedDownCounter");
    bombAdd = document.getElementById("bombAddCounter");

    var sp = new SpriteSheet();
    sp.load("assets/player.png", "assets/player.json", loadhandler);
}

function openFullscreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }

    touchToStart.classList.add("hide");
}
//                          CARREGAR TODAS AS SPRITESHEETS
function loadhandler() {
    let spBox = new SpriteSheet();
    if (gSpriteSheets["assets/boxes.png"] == null) {
        spBox.load("assets/boxes.png", "assets/boxes.json", loadhandler);
    } else if (gSpriteSheets["assets/bomba.png"] == null) {
        spBox.load("assets/bomba.png", "assets/bomba.json", loadhandler);
    } else if (gSpriteSheets["assets/explosion.png"] == null) {
        spBox.load("assets/explosion.png", "assets/explosion.json", loadhandler);
    } else if (gSpriteSheets["assets/trapdoor.png"] == null) {
        spBox.load("assets/trapdoor.png", "assets/trapdoor.json", loadhandler);
    } else if (gSpriteSheets["assets/inimigo.png"] == null) {
        spBox.load("assets/inimigo.png", "assets/inimigo.json", loadhandler);
    } else if (gSpriteSheets["assets/powers.png"] == null) {
        spBox.load("assets/powers.png", "assets/powers.json", loadhandler);
    }
}
//                          CARREGA O MENU
function loadMenu() {
    document.getElementById("menu").classList.remove("hide");
    document.getElementById("contador").classList.remove("hiden");
    document.getElementById("mensagemLose").classList.remove("hide");
    document.getElementById("goToMenu").classList.remove("hide");
}
//                          ABRE/FECHA AS REGRAS
function abrirRegras() {
    if (!regrasAberto) {
        document.getElementById("mn").classList.add("hide");
        document.getElementById("regras").classList.remove("hide");
        regrasAberto = true;
    } else {
        document.getElementById("mn").classList.remove("hide");
        document.getElementById("regras").classList.add("hide");
        regrasAberto = false;
    }
}
//                          ABRE/FECHA AS CONTROLOS
function abrirControlos() {
    if (!controlosAberto) {
        document.getElementById("mn").classList.add("hide");
        document.getElementById("controlos").classList.remove("hide");
        controlosAberto = true;
    } else {
        document.getElementById("mn").classList.remove("hide");
        document.getElementById("controlos").classList.add("hide");
        controlosAberto = false;
    }
}
//                          INICIA/CONTINUA O JOGO CAMPANHA
function iniciarCampanha() {
    nivel = 1;
    document.getElementById("menu").classList.add("hide");
    document.getElementById("titulo").classList.add("hide");
    document.getElementById("mensagemLose").classList.add("hide");
    document.getElementById("instrucoes").classList.add("hide");
    document.getElementById("contador").classList.remove("hiden");
    pontos = 0;
    campanha = true;
    mudarlvl();
}
//                          INICIA/CONTINUA O JOGO INFINITO
function iniciarInfinito() {
    nivel = 1;
    mudarlvl();
    document.getElementById("menu").classList.add("hide");
    document.getElementById("titulo").classList.add("hide");
    document.getElementById("mensagemLose").classList.add("hide");
    document.getElementById("instrucoes").classList.add("hide");
    document.getElementById("contador").classList.remove("hiden");
    pontos = 0;
    campanha = false;
}
//                          CARREGAR MAPA
function loadMap(nomePedra, nomeCaixa, nomeCaixaAnimacao) {
    for (let row = 0; row < caixas.length; row++) {
        for (let column = 0; column < caixas[row].length; column++) {

            if (caixas[row][column] == 0) {
                caixas[row][column] = new Caixa(
                    gSpriteSheets["assets/boxes.png"],
                    nomePedra, false, somBloco, "", 0
                );
            } else if (caixas[row][column] == 1) {
                caixas[row][column] = new Caixa(
                    gSpriteSheets["assets/boxes.png"],
                    nomeCaixa, false, somBloco, nomeCaixaAnimacao, 1
                );
            } else if (caixas[row][column] == 2) {
                caixas[row][column] = new Caixa(
                    gSpriteSheets["assets/boxes.png"],
                    "BLANK", true, somBloco, "", 2
                );
            } else if (caixas[row][column] == 3) {
                caixas[row][column] = new Caixa(
                    gSpriteSheets["assets/trapdoor.png"],
                    "TRAPCLOSE", false, somBloco, "", 3
                );
                portas.push(caixas[row][column]);
            }

            let box = caixas[row][column];

            box.x = column * 50;
            box.y = row * 50;
            box.row = row;
            box.col = column;
        }
    }
}
//                          LÒGICA POR CADA SEGUNDO QUE PASSA NO RELÒGIO
function countdown() {
    if (ended) return;
    // Verifica se o tempo restante é maior que 0
    if (tempoRestante > 0) {
        // Diminui o tempo restante em 1 segundo
        tempoRestante--;

        // Atualiza o elemento <p> com o novo valor do tempo restante
        minutos = Math.floor(tempoRestante / 60);
        segundos = tempoRestante - minutos * 60;
        minElement.innerText = "0" + minutos;
        secElement.innerText = segundos;
    } else {
        endGame();
        // Para a contagem regressiva quando o tempo atingir 0
        clearInterval(interval);
    }
}
//                          MOSTRA O MENU               
function mostrarMenu() {
    cancelAnimationFrame(requestId);
    reset();
    document.getElementById("botoes").classList.remove("hide");
    document.getElementById("mensagemLose").classList.add("hide");
    document.getElementById("mensagem").classList.add("hide");
    document.getElementById("contador").classList.add("hiden");
    document.getElementById("pontuacao").classList.add("hide");
    document.getElementById("goToMenu").classList.add("hide");
    document.getElementById("mensagemFinish").classList.add("hide");
    document.getElementById("menu").classList.remove("hide");
    document.getElementById("jogar").classList.remove("hide");
    document.getElementById("titulo").classList.remove("hide");
    document.getElementById("instrucoes").classList.remove("hide");
    document.getElementById("jogarInfinito").classList.remove("hide");
    document.getElementById("controlosBtn").classList.remove("hide");
    somVitoria.pause();
    somGameOver.pause();
    resetCanvas();
}
//                          FIM DO JOGO
function endGame(inf) {
    loadMenu()
    ended = true;
    backgroundSound.pause();
    clearInterval(interval);
    if (!player.isDead) player.perdeu();
    tocarAudio(somGameOver);
    document.getElementById("jogar").classList.add("hide");
    document.getElementById("jogarInfinito").classList.add("hide");
    document.getElementById("controlosBtn").classList.add("hide");

    if (!inf)
        document.getElementById("mensagemLose").classList.remove("hide");
    else {
        document.getElementById("mensagemLose").classList.add("hide");
        document.getElementById("mensagemFinish").classList.remove("hide");
        document.getElementById("pontuacao").classList.remove("hide");
        document.getElementById("scoreEnd").innerHTML = pontos;
        stop = true;
    }


}
//                          MUDAR DE NÍVEL
function mudarlvl() {
    stop = true;
    cancelAnimationFrame(requestId);
    stageLvl.innerHTML = "0" + nivel;
    window.removeEventListener("keydown", keyDownHandler);
    document.getElementById("mn").classList.remove("removeBackground");
    window.removeEventListener("keyup", keyUpHandler);
    document.getElementById("contador").classList.add("hiden");
    document.getElementById("mensagem").classList.add("hide");
    document.getElementById("mensagemLose").classList.add("hide");
    somGameOver.pause();

    var transition = document.getElementById("transition");
    transition.classList.remove("hide");
    reset();
    let lvl = document.getElementById("nivel");
    if (campanha) {
        switch (nivel) {
            case 1:
                lvl.innerHTML = "Nível " + nivel;
                setTimeout(function () {
                    transition.classList.add("hide");
                    loadLvl1();
                }, 2800);
                break;
            case 2:
                lvl.innerHTML = "Nível " + nivel;
                setTimeout(function () {
                    transition.classList.add("hide");
                    loadLvl2();
                }, 2800);
                break;
            case 3:
                lvl.innerHTML = "FIM DO JOGO ";
                setTimeout(function () {
                    transition.classList.add("hide");
                    loadLvl3();
                }, 2800);
                break;
        }

    } else {
        gerarMapa();
        lvl.innerHTML = "Nível " + nivel;
        setTimeout(function () {
            transition.classList.add("hide");
            loadLvl();
        }, 2800);
    }

}
//                          Define todos os arrays como []
function reset() {

    if (player && player.somMorrer != undefined)
        player.somMorrer.pause();

    for (let i = 0; i < bombas.length; i++) {
        bombas[i].somBomba.pause();
        bombas[i].gameTimer.stop();
    }
    if (sons.length > 0) {
        for (let i = 0; i < sons.length; i++) {
            sons[i].pause();
            removerMusica(sons[i]);
        }
    }
    tempoRestante = 220;

    minutos = Math.floor(tempoRestante / 60);
    segundos = tempoRestante - minutos * 60;
    minElement.innerText = "0" + minutos;
    secElement.innerText = segundos;

    for (let i = 0; i < entities.length; i++) {
        for (let j = 0; j < entities[i].sons.length - 1; j++) {
            entities[i].sons[j].pause();
            entities[i].somAndar.pause();
        }
    }
    for (let i = 0; i < inimigos.length; i++) {
        inimigos[i].somAndar.pause();
        inimigos.splice(i, 1);
    }
    for (let i = 0; i < teclas.length; i++) {
        teclas[i] = false;
    }
    for (let i = 0; i < touchKeys.length; i++) {
        touchKeys[i] = false;
        
    }
    entities = [];
    inimigosRestantes = 0;
    caixas = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    sons = [];
    player = undefined;
    inimigo = undefined;
    inimigos = [];
    chaves = [];
    portas = [];
    portaAberta = false;
    tempoRestante = 220;
    clearInterval(interval);
    chave = null;
    inimigo = null;
    bombas = [];
    stop = false;
    explosions = [];
    powers = [];
    ended = false;
    speedUpCounter = 0;
    speedDownCounter = 0;
    bombAddCounter = 0;
    bombAdd.innerHTML = bombAddCounter;
    speedUp.innerHTML = speedUpCounter;
    speedDown.innerHTML = speedDownCounter;
}
//                          Load dos níveis aleatórios
function loadLvl() {
    pontosCounter.innerHTML = pontos;

    window.addEventListener("keydown", keyDownHandler, false);

    window.addEventListener("keyup", keyUpHandler, false);

    player = new Player(gSpriteSheets["assets/player.png"], 50, 50, somAndar, somMorreu);
    entities.push(player);

    inimigo = new Inimigo(gSpriteSheets["assets/inimigo.png"], 652, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo);
    inimigos.push(inimigo);

    let inimigo2 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 50, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo2);
    inimigos.push(inimigo2);

    let inimigo3 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 600, 50, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo3);
    inimigos.push(inimigo3);
    let limites = ["PEDRA", "LANTERNA"];

    loadMap(limites[Math.floor(limites.length * Math.random())], "TIJOLO", "TIJOLOMORTO");
    gerarChave();
    loadPowerUps();
    let backgroundMusic = [somBackground, somBackground2];

    backgroundSound = backgroundMusic[Math.floor(backgroundMusic.length * Math.random())];
    backgroundSound.load();
    backgroundSound.play();
    backgroundSound.loop = true;

    inimigoCounter.innerHTML = inimigos.length;
    interval = setInterval(countdown, 1000);
    document.getElementById("contador").classList.remove("hiden");
    startUpdating(fps);
}
//                          GERAR NÌVEL 1
function loadLvl1() {
    pontos = 0;
    pontosCounter.innerHTML = pontos;

    window.addEventListener("keydown", keyDownHandler, false);

    window.addEventListener("keyup", keyUpHandler, false);

    player = new Player(gSpriteSheets["assets/player.png"], 50, 50, somAndar, somMorreu);
    entities.push(player);

    inimigo = new Inimigo(gSpriteSheets["assets/inimigo.png"], 652, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo);
    inimigos.push(inimigo);

    let inimigo2 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 50, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo2);
    inimigos.push(inimigo2);

    let inimigo3 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 600, 50, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo3);
    inimigos.push(inimigo3);

    caixas = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 0],
        [0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0],
        [0, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 0, 1, 0, 1, 3, 2, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 2, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 0],
        [0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0],
        [0, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    loadMap("PEDRA", "TIJOLO", "TIJOLOMORTO");
    gerarChave();
    loadPowerUps();

    backgroundSound = somBackground;
    backgroundSound.play();
    backgroundSound.loop = true;

    inimigoCounter.innerHTML = inimigos.length;
    interval = setInterval(countdown, 1000);
    document.getElementById("contador").classList.remove("hiden");
    startUpdating(fps);
}
//                          GERAR NÌVEL 2
function loadLvl2() {
    player = undefined;

    window.addEventListener("keydown", keyDownHandler, false);

    window.addEventListener("keyup", keyUpHandler, false);

    player = new Player(gSpriteSheets["assets/player.png"], 50, 50, somAndar, somMorreu);
    entities.push(player);

    inimigo = new Inimigo(gSpriteSheets["assets/inimigo.png"], 652, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo);
    inimigos.push(inimigo);

    let inimigo2 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 50, 427, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo2);
    inimigos.push(inimigo2);

    let inimigo3 = new Inimigo(gSpriteSheets["assets/inimigo.png"], 600, 50, somAndar, somMorreu, colocarBomba);
    entities.push(inimigo3);
    inimigos.push(inimigo3);


    caixas = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 0],
        [0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0],
        [0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 0, 1, 0, 1, 3, 2, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 2, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 0],
        [0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    loadMap("LANTERNA", "TIJOLO", "TIJOLOMORTO");
    gerarChave();
    loadPowerUps();

    inimigoCounter.innerHTML = inimigos.length;

    backgroundSound = somBackground2;
    backgroundSound.play();
    backgroundSound.loop = true;

    interval = setInterval(countdown, 1000);
    document.getElementById("contador").classList.remove("hiden");
    startUpdating(fps);
    stop = false;
}
//                          GERAR FIM
function loadLvl3() {

    document.getElementById("contador").classList.add("hiden");
    document.getElementById("botoes").classList.add("hide");
    document.getElementById("menu").classList.remove("hide");
    document.getElementById("goToMenu").classList.remove("hide");
    document.getElementById("mn").classList.add("removeBackground");
    document.getElementById("mensagem").classList.remove("hide");
    document.getElementById("mensagem").classList.remove("hide");
    document.getElementById("pontuacao").classList.remove("hide");
    document.getElementById("scoreEnd").innerHTML = pontos;
    clearInterval(interval);
    ended = true;

    player = new Player(gSpriteSheets["assets/player.png"], 50 * 7, 50 * 1, somAndar, somMorreu);
    entities.push(player);
    let inimigo = new Player(gSpriteSheets["assets/inimigo.png"], 50 * 5, 50 * 8, somAndar, somMorreu);
    entities.push(inimigo);
    let inimigo2 = new Player(gSpriteSheets["assets/inimigo.png"], 50 * 7, 50 * 8, somAndar, somMorreu);
    entities.push(inimigo2);
    let inimigo3 = new Player(gSpriteSheets["assets/inimigo.png"], 50 * 9, 50 * 8, somAndar, somMorreu);
    entities.push(inimigo3);

    caixas = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    loadMap("LANTERNA", "TIJOLO", "TIJOLOMORTO");

    somVitoria.load();
    somVitoria.play();

    player.ganhou();
    inimigo.perdeu();
    inimigo2.perdeu();
    inimigo3.perdeu();

    interval = setInterval(countdown, 1000);

    startUpdating(fps);
}
//                          GERAR MAPA
function gerarMapa() {
    let numeros = [0, 1, 2, 3];
    let numeroPedras = 10;
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (row == 0 || column == 0 || column == COLUMNS - 1 || row == ROWS - 1) {
                caixas[row][column] = 0;
                continue;
            }
            if (row == 1 && column == 1 || row == 1 && column == 2 || row == 2 && column == 1 ||
                row == 1 && column == COLUMNS - 3 || row == 1 && column == COLUMNS - 2 || row == 2 && column == COLUMNS - 2 ||
                row == ROWS - 2 && column == 1 || row == ROWS - 2 && column == 2 || row == ROWS - 3 && column == 1) {
                caixas[row][column] = 2;
                continue;
            }
            if (row == ROWS - 2 && column == COLUMNS - 3 || row == ROWS - 2 && column == COLUMNS - 2 || row == ROWS - 3 && column == COLUMNS - 2) {
                caixas[row][column] = 2;
                continue;
            }

            let num = Math.floor((numeros.length) * Math.random());
            if (numeros[num] == 0) {
                if (caixas[row - 1][column] == 0 || caixas[row][column - 1] == 0 || caixas[row - 1][column - 1] == 0) {
                    while (numeros[num] == 0) {
                        num = Math.floor((numeros.length) * Math.random());
                    }
                }
            }

            if (numeros[num] == 3) {
                caixas[row][column] = numeros[num];
                numeros.splice(num, 1);
                continue;
            }

            if (numeros[num] == 0) {
                numeroPedras--;
            }

            caixas[row][column] = numeros[num];
            if (numeroPedras < 1 && numeros[num] == 0) {
                numeros.shift();
            }
        }
    }
}
//                          GERAR POWERUPS
function loadPowerUps() {

    for (let i = 0; i < powerups.length; i++) {
        let row = Math.floor(caixas[0].length * Math.random());
        let col = Math.floor(caixas.length * Math.random());

        if (caixas[col][row].id !== 1 && !caixas[col][row].hasKey && !caixas[col][row].hasPowerUp) {
            do {
                col = Math.floor(caixas.length * Math.random());
                row = Math.floor(caixas[0].length * Math.random());
            } while (caixas[col][row].id !== 1 && !caixas[col][row].hasKey && !caixas[col][row].hasPowerUp);
        }

        caixas[col][row].hasPowerUp = true;
        caixas[col][row].powerUpName = powerups[i];
    }
}
//                          GERAR CHAVE NO MAPA
function gerarChave() {
    let col = Math.floor(caixas.length * Math.random());
    let row = Math.floor(caixas[0].length * Math.random());

    if (caixas[col][row].id !== 1) {
        do {
            col = Math.floor(caixas.length * Math.random());
            row = Math.floor(caixas[0].length * Math.random());
        } while (caixas[col][row].id !== 1);
    }
    caixas[col][row].hasKey = true;
}
//                          COMEÇAR CONTAR OS FPS
function startUpdating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;

    for (let i = 0; i < inimigos.length; i++) {
        inimigos[i].direcao.cima = true;
    }

    update();
}
//                          VERIFICA SE O ÁUDIO ACABOU
function audioEnded() {
    for (let i = 0; i < sons.length; i++) {
        if (sons[i].currentTime === sons[i].duration) {
            if (sons[i] === somBackground || sons[i] === somBackground2) continue;
            if (sons[i].paused) continue;
            removerMusica(sons[i]);
        }

    }
}
//                          REMOVE UMA MÚSICA
function removerMusica(musica) {
    if (stop) return;
    let music = sons.indexOf(musica);
    musica.loop = false;
    musica.pause();
    sons.splice(music, 1);
}
//                          TRATAR DOS EVENTOS QUANDO SE CARREGA NUMA TECLA
function keyDownHandler(e) {
    var codTecla = e.keyCode;
    teclas[codTecla] = true;

    if (teclas[80]) pauseHandler();
    if (ended || stop) return;

    if (player.isDead) return;

    if (teclas[32]) {
        player.isPlacing = true;
        colocarBomba(player);
    }
}
//                          TRATAR DOS EVENTOS QUANDO SE LARGA UMA TECLA
function keyUpHandler(e) {
    var codTecla = e.keyCode;
    teclas[codTecla] = false;

    if (!teclas[87] || !teclas[83] || !teclas[65] || !teclas[68]) {
        player.parar();
    }
}
//                          TRATAR DOS EVENTOS QUANDO SE TOCA NUMA TECLA
function touchDownHandler(codTecla) {
    touchKeys[codTecla] = true;

    if (touchKeys[5]) pauseHandler();
    if (ended || stop) return;

    if (player.isDead) return;

    if (touchKeys[4]) {
        player.isPlacing = true;
        colocarBomba(player);
    }
}
//                          TRATAR DOS EVENTOS QUANDO SE PARA/CANCELA P TOQUE
function touchUpHandler(codTecla) {
    touchKeys[codTecla] = false;
    console.log("chegou " + codTecla);

    if (!touchKeys[0] || !touchKeys[4] || !touchKeys[2] || !touchKeys[3]) {
        player.parar();
    }
}

//                          COLOCAR O JOGO TODO EM PAUSA
function pauseHandler() {
    if (stop) {
        stop = false;
        startUpdating(fps);
        if (tempoRestante > 0)
            interval = setInterval(countdown, 1000);

        backgroundSound.play();

        for (let i = 0; i < sons.length; i++) {
            sons[i].play();
        }
        for (let i = 0; i < bombas.length; i++) {
            bombas[i].gameTimer.start();
            bombas[i].somBomba.play();

        }
        for (let i = 0; i < caixas.length; i++) {
            if (caixas[i].destroyed)
                caixas[i].somBloco.play();
        }
        for (let i = 0; i < entities.length; i++) {
            for (let j = 0; j < entities[i].sons.length; j++) {
                entities[i].sons[j].play();
            }
        }
        for (let i = 0; i < inimigos.length; i++) {
            for (let j = 0; j < inimigos[i].sons.length - 1; j++) {
                inimigos[i].sons[j].play();
                if (inimigos[i].isDead)
                    inimigos[i].somMorrer.play();
            }
            inimigos[i].startInterval();
        }
        for (let i = 0; i < explosions.length; i++) {
            explosions[i].gameTimer.start();
        }

    } else {
        stop = true;
        cancelAnimationFrame(requestId);
        if (tempoRestante > 0)
            clearInterval(interval);
        backgroundSound.pause();
        for (let i = 0; i < sons.length; i++) {
            sons[i].loop = false;
            sons[i].pause();
        }
        for (let i = 0; i < bombas.length; i++) {
            bombas[i].gameTimer.stop();
            bombas[i].somBomba.pause();
        }
        for (let i = 0; i < caixas.length; i++) {
            caixas[i].somBloco.pause();
        }
        for (let i = 0; i < entities.length; i++) {
            for (let j = 0; j < entities[i].sons.length - 1; j++) {
                entities[i].sons[j].pause();
            }
        }
        for (let i = 0; i < inimigos.length; i++) {
            for (let j = 0; j < inimigos[i].sons.length - 1; j++) {
                inimigos[i].sons[j].pause();
                inimigos[i].somAndar.pause();
                if (inimigos[i].isDead)
                    inimigos[i].somMorrer.pause();
            }
            inimigos[i].sons;
            clearInterval(entities[i].intervalo);
        }
        for (let i = 0; i < explosions.length; i++) {
            explosions[i].gameTimer.stop();
        }
    }
}
//                          FUNÇÃO DE COLOCAR BOMBAS
function colocarBomba(ent) {
    if (stop) return;
    if (ent == undefined || ent == null) {
        for (let i = 0; i < inimigos.length; i++) {
            if (inimigos[i].isDead) continue;
            if (inimigos[i].bombCounter < 1) continue;
            let entidade = inimigos[i];
            if (entidade.isDead) continue;
            if (entidade.vx != 0 || player.vy != 0) continue;
            if (entidade.bombCounter < 1) continue;
            if (entidade.isPlacing == false) continue;
            entidade.disparar();

            var playerCentroX = entidade.x + entidade.width / 2;
            var playerCentroY = entidade.y + entidade.height / 2;

            for (let row = 0; row < caixas.length; row++) {
                for (let column = 0; column < caixas[row].length; column++) {
                    let caixaEsq = caixas[row][column].x;
                    let caixaDrt = caixas[row][column].x + 49;
                    let caixaCima = caixas[row][column].y;
                    let caixaBaixo = caixas[row][column].y + 49;

                    if (
                        playerCentroX >= caixaEsq &&
                        playerCentroX <= caixaDrt &&
                        playerCentroY >= caixaCima &&
                        playerCentroY <= caixaBaixo
                    ) {
                        let audio = new Audio("audio/somLoadBomba.mp3");
                        audio.volume = 0.1;
                        let bomba = new Bomba(gSpriteSheets["assets/bomba.png"], caixas[row][column].x,
                            caixas[row][column].y, inimigos[i], adicionaBomba, audio);
                        bombas.push(bomba);
                        break;
                    }
                }
            }
        }
    } else {
        let entidade = player;
        if (entidade.isDead) return;
        //if (entidade.vx != 0 || player.vy != 0) return;
        if (entidade.bombCounter < 1) return;
        if (entidade.isPlacing == false) return;

        var playerCentroX = entidade.x + entidade.width / 2;
        var playerCentroY = entidade.y + entidade.height / 2;

        let plant = true;
        for (let i = 0; i < bombas.length; i++) {
            if (playerCentroX >= bombas[i].x &&
                playerCentroX <= bombas[i].x + 50 &&
                playerCentroY >= bombas[i].y &&
                playerCentroY <= bombas[i].y + 50) {
                plant = false;
            }
        }

        if (!plant) return;

        entidade.disparar();



        for (let row = 0; row < caixas.length; row++) {
            for (let column = 0; column < caixas[row].length; column++) {
                let caixaEsq = caixas[row][column].x;
                let caixaDrt = caixas[row][column].x + 49;
                let caixaCima = caixas[row][column].y;
                let caixaBaixo = caixas[row][column].y + 49;

                if (
                    playerCentroX >= caixaEsq &&
                    playerCentroX <= caixaDrt &&
                    playerCentroY >= caixaCima &&
                    playerCentroY <= caixaBaixo
                ) {
                    let audio = new Audio("audio/somLoadBomba.mp3");
                    audio.volume = 0.1;
                    bombas.push(new Bomba(gSpriteSheets["assets/bomba.png"], caixas[row][column].x,
                        caixas[row][column].y, entidade, adicionaBomba, audio));

                    break;
                }
            }
        }
    }
}
//                          ADICIONA MAIS UMA BOMBA Á ENTIDADE QUE COLOCOU UMA
function adicionaBomba() {
    for (let i = 0; i < bombas.length; i++) {
        if (bombas[i].exploding && !bombas[i].exploded) {
            for (let j = 0; j < entities.length; j++) {
                if (bombas[i]) {
                    if (entities[j] === bombas[i].owner) {
                        entities[j].bombCounter++;

                    }
                }
            }
        }

    }
}
//                          LÓGICA POR CADA FRAME
function update() {
    if (stop) return;
    requestId = requestAnimationFrame(update, canvas);

    // Calcula o tempo decorrido desde o último loop

    now = Date.now();
    elapsed = now - then;

    // Se passou tempo suficiente, desenha o próximo frame

    if (elapsed > fpsInterval) {
        // Prepara o próximo frame ao definir then = now - tempo decorrido % intervalo dos fps
        then = now - (elapsed % fpsInterval);
        if (!stop)
            audioEnded();

        if (!ended && player != undefined && player.killed && campanha)
            endGame();
        else if (!ended && player != undefined && player.killed && !campanha) {
            endGame(true);
        }
        updateBoxImg();
        for (var row = 0; row < inimigos.length; row++) {
            if (inimigos[row].killed) {
                inimigos.splice(row, 1);
                inimigoCounter.innerHTML = inimigos.length;
                pontos += 250;
                pontosCounter.innerHTML = pontos;
            }
        }
        inimigosRestantes = inimigos.length;

        if (portaAberta && inimigosRestantes == 0) entrarPorta();
        for (var row = 0; row < entities.length; row++) {
            entities[row].update(caixas);
        }

        showUiKey();

        updateBomb();
        if (player != undefined)
            bombsAvailable.innerHTML = player.bombCounter;

        for (var row = 0; row < explosions.length; row++) {
            explosions[row].update();
        }
        if (chave != null)
            for (var row = 0; row < chaves.length; row++) {
                chaves[row].update();
            }

        for (var row = 0; row < powers.length; row++) {
            powers[row].update();
        }

        if (chaves.length > 0) apanharChave();
        if (powers.length > 0) apanharPowerUP();

        checkFireColision();

        addBombColisions();
        addBoxColisions();

        abrirPorta();

        render();
    }
}
//                          MOSTRAR / ESCONDER CHAVE
function showUiKey() {
    if (player != undefined && player.hasKey)
        key.classList.remove("unavailable");
    else
        key.classList.add("unavailable");
}
//                          ABRIR A PORTA
function abrirPorta() {
    for (let row = 0; row < caixas.length; row++) {
        for (let column = 0; column < caixas[row].length; column++) {

            let caixa = caixas[row][column];
            if (stop) return;
            if (caixa.id == 3) {
                if (verificaColisao(player, caixa) && player.hasKey && inimigos.length == 0) {
                    caixas[row][column] = new Caixa(
                        gSpriteSheets["assets/trapdoor.png"],
                        "TRAPOPEN", false, undefined, "", 4
                    );
                    caixas[row][column].update();
                    tocarAudio(somTrapdoor);
                    setTimeout(function () {
                        portaAberta = true;
                    }, 1000);
                }
            }
        }
    }
}
//                          ENTRAR NA PORTA
function entrarPorta() {
    for (let i = 0; i < portas.length; i++) {
        if (verificaColisao(player, portas[i])) {
            backgroundSound.pause();
            nivel++;
            mudarlvl(nivel);
        }
    };
}
//                          APANHAR A CHAVE
function apanharChave() {
    if (verificaColisao(player, chave) && !player.hasKey) {
        chaves.splice(0, 1);
        player.hasKey = true;

        let music = sons.indexOf(somChave);

        if (music) removerMusica(somChave);

        tocarAudio(new Audio("audio/somPickup.mp3"));
    } else if (player.hasKey && chaves.length > 0) {
        chaves.splice(0, 1);
    }
}
//                          APANHAR POWERUP
function apanharPowerUP() {
    for (let i = 0; i < powers.length; i++) {
        for (let j = 0; j < entities.length; j++) {
            if (!powers[i]) continue;
            if (verificaColisao(entities[j], powers[i])) {
                switch (powers[i].nome) {
                    case "ADDBOMBA":
                        powers.splice(i, 1);
                        entities[j].bombCounter++;
                        entities[j].bombLimit++;
                        tocarAudio(new Audio("audio/somPickup.mp3"));
                        if (entities[j] === player) {
                            pontos += 50;
                            bombAddCounter++;
                            bombAdd.innerHTML = bombAddCounter;
                        }
                        break;
                    case "ADDSPEED":
                        powers.splice(i, 1);
                        entities[j].speed += 2;
                        tocarAudio(new Audio("audio/somPickup.mp3"));
                        if (entities[j] === player) {
                            pontos += 50;
                            speedUpCounter++;
                            speedUp.innerHTML = speedUpCounter;
                        }
                        break;
                    case "TAKESPEED":
                        powers.splice(i, 1);
                        entities[j].speed -= 2;
                        tocarAudio(new Audio("audio/somPickup.mp3"));
                        if (entities[j] === player) {
                            pontos -= 70;
                            speedDownCounter++;
                            speedDown.innerHTML = speedDownCounter;
                        }
                        break;
                }
                pontosCounter.innerHTML = pontos;
            }
        }
    }
}
//                          VERIFICA SE HÁ COLISÃO COM A EXPLOSÃO
function checkFireColision() {
    for (let row = 0; row < explosions.length; row++) {
        for (let i = 0; i < entities.length; i++) {
            if (ended == true && verificaColisao(entities[i], explosions[row])) {
                if (explosions[row].owner !== entities[i] && entities[i] !== player) { // Caso a bomba seja de um inimigo, os inimigos não morrem para ela
                    entities[i].vx = 0;
                    entities[i].vy = 0;
                    entities[i].morrer();
                }
            } else if (!entities[i].isDead && verificaColisao(entities[i], explosions[row])) {
                if (explosions[row].owner !== entities[i]) { // Caso a bomba seja de um inimigo, os inimigos não morrem para ela
                    entities[i].vx = 0;
                    entities[i].vy = 0;
                    entities[i].morrer();
                } else if (explosions[row].owner === player) {
                    entities[i].vx = 0;
                    entities[i].vy = 0;
                    entities[i].morrer();
                }
            }
        }
    }
}
//                          TOCAR SOM
function tocarAudio(audio) {
    if (audio == undefined) return;
    audio.load();
    audio.play();
    sons.push(audio);
}
//                          ATUALIZAR CADA BOBMA
function updateBomb() {
    for (var row = 0; row < bombas.length; row++) {
        if (!bombas[row].exploded && bombas[row].exploding) {
            let explosion = new Explosao(
                gSpriteSheets["assets/explosion.png"],
                bombas[row].x,
                bombas[row].y,
                bombas[row].owner
            );

            bombas[row].exploded = true;
            explosion.currentState = explosion.states.CENTRO;
            explosions.push(explosion);
            gerarExplosao(bombas[row], explosion)
            let audio = new Audio("audio/somBomba.mp3");
            audio.volume = 0.1;
            tocarAudio(audio);
        }
        bombas[row].update();
    }
}
//                          GERAR EXPLOSÂO
function gerarExplosao(bomba, explosao) {
    for (let i = 0; i < explosao.range; i++) {
        let x = bomba.x;
        let y = bomba.y;

        let linhaDrt = x + 49 * i;

        let coluna = Math.round(y / 50);
        let linha = linhaDrt / 50;

        // Verificação esquerda
        if (
            caixas[coluna][linha - 1].id != 0
        ) {
            let explosionEsq = new Explosao(
                gSpriteSheets["assets/explosion.png"],
                x - 49,
                y,
                bomba.owner
            );

            explosionEsq.currentState = explosionEsq.states.ESQUERDO;
            explosions.push(explosionEsq);

            if (caixas[coluna][linha - 1].id == 1) {
                if (caixas[coluna][linha - 1].hasKey && chave == undefined) {
                    chave = new Chave(
                        gSpriteSheets["assets/trapdoor.png"],
                        x - 49,
                        y
                    );

                    chaves.push(chave);
                    tocarAudio(somChave);
                } else if (caixas[coluna][linha - 1].hasPowerUp) {
                    let powerup = new PowerUp(
                        gSpriteSheets["assets/powers.png"],
                        x - 49,
                        y,
                        caixas[coluna][linha - 1].powerUpName
                    );
                    powers.push(powerup);
                }
                caixas[coluna][linha - 1].destroyed = true;
            }
        }
        // Verificação direita
        if (
            caixas[coluna][linha + 1].id != 0
        ) {
            let explosionDrt = new Explosao(
                gSpriteSheets["assets/explosion.png"],
                x + 50,
                y + 1,
                bomba.owner
            );

            explosionDrt.currentState = explosionDrt.states.DIREITO;
            explosions.push(explosionDrt);

            if (caixas[coluna][linha + 1].id == 1) {
                if (caixas[coluna][linha + 1].hasKey && chave == undefined) {
                    chave = new Chave(
                        gSpriteSheets["assets/trapdoor.png"],
                        x + 50,
                        y + 1
                    );

                    chaves.push(chave);

                    tocarAudio(somChave);
                } else if (caixas[coluna][linha + 1].hasPowerUp) {
                    let powerup = new PowerUp(
                        gSpriteSheets["assets/powers.png"],
                        x + 50,
                        y + 1,
                        caixas[coluna][linha + 1].powerUpName
                    );
                    powers.push(powerup);
                }
                caixas[coluna][linha + 1].destroyed = true;
            }
        }
        // Verificação baixo
        if (
            caixas[coluna + 1][linha].id != 0
        ) {
            let explosionDrt = new Explosao(
                gSpriteSheets["assets/explosion.png"],
                x,
                y + 47,
                bomba.owner
            );
            explosionDrt.currentState = explosionDrt.states.BAIXO;
            explosions.push(explosionDrt);

            if (caixas[coluna + 1][linha].id == 1) {
                if (caixas[coluna + 1][linha].hasKey && chave == undefined) {
                    chave = new Chave(
                        gSpriteSheets["assets/trapdoor.png"],
                        x,
                        y + 47
                    );

                    chaves.push(chave);

                    tocarAudio(somChave);
                } else if (caixas[coluna + 1][linha].hasPowerUp) {
                    let powerup = new PowerUp(
                        gSpriteSheets["assets/powers.png"],
                        x,
                        y + 47,
                        caixas[coluna + 1][linha].powerUpName
                    );
                    powers.push(powerup);
                }
                caixas[coluna + 1][linha].destroyed = true;
            }
        }
        // Verificação cima
        if (
            caixas[coluna - 1][linha].id != 0
        ) {
            let explosionTop = new Explosao(
                gSpriteSheets["assets/explosion.png"],
                x,
                y - 47,
                bomba.owner
            );

            explosionTop.currentState = explosionTop.states.CIMA;
            explosions.push(explosionTop);

            if (caixas[coluna - 1][linha].id == 1) {
                if (caixas[coluna - 1][linha].hasKey && chave == undefined) {
                    chave = new Chave(
                        gSpriteSheets["assets/trapdoor.png"],
                        x,
                        y - 47
                    );

                    chaves.push(chave);

                    tocarAudio(somChave);
                } else if (caixas[coluna - 1][linha].hasPowerUp) {
                    let powerup = new PowerUp(
                        gSpriteSheets["assets/powers.png"],
                        x,
                        y - 47,
                        caixas[coluna - 1][linha].powerUpName
                    );
                    powers.push(powerup);
                }
                caixas[coluna - 1][linha].destroyed = true
            }
        }

    }
}
//                          ATUALIZAR AS IMAGENS DAS CAIXAS
function updateBoxImg() {
    for (let row = 0; row < caixas.length; row++) {
        for (let col = 0; col < caixas[row].length; col++) {
            if (caixas[row][col].id == 2 || stop) continue;
            caixas[row][col].update();
        }
    }
}
//                          ADICIONAR COLISÕES ÀS CAIXAS
function addBoxColisions() {
    for (let row = 0; row < caixas.length; row++) {
        for (let column = 0; column < caixas[row].length; column++) {
            if (caixas[row][column].id == undefined || caixas[row][column].id == null) continue;
            if (
                caixas[row][column].id == 2 ||
                caixas[row][column].isDead || caixas[row][column].id == 4 ||
                caixas[row][column].id === 3
            ) {
                continue;
            }

            for (let i = 0; i < entities.length; i++) {
                blockRectangle(entities[i], caixas[row][column]);
                if (entities[i] !== player) {
                    if (entities[i].collisionSide === "none");
                    verificaColisao(entities[i], caixas[row][column]);
                }
            }
        }
    }
}
//                          ADICIONAR COLISÕES ÀS BOMBAS
function addBombColisions() {
    for (let row = 0; row < bombas.length; row++) {
        for (let i = 0; i < entities.length; i++) {
            if (!verificaColisao(entities[i], bombas[row])) {
                blockRectangle(entities[i], bombas[row]);
            }
        }
    }
}
//                          FUNÇÃO DE ADICIONAR COLISÕES
function blockRectangle(r1, r2) {
    //Indica o lado da colisão
    var collisionSide = "";

    //Calcula o vetor de distância
    var vx = r1.getCenterX() - r2.getCenterX() - 12;
    var vy = r1.getCenterY() - r2.getCenterY();

    //Figure out the combined half-widths and half-heights
    var combinedHalfWidths = r1.getHalfWidth() + r2.getHalfWidth();
    var combinedHalfHeights = r1.getHalfHeight() + r2.getHalfHeight();

    //Check whether vx is less than the combined half widths
    if (Math.abs(vx) < combinedHalfWidths) {
        //A collision might be occurring!
        //Check whether vy is less than the combined half heights
        if (Math.abs(vy) < combinedHalfHeights) {
            //A collision has occurred! This is good!
            //Find out the size of the overlap on both the X and Y axes
            var overlapX = combinedHalfWidths - Math.abs(vx);
            var overlapY = combinedHalfHeights - Math.abs(vy);

            //The collision has occurred on the axis with the
            //*smallest* amount of overlap. Let's figure out which
            //axis that is

            if (overlapX >= overlapY) {
                //The collision is happening on the X axis
                //But on which side? vy can tell us
                if (vy > 0) {
                    collisionSide = "top";

                    //Move the rectangle out of the collision
                    r1.y = r1.y + overlapY;
                } else {
                    collisionSide = "bottom";

                    //Move the rectangle out of the collision
                    r1.y = r1.y - overlapY;
                }
            } else {
                //The collision is happening on the Y axis
                //But on which side? vx can tell us
                if (vx > 0) {
                    collisionSide = "left";

                    //Move the rectangle out of the collision
                    r1.x = r1.x + overlapX;
                } else {
                    collisionSide = "right";

                    //Move the rectangle out of the collision
                    r1.x = r1.x - overlapX;
                }
            }

            r1.collisionSide = collisionSide;
            r1.collisionWith = r2;
        } else {
            //No collision
            collisionSide = "none";
        }
    } else {
        //No collision
        collisionSide = "none";
    }
    return collisionSide;
}
//                          FUNÇÃO DE VERIFICAR SE EXISTEM COLISÕES
function verificaColisao(entidade, objeto) {
    hit = false;
    let explosionEsq = objeto.x;
    let explosionDrt = objeto.x + objeto.width - 1;
    let explosionCima = objeto.y;
    let explosionBaixo = objeto.y + objeto.height - 1;

    var playerEsq = entidade.x + entidade.width / 2 + 10;
    var playerCima = entidade.y + entidade.height / 2 + 10;
    var playerDrt = entidade.x + entidade.width / 2 - 10;
    var playerBaixo = entidade.y + entidade.height / 2 - 10;

    if (
        playerEsq >= explosionEsq &&
        playerDrt <= explosionDrt &&
        playerCima >= explosionCima &&
        playerBaixo <= explosionBaixo
    ) {
        hit = true;
    } else {
        hit = false;
    }

    return hit;
}
//                          RENDERIZAR AS IMAGENS
function render() {
    // Apagar o canvas
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

    // completar
    // percorrer todas as entidades e desenhar
    drawingSurface.save();

    //Carregar TRAPDOORS
    for (let row = 0; row < caixas.length; row++) {
        for (let col = 0; col < caixas[row].length; col++) {
            var caixa = caixas[row][col];

            if (caixa.id === undefined) return;

            if (caixa.id == 3 || caixa.id == 4) {

                var sprite = caixa.getSprite();

                drawingSurface.drawImage(
                    caixa.spriteSheet.img,
                    sprite.x,
                    sprite.y,
                    sprite.width,
                    sprite.height,
                    caixa.x,
                    caixa.y,
                    50,
                    50
                );

                drawingSurface.restore();
            }
        }
    }

    //Carregar bombas
    for (let row = 0; row < bombas.length; row++) {
        var bomba = bombas[row];

        if (!bomba.active || bomba.killed) {
            bombas.splice(row, 1);
            continue;
        }

        drawingSurface.drawImage(
            bomba.spriteSheet.img,
            bomba.getSprite().x,
            bomba.getSprite().y,
            bomba.getSprite().width,
            bomba.getSprite().height,
            bomba.x + 10,
            bomba.y + 7,
            bomba.width,
            bomba.height
        );

        drawingSurface.restore();
    }

    //Carregar Chave

    for (let row = 0; row < chaves.length; row++) {
        var chaveT = chaves[row];

        if (chaveT != null) {
            drawingSurface.drawImage(
                chaveT.spriteSheet.img,
                chaveT.getSprite().x,
                chaveT.getSprite().y,
                chaveT.getSprite().width,
                chaveT.getSprite().height,
                chaveT.x + 10,
                chaveT.y + 7,
                chaveT.width,
                chaveT.height
            );

            drawingSurface.restore();
        }
    }

    //Carregar Powerups
    for (let row = 0; row < powers.length; row++) {
        var power = powers[row];

        if (power != null) {
            drawingSurface.drawImage(
                power.spriteSheet.img,
                power.getSprite().x,
                power.getSprite().y,
                power.getSprite().width,
                power.getSprite().height,
                power.x,
                power.y,
                power.width,
                power.height
            );

            drawingSurface.restore();
        }
    }

    //Carregar Caixas
    for (let row = 0; row < caixas.length; row++) {
        for (let col = 0; col < caixas[row].length; col++) {
            var caixa = caixas[row][col];

            caixa.x = col * 50;
            caixa.y = row * 50;
            caixa.row = row;
            caixa.col = col;

            if (caixa == undefined || caixa.id == 2) continue;
            if (caixa.id == 3 || caixa.id == 4) continue;

            if (!caixa.active) {
                caixa.gameTimer.stop();
                caixas[row][col] = new Caixa(
                    gSpriteSheets["assets/boxes.png"],
                    "BLANK", true, undefined, "", 2
                );
            }

            var sprite = caixa.getSprite();

            drawingSurface.drawImage(
                caixa.spriteSheet.img,
                sprite.x,
                sprite.y,
                sprite.width,
                sprite.height,
                caixa.x,
                caixa.y,
                50,
                50
            );

            drawingSurface.restore();
        }
    }

    //Carregar Explosões
    for (let row = 0; row < explosions.length; row++) {
        var fire = explosions[row];
        if (!fire.active || fire.killed) {
            explosions.splice(row, 1);
            continue;
        }

        drawingSurface.drawImage(
            fire.spriteSheet.img,
            fire.getSprite().x,
            fire.getSprite().y,
            fire.getSprite().width,
            fire.getSprite().height,
            fire.x,
            fire.y,
            fire.width,
            fire.height
        );
        drawingSurface.restore();
    }

    //Carregar entidades
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var sprite = entities[i].getSprite();

        // drawingSurface.scale(entity.flipH, 1); // faz o mirror

        if (!entity.killed && entity.active) {
            drawingSurface.drawImage(
                entity.spriteSheet.img,
                sprite.x,
                sprite.y,
                sprite.width,
                sprite.height,
                entity.x,
                entity.y,
                entity.width,
                entity.height
            );
        } else {
            entities.splice(i, 1);
        }

        drawingSurface.restore();
    }
}

function resetCanvas() {
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);
}