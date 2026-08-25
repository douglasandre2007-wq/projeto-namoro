// Lista para guardar todos os intervalos e temporizadores ativos
let temporizadoresAtivos = [];

const bichosConfig = {
    'Cueio': { 
        andando: 'assets/coelho-andando.gif', 
        parado: 'assets/coelho-parado.gif', 
        acoes: ['assets/coelho-interagindo.gif', 'assets/coelho-fala.gif', 'assets/coelho-pega.gif', 'assets/coelho-pisca.gif'],
        sons: ['assets/coelho-som-interacao.mp3', 'assets/coelho-som-fala.mp4', 'assets/coelho-som-pega.mp3']
    },
    'Bimbolho': { 
        andando: 'assets/cachorro-andando.gif', 
        parado: 'assets/cachorro-parado.gif', 
        acoes: ['assets/cachorro-interagindo.gif', 'assets/cachorro-latindo.gif', 'assets/cachorro-ruivando.gif','assets/cachorro-mijo.gif','assets/cachorro-amor.gif'],
        sons: ['assets/cachorro-som-interacao.m4a', 'assets/cachorro-som-latido.mp3','assets/cachorro-som-ruivando.mp3','assets/cachorro-som-mijo.mp3','assets/cachorro-som-amor.mp3']
    },
    'Domdom': { 
        andando: 'assets/esquilo-andando.gif', 
        parado: 'assets/esquilo-parado.gif', 
        acoes: ['assets/esquilo-interagindo.gif', 'assets/esquilo-nariz.gif'],
        sons: ['assets/esquilo-som-interacao.mp3', 'assets/esquilo-som-comendo.mp3']
    }
};

/*BOTOES DO MENU PETS*/

let cliquesMenu = 0;
let temporizadorClique;

// Controla o clique simples (abre) e duplo (fecha) no botão do menu
function toggleMenuLateral() {
    cliquesMenu++;
    
    if (cliquesMenu === 1) {
        temporizadorClique = setTimeout(() => {
            // Se foi apenas 1 clique, alterna o estado atual
            const menu = document.getElementById('menu-lateral');
            menu.classList.toggle('menu-aberto');
            cliquesMenu = 0;
        }, 250); // Tempo de espera para diferenciar duplo clique
    } else if (cliquesMenu === 2) {
        // Se foram 2 cliques seguidos, força o fechamento imediato
        clearTimeout(temporizadorClique);
        const menu = document.getElementById('menu-lateral');
        menu.classList.remove('menu-aberto');
        cliquesMenu = 0;
    }
}

// Alternar som ligado/desligado
function alternarSom() {
    const musica = document.getElementById('musica-ambiente');
    const iconeSom = document.getElementById('icone-som');

    if (!musica || !iconeSom) return;

    if (musica.paused) {
        musica.play();
        iconeSom.src = 'assets/nota-musical.png'; // Imagem com o som ativado
    } else {
        musica.pause();
        iconeSom.src = 'assets/nota-bloqueada.png'; // Imagem com o som mudo/bloqueado
    }
}

// Lista com os seus 5 cenários (substitua os nomes e caminhos pelas suas imagens reais)
const cenarios = [
    { nome: "Floresta Ensolarada ", imagem: "assets/cenario-floresta.avif" },
    { nome: "floresta Mágica", imagem: "assets/cenario-jardim.png" },
    { nome: "Templo Junga", imagem: "assets/cenario-tumba.png" },
    { nome: "Praia Antiga", imagem: "assets/cenario-praia.png" },
    { nome: "Casinha Aconchegante", imagem: "assets/cenario-casa.png" }
];

let indiceCenarioAtual = 0;

function mudarCenario(direcao) {
    // Altera o índice com base na seta clicada (-1 para esquerda, 1 para direita)
    indiceCenarioAtual += direcao;

    // Faz a listinha dar a volta se passar do primeiro ou do último
    if (indiceCenarioAtual < 0) {
        indiceCenarioAtual = cenarios.length - 1; // Vai para o último
    } else if (indiceCenarioAtual >= cenarios.length) {
        indiceCenarioAtual = 0; // Volta para o primeiro
    }

    atualizarCenarioVisual();
}

