// variáveis do jogo
var canvas, ctx, frames = 0;
var ALTURA, LARGURA, manESCALA = 50;
var fundo, skydriver, man, nuvemModelo, nuvens, intervalNuvens = 30;
var esquerda, direita;

canvas    = document.getElementById('canvas');
direita   = document.getElementById('direita');
esquerda  = document.getElementById('esquerda');

man = new Image();
man.src = "pp.png";

nuvemModelo = new Image();
nuvemModelo.src = "cloud.svg";

nuvens = {
  _nuvens: [],
  tempoInsere: 0,
  insere: function () {
    var _tam = parseInt(98 * Math.random()) + 30;
    this._nuvens.push({
      posX: parseInt(LARGURA * Math.random()) - 50,
      posY: ALTURA,
      tamX: _tam,
      tamY: _tam
    });

    this.tempoInsere = intervalNuvens;
  },
  desenha: function () {
    for (var i = 0, nuvsLenght = this._nuvens.length; i < nuvsLenght; i++) {
      var nuv = this._nuvens[i];
      ctx.drawImage(nuvemModelo, nuv.posX, nuv.posY, nuv.tamX, nuv.tamX);
    }
  },
  sobe: function () {
    if (this.tempoInsere === 0) {
      this.insere();
    } else {
      this.tempoInsere -= 2;
    }

    for (var i = 0, nuvsLenght = this._nuvens.length; i < nuvsLenght; i++) {
      var nuv = this._nuvens[i];

      nuv.posY -= 15;
      nuv.posX += (parseInt(2 * Math.random())) === 0 ? -2 : 1;

      if ((nuv.posY + nuv.tamY) < 0) {
        this._nuvens.splice(i, 1);
        i--;
        nuvsLenght--;
      }
    }
  }

}

skydriver = {
  img: man,
  height: manESCALA,
  width: manESCALA,
  eixoX: -1,
  eixoY: 0,
  speed: 6,
  vaiLeft: false,
  vaiRight: false,

  abaixa: function () {
    this.eixoY += 6;
    var limite = (ALTURA/4);

    if (this.eixoY > limite) {
      this.eixoY = limite;
    }
  },

  desliza: function (lado) {
    switch (lado) {
      case 'esquerda':
        this.vaiRight = false;
        this.vaiLeft = true;
        this.eixoX -= this.speed;
        break;

      case 'direita':
        this.vaiLeft = false;
        this.vaiRight = true;
        this.eixoX += this.speed;
        break;
    }
  },

  desenha: function () {
    if (this.vaiLeft) {
      this.desliza('esquerda');
    } else if (this.vaiRight) {
      this.desliza('direita');
    }
    if (this.eixoX < 0) {
      this.eixoX = 5;
    } else if ((this.eixoX + this.width) > LARGURA) {
      this.eixoX = LARGURA - this.width - 5;
    }
    manIMG.drawImage(this.img, this.eixoX, this.eixoY, this.width, this.height);
  }
};



// roda jogo
function main() {
  ALTURA = window.innerHeight;
  LARGURA = window.innerWidth;

  if (LARGURA > 600) {
    LARGURA = 600;
  }

  canvas.width = LARGURA;
  canvas.height = ALTURA;

  ctx     = canvas.getContext("2d");
  manIMG  = canvas.getContext("2d");
  esquerda.addEventListener("click", clique);
  direita.addEventListener("click", clique);

  skydriver.eixoX = (LARGURA/2) - (manESCALA/2);

  cai();

}; main();



// cai
function cai() {
  atualiza();
  desenha();

  window.requestAnimationFrame(cai);
}



// atualiza frames
function atualiza() {
  frames++;
  skydriver.abaixa();
  nuvens.sobe();
}



// desenha
function desenha() {
  ctx.fillStyle = "rgb(87, 143, 214)";
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  nuvens.desenha();
  man.onload = skydriver.desenha();
}



// clique
function clique() {
  var lado = this.getAttribute("id");
  skydriver.desliza(lado);
}
