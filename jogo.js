console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';
const cebola = new Image();
cebola.src = './cebola 5.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

let frames = 0;
const som_HIT = new Audio();
const som_PULO = new Audio();
const som_CAIU = new Audio();
const som_PONTO = new Audio();
const som_PITBULL = new Audio();
som_HIT.src = './hit.wav';
som_CAIU.src = './caiu.wav';
som_PULO.src = './pulo.wav';
som_PONTO.src = './ponto.wav';
som_PITBULL.src = './pitbull.mp3';

function criaChao(){
	// Chao
	const chao = {
		spriteX: 0,
		spriteY: 610,
		largura: 224,
		altura: 112,
		x: 0,
		y: canvas.height - 112, // altura aumenta pra baixo 
		atualiza(){
			const movimentoDoChao = 1;
			const repeteEm = chao.largura/2;
			const movimentacao = chao.x - movimentoDoChao;
			chao.x = movimentacao % repeteEm;
		},
		desenha(){
			contexto.drawImage(
				sprites,
				chao.spriteX, chao.spriteY, // spriteX, spriteY
				chao.largura, chao.altura, // Tamanho da imagem
				chao.x, chao.y, 
				chao.largura, chao.altura,
			);
	
			contexto.drawImage(
				sprites,
				chao.spriteX, chao.spriteY, // spriteX, spriteY
				chao.largura, chao.altura, // Tamanho da imagem
				(chao.x + chao.largura), chao.y, // desenho a segunda parte a partir do fim da primeira
				chao.largura, chao.altura,
			);
		},
	}
	return chao;
}

function criaCanos(){
	// Canos
	const canos = {
		largura: 52,
		altura: 400,
		chao: {
			spriteX: 0,
			spriteY: 169,
		},
		ceu: {
			spriteX: 52,
			spriteY: 169,
		},
		espaco: 80,
		desenha(){
			canos.pares.forEach(function(par){
				const yRandom = -par.y;
				const espacamentoEntreCanos = 150;
				const canoCeuX = par.x;
				const canoCeuY = yRandom ;
				contexto.drawImage(
					sprites,
					canos.ceu.spriteX, canos.ceu.spriteY, // spriteX, spriteY
					canos.largura, canos.altura, // Tamanho da imagem
					canoCeuX, canoCeuY, 
					canos.largura, canos.altura,
				);

				const canoChaoX = par.x;
				const canoChaoY = yRandom + canos.altura + espacamentoEntreCanos ;
				contexto.drawImage(
					sprites,
					canos.chao.spriteX, canos.chao.spriteY, // spriteX, spriteY
					canos.largura, canos.altura, // Tamanho da imagem
					canoChaoX, canoChaoY,
					canos.largura, canos.altura,
				);
				par.canoCeu = {
					x: canoCeuX,
					y: canos.altura + canoCeuY
				}
				par.canoChao = {
					x: canoChaoX,
					y: canoChaoY
				}
			})
		},

		temColisaoComOFlappyBird(par){
			const cabecaDoFlappy = globais.flappyBird.y;
			const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
			if(globais.flappyBird.x >= par.x){				
				if(cabecaDoFlappy <= par.canoCeu.y){
					return true;	
				}
				if(peDoFlappy >= par.canoChao.y){
					return true;	
				}

			}
			return false;
		},

		pares:[],
		atualiza(){
			const passou100Frames = frames % 100 === 0;
			if(passou100Frames){
				canos.pares.push({
					x:canvas.width,
					y:150*(Math.random()+1),
				});	
			}


		
		canos.pares.forEach(function(par){
			par.x = par.x -2;

			if(canos.temColisaoComOFlappyBird(par)){
				som_HIT.play();
				som_PITBULL.pause();
				som_PITBULL.currentTime = 0;
				mudaParaTela(Telas.INICIO);
			}

			if (par.x + canos.largura <= 0){
				som_PONTO.play();
				som_PITBULL.play();
				canos.pares.shift();
			}
		});
		}
	}
	return canos;
}
function criaflappyBird(){
	// FlappyBird
	const flappyBird = {
		spriteX: 0,
		spriteY: 0,
		largura: 40,
		altura: 62,
		x: 10,
		y: 50,
		velocidade: 0,
		gravidade: 0.25,
		pulo: 4.6,
	
		pula(){
			flappyBird.velocidade = - flappyBird.pulo;
			som_PULO.play();
		},
	
		atualiza(){
			if(fazColisao(flappyBird, globais.chao)){
				console.log('Fez colisao');
				som_HIT.play();
				som_PITBULL.pause();
				som_PITBULL.currentTime = 0;
				setTimeout(() => {
					mudaParaTela(Telas.INICIO);
				}, 500);
				return;		
			}

			flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
			// console.log(flappyBird.velocidade);
			flappyBird.y = flappyBird.y + flappyBird.velocidade;
		},

		movimentos:[
			{spriteX: 0, spriteY: 0, },	
			{spriteX: 0, spriteY: 62, },
			{spriteX: 0, spriteY: 124, },
			{spriteX: 0, spriteY: 62, },
		],
		frameAtual: 0,
		atualizaOFrameAtual(){
			const intervaloDeFrames = 100;
			const passouOIntervalo = frames % intervaloDeFrames === 0;

			if(passouOIntervalo){
				const baseDoIncremento = 1;
				const incremento = baseDoIncremento + flappyBird.frameAtual;
				const baseRepeticao = flappyBird.movimentos.length;
				flappyBird.frameAtual = incremento % baseRepeticao
			}
		},
		desenha(){
			flappyBird.atualizaOFrameAtual();
			const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
			contexto.drawImage(
				cebola,
				spriteX, spriteY, // spriteX, spriteY
				flappyBird.largura, flappyBird.altura, // Tamanho da imagem
				flappyBird.x, flappyBird.y, 
				flappyBird.largura, flappyBird.altura,
			);
		},
	}
	return flappyBird;
}