function atualizarCenarioVisual() {
    const cenarioAtual = cenarios[indiceCenarioAtual];
    
    const visor = document.getElementById('visor-cenario');
    if (visor) {
        visor.innerText = cenarioAtual.nome;
    }
    
    const ambientePets = document.getElementById('mundinho');
    if (ambientePets) {
        ambientePets.style.backgroundImage = `url('${cenarioAtual.imagem}')`;
        ambientePets.style.backgroundSize = cenarioAtual.tamanho;
        ambientePets.style.height = '100vh';
        ambientePets.style.backgroundPosition = cenarioAtual.posicao; // <-- Aqui puxa a posição específica da constante!
        ambientePets.style.width = '100vw';
        ambientePets.style.position = 'relative';
    }
}
// Ação de soltar a ração (física de cair no chão e pet ir comer)
function soltarRacao() {
    const area = document.getElementById('area-jogo-pets');
    
    // Cria o elemento visual da ração
    const racao = document.createElement('div');
    racao.innerText = '🦴';
    racao.style.position = 'absolute';
    racao.style.bottom = '800px'; // Ponto de partida (no alto ou descendo)
    racao.style.left = Math.random() * 80 + '%';
    racao.style.fontSize = '24px';
    racao.style.transition = 'bottom 1s ease-in'; // Animação de queda
    
    area.appendChild(racao);
    
    // Simula a física da ração caindo até o chão
    setTimeout(() => {
        racao.style.bottom = '70px'; // Altura do chão na tela
    }, 50);

    // Simula o pet indo até lá e a barra de fome subindo
    setTimeout(() => {
        racao.remove(); // O pet comeu a ração
        aumentarBarraFome();
    }, 1500);
}




function aumentarBarraFome() {
    let barraFome = document.getElementById('fome-pet1');
    barraFome.style.width = '100%'; // Enche a fome ao comer a ração
    
}

// --- Funções de Som e Bichos ---

function tocarSom(caminho) {
    if (caminho) {
        const audio = new Audio(caminho);
        audio.className = 'som-bicho';
        audio.play().catch(e => console.log("Som bloqueado"));
    }
}

function iniciarBichos() {
    document.querySelectorAll('.bichinho').forEach(bichoEl => {
        let estaAndando = false;
        let interagindo = false;
        const config = bichosConfig[bichoEl.id];
        if (!config) return;

        let intervalID = setInterval(() => {
            if (interagindo || estaAndando) return;
            if (Math.random() > 0.3) {
                estaAndando = true;
                let novaPosicao = Math.random() * (window.innerWidth - 180);
                let rect = bichoEl.getBoundingClientRect();
                let duracao = Math.abs(novaPosicao - rect.left) / 100;
                bichoEl.style.transition = `left ${duracao}s linear`;
                bichoEl.style.transform = (novaPosicao < rect.left) ? 'scaleX(-1)' : 'scaleX(1)';
                bichoEl.src = config.andando;
                bichoEl.style.left = novaPosicao + 'px';
                let timeoutMove = setTimeout(() => { bichoEl.src = config.parado; estaAndando = false; }, duracao * 1000);
                temporizadoresAtivos.push(timeoutMove);
            } else {
                let i = Math.floor(Math.random() * (config.acoes.length - 1)) + 1;
                bichoEl.src = config.acoes[i];
                tocarSom(config.sons[i]);
                let tempoEspera = config.acoes[i].includes('pega') ? 4000 : 2000;
                let timeoutAcao = setTimeout(() => { if (!interagindo) bichoEl.src = config.parado; }, tempoEspera);
                temporizadoresAtivos.push(timeoutAcao);
            }
        }, 4000 + Math.random() * 3000);
        temporizadoresAtivos.push(intervalID);

        bichoEl.addEventListener('click', () => {
            interagindo = true;
            bichoEl.src = config.acoes[0];
            tocarSom(config.sons[0]);
            let timeoutClick = setTimeout(() => { bichoEl.src = config.parado; interagindo = false; }, 2000);
            temporizadoresAtivos.push(timeoutClick);
        });
    });
}


 

