const GameTimer = {
    time: 0, //
    interval: undefined, // intervalo em cada chamada (em msegudos)
    notify: undefined, // fun��o externa a chamar quando terminar a contagem
    /*sound: undefined, // som a tocar em cada tick()
    heartSound: undefined, // som do cora��o a tocar passados x segundos [suspense :) ]*/
    iHandler: undefined, // handler para o intervalo
    // fun��o de configura��o
    running: false,

    setup: function (time, interval, notify) {
        this.time = time;
        this.interval = interval;
        this.notify = notify;
    },

    // inicia a contagem decrescente
    start: function () {
        this.iHandler = setInterval(function () {
            this.tick();
            this.running = true;

        }.bind(this), this.interval);
    },
    // executa a l�gica para cada intervalo
    tick: function () {

        // suspense quando faltarem 10 segundos para o fim	
        /*  if (this.time < 10)
            if (this.heartSound != null || this.heartSound != undefined) //s� toca o som se estiver carregado
                if (this.heartSound.paused) this.heartSound.play();

        if (this.sound != undefined || this.sound != null)
            this.sound.play(); // toca o som em cada chamada
*/
        if (this.time > 0) this.time--;
        else {
            this.notify(); // terminou o tempo. chamar a func��o externa associada
            this.stop(); //parar o intervalo;
            this.reset(); // fazer o reset do tempo
        }

    },
    // para a contagem
    stop: function () {
        clearInterval(this.iHandler);
        this.running = false;

    },

    reset: function () {
        this.time = 0;
    }
};