function fazColisao(flappyBird, chao){
	const flappyBirdY = flappyBird.y + flappyBird.altura;
	const chaoY = chao.y;

	if (flappyBirdY >= chaoY){
		return true;
	}
	
	return false;
}

// Plano de Fundo
const fundo = {
	spriteX: 390,
	spriteY: 0,
	largura: 275,
	altura: 204,
	x: 0,
	y: canvas.height - 204, 
	desenha(){
		contexto.fillStyle = '#70c5ce';
		contexto.fillRect(0,0, canvas.width, canvas.height);

		contexto.drawImage(
			sprites,
			fundo.spriteX, fundo.spriteY, // spriteX, spriteY
			fundo.largura, fundo.altura, // Tamanho da imagem
			fundo.x, fundo.y, 
			fundo.largura, fundo.altura,
		);
		contexto.drawImage(
			sprites,
			fundo.spriteX, fundo.spriteY, // spriteX, spriteY
			fundo.largura, fundo.altura, // Tamanho da imagem
			(fundo.x + fundo.largura), fundo.y, // desenho a segunda parte a partir do fim da primeira
			fundo.largura, fundo.altura,
		);
	},
};

const mensagemGetReady = {
	spriteX: 134,
	spriteY: 0,
	largura: 174,
	altura: 152,
	x: (canvas.width/2) - 174/2,
	y: 50,
	desenha(){
		contexto.drawImage(
			sprites,
			mensagemGetReady.spriteX, mensagemGetReady.spriteY, // spriteX, spriteY
			mensagemGetReady.largura, mensagemGetReady.altura, // Tamanho da imagem
			mensagemGetReady.x, mensagemGetReady.y, 
			mensagemGetReady.largura, mensagemGetReady.altura,
		);
	}
};
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela){
	telaAtiva = novaTela;
	if(telaAtiva.inicializa){
		Telas.INICIO.inicializa();
	}
}

const Telas = {
	INICIO: {
		inicializa(){
			globais.flappyBird = criaflappyBird();
			globais.chao = criaChao();
			globais.cano = criaCanos();
		},
		desenha(){
			fundo.desenha();
			globais.chao.desenha();
			globais.flappyBird.desenha();
			mensagemGetReady.desenha();
		},	
		atualiza(){
			globais.chao.atualiza();
		},
		click(){
			mudaParaTela(Telas.JOGO);
		},
	},
	JOGO: {
		desenha(){
			fundo.desenha();
			globais.cano.desenha();
			globais.chao.desenha();
			globais.flappyBird .desenha();	
		},
		click(){	
			globais.flappyBird.pula();
		},
		atualiza(){
			globais.cano.atualiza();
			globais.chao.atualiza();
			globais.flappyBird.atualiza();
		}
	}
};

function loop(){
	telaAtiva.desenha();
	telaAtiva.atualiza();
	frames = frames+1;
	requestAnimationFrame(loop);
	
}

window.addEventListener('click', function(){
	if (telaAtiva.click){
		telaAtiva.click();
	}
});

mudaParaTela(Telas.INICIO);
loop();