// --- Funções de Modal e Navegação ---

function abrirModal(src) {
    const modal = document.getElementById('modal-foto');
    const imgAmpliada = document.getElementById('imagem-ampliada');
    imgAmpliada.src = src;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-foto').style.display = 'none';
}

function abrirGibi() {
    document.getElementById('tela-cartas').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('tela-musica').style.display = 'none';
    document.getElementById('tela-gibi').style.display = 'block';

    carregarFotosAutomaticamente();
}

function entrarNaMusica() {
     document.getElementById('tela-gibi').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('tela-musica').style.display = 'block';
    document.getElementById('tela-cartas').style.display = 'none';

    iniciarContadorNamoro();
}

function entrarNaCarta() {
     document.getElementById('mundinho').style.display = 'none';
    document.getElementById('tela-gibi').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('tela-cartas').style.display = 'block';

}
function entrarNoPortal() {
    document.getElementById('tela-cartas').style.display = 'none';
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('mundinho').style.display = 'block';
    const musica = document.getElementById('musica-ambiente');
    musica.play().catch(e => console.log("Áudio aguardando interação"));
    
    if (document.querySelectorAll('.bichinho').length === 0) {
        Object.keys(bichosConfig).forEach(nome => {
            const img = document.createElement('img');
            img.id = nome;
            img.className = 'bichinho';
            img.src = bichosConfig[nome].parado;
            img.style.left = Math.random() * 80 + '%';
            document.getElementById('mundinho').appendChild(img);
        });
        iniciarBichos();
    }

    const audioFundo = document.getElementById('musica-fundo');
    audioFundo.pause();
}

function voltarAoMenu() {
    console.log("Tentando voltar ao menu..."); // Isso aparecerá no F12 > Console

    // 1. Esconde tudo o que for mundinho ou gibi
    document.getElementById('tela-musica').style.display = 'none';
    document.getElementById('mundinho').style.display = 'none';
    document.getElementById('tela-gibi').style.display = 'none';
    document.getElementById('tela-cartas').style.display = 'none';
    
    // 2. Mostra o menu principal
    document.getElementById('menu-principal').style.display = 'block';

    // 3. Garante que o áudio pare
    const musicaFundo = document.getElementById('musica-ambiente');
    if (musicaFundo) {
        musicaFundo.pause();
        musicaFundo.currentTime = 0;
        console.log("Música parada.");
    }

    // 4. Limpa bichos e temporizadores
    temporizadoresAtivos.forEach(id => { 
        clearTimeout(id); 
        clearInterval(id); 
    });
    temporizadoresAtivos = [];
    
    // Remove os sons e os elementos dos bichinhos
    document.querySelectorAll('.som-bicho').forEach(som => { som.pause(); som.remove(); });
    document.querySelectorAll('.bichinho').forEach(bicho => bicho.remove());
    
    console.log("Limpeza concluída.");

     const audioFundo = document.getElementById('musica-fundo');
    audioFundo.play().catch(e => console.log(e));
}


/*PARTE DA GALERIA DE FOTOS*/

const API_URL = "https://script.google.com/macros/s/AKfycbxQ9iw-h1hdHrinSGotFFJVfhJFAcyQGRdqt7ujjB8BliV7gh1pmXYGwDy_gaMVSZhnHg/exec";

async function carregarFotosAutomaticamente() {
    try {
        const resposta = await fetch(API_URL);
        const listaDeArquivos = await resposta.json();
        
        const galeria = document.getElementById('galeria-gibi');
        galeria.innerHTML = ""; // Limpa a galeria antes de desenhar
        
        listaDeArquivos.forEach(item => {
            const container = document.createElement('div');
            container.className = 'quadrinho';
            
            // Descobre se o item é um objeto (novo formato) ou uma string (antigo)
            const urlArquivo = (typeof item === 'object' && item !== null) ? item.url : item;
            const tipoArquivo = (typeof item === 'object' && item !== null) ? item.tipo : 'image';
            
            if (tipoArquivo === 'video') {
                const video = document.createElement('video');
                video.src = urlArquivo;
                video.className = 'minhasFotos';
                video.muted = true;
                video.controls = true;      // Mostra os controles de play/pause
                video.preload = "metadata";
                
                // Impede que o clique no player abra o modal por engano
                video.onclick = (e) => {
                    e.stopPropagation();
                };

                container.appendChild(video);
                
                // Clique no container (fora dos controles) abre o modal do vídeo com segurança
                container.onclick = (e) => {
                    if (e.target !== video) {
                        abrirModal(urlArquivo);
                    }
                };
            } else {
                const img = document.createElement('img');
                img.src = urlArquivo;
                img.className = 'minhasFotos';
                container.appendChild(img);
                
                container.onclick = () => abrirModal(urlArquivo);
            }
            
            galeria.appendChild(container);
        });

        if (typeof atualizarBarraArmazenamento === 'function') {
            atualizarBarraArmazenamento(listaDeArquivos.length);
        }

    } catch (erro) {
        console.error("Erro ao buscar arquivos na nuvem:", erro);
    }
}


// Função para fazer a barra de armazenamento crescer dinamicamente (base 15 GB)
function atualizarBarraArmazenamento(quantidadeTotal) {
    const textoContador = document.getElementById('texto-contador');
    const barraProgresso = document.getElementById('barra-armazenamento');

    if (!textoContador || !barraProgresso) return;

    // Estimativa de tamanho por foto (0.003 GB por imagem)
    const gigasPorFoto = 0.003; 
    const gigasTotaisDrive = 15;
    
    let gigasUsados = (quantidadeTotal * gigasPorFoto);
    if (gigasUsados > gigasTotaisDrive) {
        gigasUsados = gigasTotaisDrive;
    }

    // Calcula a porcentagem real baseada nos 15 GB
    let porcentagem = (gigasUsados / gigasTotaisDrive) * 100;
    if (quantidadeTotal > 0 && porcentagem < 2) {
        porcentagem = 2; // Garante um tamanho mínimo visível para a barra
    }

    // O texto mostra apenas o número de fotos e a frase fofa (sem os GB)
    textoContador.innerText = `${quantidadeTotal} fotos guardadas com muito amor ❤️`;
    
    // A barrinha continua se baseando milimetricamente no espaço de 15 GB
    barraProgresso.style.width = `${porcentagem}%`;
}

//AREA DAS MUSICAS//

let indiceSecaoAtual = 0;

function mudarSecao(direcao) {
    const trilho = document.getElementById('carrossel-trilho');
    const totalItens = trilho.children.length;

    indiceSecaoAtual += direcao;

    // Faz o carrossel dar a volta se passar do último ou voltar do primeiro
    if (indiceSecaoAtual < 0) {
        indiceSecaoAtual = totalItens - 1;
    } else if (indiceSecaoAtual >= totalItens) {
        indiceSecaoAtual = 0;
    }

    const deslocamento = -indiceSecaoAtual * 100;
    trilho.style.transform = `translateX(${deslocamento}%)`;
}

function iniciarContadorNamoro() {
    // ⚠️ Mantenha a data exata do início do namoro
    const dataInicio = new Date('2024-07-28T22:07:54');

    function atualizar() {
        const agora = new Date();
        
        if (agora < dataInicio) {
            const el = document.getElementById('contador-namoro');
            if (el) el.innerHTML = "<p>Ainda vai começar! ❤️</p>";
            return;
        }

        // Cálculo exato de Anos, Meses e Dias civis
        let anos = agora.getFullYear() - dataInicio.getFullYear();
        let meses = agora.getMonth() - dataInicio.getMonth();
        let dias = agora.getDate() - dataInicio.getDate();

        if (dias < 0) {
            meses--;
            // Pega o número de dias do mês anterior para acertar o saldo de dias
            const ultimoDiaMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
            dias += ultimoDiaMesAnterior;
        }

        if (meses < 0) {
            anos--;
            meses += 12;
        }

        // Cálculo das horas, minutos e segundos restantes
        const diferencaMilissegundos = agora - new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), dataInicio.getHours(), dataInicio.getMinutes(), dataInicio.getSeconds());
        
        const segundosTotais = Math.floor((agora - dataInicio) / 1000);
        const minutosTotais = Math.floor(segundosTotais / 60);
        const horasTotais = Math.floor(minutosTotais / 60);

        const horas = horasTotais % 24;
        const minutos = minutosTotais % 60;
        const segundos = segundosTotais % 60;

        // Atualiza os elementos na tela
        const elAnos = document.getElementById('c-anos');
        const elMeses = document.getElementById('c-meses');
        const elDias = document.getElementById('c-dias');
        const elHoras = document.getElementById('c-horas');
        const elMinutos = document.getElementById('c-minutos');
        const elSegundos = document.getElementById('c-segundos');

        if (elAnos) elAnos.innerText = anos;
        if (elMeses) elMeses.innerText = meses;
        if (elDias) elDias.innerText = dias;
        if (elHoras) elHoras.innerText = horas;
        if (elMinutos) elMinutos.innerText = minutos < 10 ? '0' + minutos : minutos;
        if (elSegundos) elSegundos.innerText = segundos < 10 ? '0' + segundos : segundos;
    }

    setInterval(atualizar, 1000);
    atualizar();
}



// Adiciona o gatilho inicial para burlar o bloqueio de autoplay dos navegadores
document.addEventListener('click', iniciarMusicaGlobal, { once: true });

// Quando entra no mundo dos pets: PAUSA a música
function entrarMundoPets() {
    const audioFundo = document.getElementById('musica-fundo');
    audioFundo.pause();
    
    // ... restante do seu código para abrir a tela dos pets ...
}

// Quando sai do mundo dos pets: VOLTA A TOCAR de onde parou
function sairMundoPets() {
    const audioFundo = document.getElementById('musica-fundo');
    audioFundo.play().catch(e => console.log(e));
    
    // ... restante do seu código para voltar ao menu ...
}



// Lista completa com as músicas, artistas e capas correspondentes
const playlist = [
    {
        titulo: "Palpite",
        artista: "Vanessa Rangel",
        src: "assets/palpite.mp3",
        capa: "assets/palpite.jpg"
    },
    {
        titulo: "Tiro Ao Álvaro",
        artista: "Elis Regina",
        src: "assets/tiro-ao-alvaro.mp3",
        capa: "assets/tiro-ao-alvaro.jpg"
    },
    {
        titulo: "Será Que é Amor",
        artista: "Arlindo Cruz",
        src: "assets/sera-que-e-amor.mp3",
        capa: "assets/sera-que-e-amor.avif"
    },
    {
        titulo: "Send My Love",
        artista: "Adele",
        src: "assets/send-my-love.mp3",
        capa: "assets/send-my-love.jpg"
    },
    {
        titulo: "Preciosa (Interlúdio)",
        artista: "Nanda Tsunami",
        src: "assets/preciosa-interlúdio.mp3",
        capa: "assets/preciosa.jpg"
    },
    {
        titulo: "Mania de Você",
        artista: "Rita Lee",
        src: "assets/mania-de-voce.mp3",
        capa: "assets/mania-de-voce.jpg"
    },
    {
        titulo: "Faço Acontecer",
        artista: "Nanda Tsunami",
        src: "assets/faco-acontecer.mp3",
        capa: "assets/faco-acontecer.jpg"
    },
    {
        titulo: "Disritmia",
        artista: "Casuarina",
        src: "assets/disritmia.mp3",
        capa: "assets/disritmia.jpg"
    },
    {
        titulo: "Bem-Me-Quer",
        artista: "Rita Lee",
        src: "assets/bem-me-quer.mp3",
        capa: "assets/bem-me-quer.jpg"
    },
    {
        titulo: "Beija Eu",
        artista: "Marisa Monte",
        src: "assets/beija-eu.mp3",
        capa: "assets/beija-eu.jpg"
    }
    
];

let indiceMusicaAtual = 0;
const audioFundo = document.getElementById('musica-fundo');

// Elementos visuais do card estilo Spotify
const imgCapa = document.getElementById('spotify-capa');
const txtTitulo = document.getElementById('spotify-titulo');
const txtArtista = document.getElementById('spotify-artista');
const btnPlayPause = document.getElementById('botao-play-pause');
const barraProgresso = document.getElementById('barra-progresso1');
const tempoAtualEl = document.getElementById('tempo-atual');
const tempoTotalEl = document.getElementById('tempo-total');
const sliderVolume = document.getElementById('slider-volume');

// Função para atualizar os dados visuais no card
function atualizarVisualCard() {
    const musica = playlist[indiceMusicaAtual];
    if (imgCapa) imgCapa.src = musica.capa;
    if (txtTitulo) txtTitulo.innerText = musica.titulo;
    if (txtArtista) txtArtista.innerText = musica.artista;
}

// Função para iniciar o sistema de música ao primeiro clique na página
function iniciarMusicaGlobal() {
    if (audioFundo.paused && audioFundo.currentTime === 0) {
        tocarMusicaAleatoria();
    }
}

// Escolhe e toca uma música aleatória
function tocarMusicaAleatoria() {
    if (playlist.length === 0) return;
    
    // Sorteia um índice aleatório
    indiceMusicaAtual = Math.floor(Math.random() * playlist.length);
    audioFundo.src = playlist[indiceMusicaAtual].src;
    
    // Atualiza o card com a música sorteada
    atualizarVisualCard();
    
    audioFundo.play()
        .then(() => {
            if (btnPlayPause) btnPlayPause.innerText = "⏸";
        })
        .catch(e => console.log("Aguardando interação para tocar áudio."));
}

// Botão Play/Pause do card (integra com a música global)
function alternarPlayPause() {

   

    if (audioFundo.paused) {
        audioFundo.play().then(() => {
            if (btnPlayPause) btnPlayPause.innerText = "⏸";
        });
    } else {
        audioFundo.pause();
        if (btnPlayPause) btnPlayPause.innerText = "▶";
    }

}

// Avançar ou voltar pelas setinhas do card
function mudarMusica(direcao) {
    indiceMusicaAtual += direcao;
    
    if (indiceMusicaAtual < 0) {
        indiceMusicaAtual = playlist.length - 1;
    } else if (indiceMusicaAtual >= playlist.length) {
        indiceMusicaAtual = 0;
    }

    audioFundo.src = playlist[indiceMusicaAtual].src;
    atualizarVisualCard();
    
    audioFundo.play().then(() => {
        if (btnPlayPause) btnPlayPause.innerText = "⏸";
    });


}

// Quando a música acaba, toca outra aleatória automaticamente
audioFundo.addEventListener('ended', () => {
    tocarMusicaAleatoria();
});

// Permite trocar a música manualmente (seção de fotos ou setinhas)
function proximaMusica() {
    mudarMusica(1);
}

// Atualizar tempo e barra de progresso em tempo real
audioFundo.addEventListener('timeupdate', () => {
    if (audioFundo.duration && barraProgresso) {
        const progresso = (audioFundo.currentTime / audioFundo.duration) * 100;
        barraProgresso.value = progresso;

        if (tempoAtualEl) tempoAtualEl.innerText = formatarTempo(audioFundo.currentTime);
        if (tempoTotalEl) tempoTotalEl.innerText = formatarTempo(audioFundo.duration);
    }
});

// Arrastar barra de progresso
if (barraProgresso) {
    barraProgresso.addEventListener('input', () => {
        if (audioFundo.duration) {
            audioFundo.currentTime = (barraProgresso.value / 100) * audioFundo.duration;
        }
    });
}

// Controle de volume por arraste (slider)
if (sliderVolume) {
    audioFundo.volume = sliderVolume.value;
    sliderVolume.addEventListener('input', () => {
        audioFundo.volume = sliderVolume.value;
    });
}

// Formatar segundos para o formato de relógio (ex: 3:45)
function formatarTempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

// Adiciona o gatilho inicial para burlar o bloqueio de autoplay dos navegadores
document.addEventListener('click', iniciarMusicaGlobal, { once: true });

// Sorteia a primeira música logo ao carregar para o card não ficar vazio
tocarMusicaAleatoria();
audioFundo.pause(); // Pausa para esperar o clique inicial do usuário, mantendo o card preenchido



//AREA DAS CARTAS//

let indiceCartaAtual = 0;
// Guarda quais cartas já tiveram a senha acertada
const cartasDesbloqueadas = {};

// Função para avançar ou voltar o carrossel pelas setinhas
function mudarCartaCarrossel(direcao) {
    const trilho = document.getElementById('carrossel-trilho-cartas');
    if (!trilho) return;

    const cards = trilho.querySelectorAll('.card-item-carta');
    if (cards.length === 0) return;

    indiceCartaAtual += direcao;

    if (indiceCartaAtual < 0) {
        indiceCartaAtual = cards.length - 1;
    } else if (indiceCartaAtual >= cards.length) {
        indiceCartaAtual = 0;
    }

    trilho.style.transform = `translateX(-${indiceCartaAtual * 100}%)`;
}

// Função para verificar a senha e destravar a carta (mudando para o envelope aberto)
// Função para verificar a senha e destravar a carta
function verificarSenha(numeroCarta, senhaCorreta) {
    const inputElement = document.getElementById(`senha-carta${numeroCarta}`);
    if (!inputElement) return;
    
    const inputDigitado = inputElement.value.trim();

    if (inputDigitado === senhaCorreta) {
        // Força a chave a ser um número para evitar conflitos
        cartasDesbloqueadas[Number(numeroCarta)] = true;

        // Troca a foto do envelope para aberto
        const imgEnvelope = document.getElementById(`img-envelope${numeroCarta}`);
        if (imgEnvelope) {
            imgEnvelope.src = 'assets/envelope-aberto.png';
            imgEnvelope.style.cursor = 'pointer';
            // Garante via código que o evento de clique está ativo
            imgEnvelope.onclick = function() {
                abrirCartaModal(Number(numeroCarta));
            };
        }

        alert('Senha correta! Agora clique na cartinha aberta para ler ❤️');
    } else {
        alert('Senha incorreta, amor! Tente novamente ❤️');
    }
}

// Função para abrir o modal de forma forçada
function abrirCartaModal(numeroCarta) {
    const num = Number(numeroCarta);

    // SÓ ABRE SE A CARTA JÁ TIVER SIDO DESBLOQUEADA COM A SENHA CORRETA
    if (cartasDesbloqueadas[num]) {
        const modal = document.getElementById('modal-carta');
        const imagemAberta = document.getElementById('imagem-carta-aberta');
        
        if (modal && imagemAberta) {
            imagemAberta.src = `assets/carta${num}-digitalizada.jpg`;
            
            // Aplica os estilos para abrir o modal perfeitamente na frente de tudo
            modal.style.cssText = "display: flex !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: rgba(0, 0, 0, 0.9) !important; z-index: 999999 !important; justify-content: center !important; align-items: center !important;";
            
            console.log("Modal aberto com sucesso para a carta:", num);
        }
    } else {
        // Se a senha ainda não foi acertada, avisa e bloqueia o acesso
        alert('Esta carta está trancada! Digite a senha correta e clique em "Abrir" primeiro 🔒❤️');
    }
}

function fecharCartaModal() {
    const modal = document.getElementById('modal-carta');
    if (modal) {
        modal.style.display = 'none';
    }
}
