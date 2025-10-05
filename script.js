// script.js (VERSÃO CORRIGIDA E MELHORADA)

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELEÇÃO DOS ELEMENTOS DO HTML ---
  const gameContainer = document.getElementById("game-container");
  const objectivePanel = document.getElementById("objective-panel");
  const questionUI = document.getElementById("question-ui");
  const questionText = document.getElementById("question-text");
  const answerOptions = document.getElementById("answer-options");
  const resultScreen = document.getElementById("result-screen");
  const courseImage = document.getElementById("course-image");
  const etecLogo = document.getElementById("etec-logo");
  const strongPointsList = document.getElementById("strong-points");
  const restartButton = document.getElementById("restart-button");
  const viewAllResultsButton = document.getElementById(
    "view-all-results-button"
  );

  const clickSound = new Audio("./assets/sounds/click.wav");
  const unlockSound = new Audio("./assets/sounds/unlock.wav");
  const passwordSound = new Audio("./assets/sounds/password.wav");
  const objectiveNewSound = new Audio("./assets/sounds/objective_new.wav");
  const objectiveCompleteSound = new Audio(
    "./assets/sounds/objective_complete.wav"
  );

  // --- 2. MAPEAMENTO DE CURSOS E DETALHES ---
  const courses = {
    ds: "Desenvolvimento de Sistemas",
    inf: "Informática para Internet",
    seg: "Segurança do Trabalho",
    adm: "Administração",
    mkt: "Marketing",
    rh: "Recursos Humanos",
    log: "Logística",
    cex: "Comércio Exterior",
    jur: "Serviços Jurídicos",
    enf: "Enfermagem",
    cui: "Cuidados de Idosos",
  };
  const courseDetails = {
    ds: {
      title: "Perfil: O Arquiteto de Sistemas",
      description:
        "Você tem uma mente lógica e gosta de construir soluções eficientes para problemas complexos. Seu raciocínio analítico é a chave para inovar.",
      image:
        "https://blog.xpeducacao.com.br/wp-content/uploads/2022/12/diferenca-entre-sistema-de-informaca-e-analise-e-desenvolvimento-de-sistema.jpg",
      strongPoints: [
        "Raciocínio lógico",
        "Resolução de problemas",
        "Inovação tecnológica",
        "Atenção aos detalhes",
      ],
    },
    inf: {
      title: "Perfil: O Solucionador Digital",
      description:
        "Você é prático e rápido para resolver problemas técnicos, fazendo a tecnologia funcionar a seu favor. Adaptabilidade é seu ponto forte.",
      image: "https://www.icursos.com.br/images/curso_21_topo.jpg",
      strongPoints: [
        "Pensamento rápido",
        "Adaptabilidade digital",
        "Manutenção de redes",
        "Suporte técnico",
      ],
    },
    seg: {
      title: "Perfil: O Protetor",
      description:
        "Você tem um olhar atento para riscos e normas, garantindo a segurança e o bem-estar de todos. Prevenção é sua prioridade.",
      image:
        "https://www.extraconsult.com.br/wp-content/uploads/2024/04/11_blog.png",
      strongPoints: [
        "Prevenção de riscos",
        "Cumprimento de normas",
        "Atenção à segurança",
        "Organização",
      ],
    },
    adm: {
      title: "Perfil: O Estrategista",
      description:
        "Você tem talento para organizar, liderar e planejar, transformando ideias em realidade. Sua visão sistêmica impulsiona o sucesso.",
      image:
        "https://napratica.org.br/wp-content/uploads/2018/09/curso-de-administra%C3%A7%C3%A3o.jpg",
      strongPoints: [
        "Liderança",
        "Planejamento estratégico",
        "Organização",
        "Tomada de decisão",
      ],
    },
    mkt: {
      title: "Perfil: O Comunicador",
      description:
        "Você sabe como criar mensagens impactantes e conectar ideias com o público certo. Sua criatividade e persuasão geram resultados.",
      image:
        "https://cloudinary.hbs.edu/hbsit/image/upload/s--jcW2HPqC--/f_auto,c_fill,h_375,w_750,/v20200101/EA99CC738B99D0AA67987EC2976D550F.jpg",
      strongPoints: [
        "Criatividade",
        "Comunicação eficaz",
        "Persuasão",
        "Análise de mercado",
      ],
    },
    rh: {
      title: "Perfil: O Mediador",
      description:
        "Você entende de pessoas, sabe como motivar e resolver conflitos para construir equipes fortes. O bem-estar coletivo é sua missão.",
      image:
        "https://startupi.com.br/wp-content/uploads/2023/01/Design-sem-nome-2023-01-13T150816.940.jpg",
      strongPoints: [
        "Empatia",
        "Resolução de conflitos",
        "Comunicação interpessoal",
        "Desenvolvimento de equipes",
      ],
    },
    log: {
      title: "Perfil: O Otimizador",
      description:
        "Você enxerga processos e encontra as melhores rotas e métodos para que tudo funcione com eficiência. Sua mente prática evita desperdícios.",
      image:
        "https://patrus.com.br/wp-content/uploads/2017/03/118130-estender-1k-saiba-qual-a-importancia-da-logistica-para-o-crescimento-da-empresa.jpg",
      strongPoints: [
        "Otimização de processos",
        "Planejamento de rotas",
        "Análise de custos",
        "Eficiência operacional",
      ],
    },
    cex: {
      title: "Perfil: O Conector Global",
      description:
        "Você tem interesse em conectar mercados e culturas, lidando com os desafios do comércio internacional. Sua visão global é um diferencial.",
      image:
        "https://irp.cdn-website.com/e9d501ba/dms3rep/multi/O+Que+Faz+um+T%C3%A9cnico+em+Com%C3%A9rcio+Exterior.webp",
      strongPoints: [
        "Visão global",
        "Negociação",
        "Fluência cultural",
        "Análise de mercado internacional",
      ],
    },
    jur: {
      title: "Perfil: O Analista de Regras",
      description:
        "Você tem uma mente metódica, que entende a importância das regras e dos processos formais. Justiça e conformidade são seus pilares.",
      image:
        "https://blog.wyden.com.br/wp-content/uploads/2023/10/still-life-with-scales-justice-1.jpg",
      strongPoints: [
        "Raciocínio analítico",
        "Atenção a normas",
        "Integridade",
        "Resolução de problemas legais",
      ],
    },
    enf: {
      title: "Perfil: O Cuidador Essencial",
      description:
        "Você tem empatia e a capacidade de oferecer conforto e cuidado técnico em momentos de necessidade. Sua dedicação faz a diferença.",
      image:
        "https://iergs.com.br/wp-content/uploads/2023/11/O-Curso-de-Enfermagem-e-dificil.jpg",
      strongPoints: [
        "Empatia",
        "Cuidado técnico",
        "Resiliência",
        "Atenção humanizada",
      ],
    },
    cui: {
      title: "Perfil: O Guardião Atencioso",
      description:
        "Você se dedica ao bem-estar dos outros, oferecendo suporte, paciência e atenção. Seu lado humano é um farol para quem precisa.",
      image:
        "https://infinityhomecareto.com.br/images/blog/6-dicas-e-cuidados.jpg",
      strongPoints: [
        "Paciência",
        "Compreensão",
        "Dedicacão",
        "Habilidades de apoio emocional",
      ],
    },
  };

  // --- 3. BANCO DE DADOS COMPLETO DO JOGO (BALANCEADO) ---
  const gameData = [
    {
      phase: 1,
      hotspotId: "hotspot-1-1",
      questionText:
        "Para iniciar o projeto da forma mais eficaz e evitar desperdício de tempo, qual é a primeira ação fundamental?",
      answers: [
        {
          text: "Analisar dados e pesquisas para entender os problemas reais da comunidade.",
          points: { ds: 3, inf: 2 },
        },
        {
          text: "Fazer um brainstorm de soluções criativas e com forte apelo visual e emocional.",
          points: { mkt: 3 },
        },
        {
          text: "Conversar com o grupo para entender as habilidades e motivações de cada um.",
          points: { rh: 2, cui: 1 },
        },
        {
          text: "Mapear os recursos disponíveis (tempo, materiais, pessoas) antes de decidir.",
          points: { adm: 2, log: 1 },
        },
      ],
      fragment: "E",
      hint: "Investigar os símbolos que apareceram no quadro branco.",
    },
    {
      phase: 1,
      hotspotId: "hotspot-1-2",
      questionText:
        "Você tem dados sobre 3 problemas. Qual é o critério mais estratégico para escolher em qual deles focar?",
      answers: [
        {
          text: "O que apresentar o melhor equilíbrio entre impacto social e viabilidade técnica.",
          points: { adm: 3, ds: 1 },
        },
        {
          text: "O que tiver maior potencial de atrair parceiros e visibilidade para o projeto.",
          points: { mkt: 2, cex: 1 },
        },
        {
          text: "O que for mais fácil de executar, para garantir a conclusão e a segurança da equipe.",
          points: { seg: 2, log: 1 },
        },
        {
          text: "Aquele que a equipe demonstrar mais paixão em resolver, para manter a motivação.",
          points: { rh: 2 },
        },
      ],
      fragment: "T",
      hint: "O caminho foi definido. O armário de metal parece ter algo útil.",
    },
    {
      phase: 1,
      hotspotId: "hotspot-1-3",
      questionText:
        "Um colega sugere quebrar uma regra importante do desafio. Qual a sua posição?",
      answers: [
        {
          text: "Explico que seguir as regras é essencial para a validade e segurança de todos.",
          points: { jur: 3, seg: 2 },
        },
        {
          text: "Pergunto ao colega por que ele quer quebrar a regra, buscando entender sua motivação.",
          points: { rh: 2, cui: 1 },
        },
        {
          text: "Analiso se a regra pode ser contornada de forma inteligente e permitida.",
          points: { adm: 2, mkt: 1 },
        },
        {
          text: "Proponho buscar uma negociação ou esclarecimento com os organizadores do desafio.",
          points: { cex: 2, jur: 1 },
        },
      ],
      fragment: "E",
      hint: "Integridade mantida. O foco agora deve ser a porta de saída.",
    },
    {
      phase: 1,
      hotspotId: "hotspot-1-4",
      questionText:
        "O grupo precisa decidir se o projeto será para poucas pessoas com grande impacto ou muitas pessoas com pequeno impacto. Qual a decisão mais sensata?",
      answers: [
        {
          text: "Focar em um nicho menor para garantir a qualidade e a entrega completa do prometido.",
          points: { adm: 2, ds: 1 },
        },
        {
          text: "Tentar alcançar o maior número de pessoas, pois a mensagem se espalha mais.",
          points: { mkt: 3 },
        },
        {
          text: "Analisar a cadeia de distribuição. O que conseguimos entregar com mais eficiência?",
          points: { log: 3, cex: 1 },
        },
        {
          text: "Escolher a opção que trouxer maior bem-estar e cuidado, independente do número.",
          points: { enf: 2, cui: 2 },
        },
      ],
      fragment: "C",
      hint: "O painel ao lado da porta está ativo.",
    },
    {
      phase: 1,
      hotspotId: "hotspot-1-5",
      questionText:
        "O painel exige a senha final da fase. Os fragmentos formam a palavra.",
      answers: [],
      fragment: "SENHA",
      password: "ETEC",
      hint: "Porta aberta! A próxima fase é a execução na oficina.",
    },
    {
      phase: 2,
      hotspotId: "hotspot-2-1",
      questionText:
        "Uma tarefa crucial está atrasada, comprometendo o cronograma. Qual a ação mais produtiva?",
      answers: [
        {
          text: "Conversar com o responsável para entender o problema e oferecer ajuda prática.",
          points: { rh: 3, enf: 1 },
        },
        {
          text: "Reunir o grupo e reorganizar o cronograma de forma realista, otimizando a logística.",
          points: { adm: 2, log: 2 },
        },
        {
          text: "Verificar se há algum procedimento de segurança ou norma impedindo a tarefa.",
          points: { seg: 3 },
        },
        {
          text: "Analisar o código ou a parte técnica da tarefa em busca de um bug ou erro.",
          points: { ds: 2, inf: 1 },
        },
      ],
      fragment: "C",
      hint: "Cronograma ajustado. A impressora 3D começou a piscar uma luz de erro.",
    },
    {
      phase: 2,
      hotspotId: "hotspot-2-2",
      questionText:
        "Uma falha técnica paralisa o projeto. Ninguém sabe consertar. O que fazer primeiro?",
      answers: [
        {
          text: "Isolar o problema, pesquisar a documentação e procurar soluções em fóruns.",
          points: { inf: 3, ds: 2 },
        },
        {
          text: "Acionar o protocolo de segurança, desligar o equipamento e sinalizar a área.",
          points: { seg: 3, jur: 1 },
        },
        {
          text: "Comunicar a falha à gestão, estimando o impacto no prazo e no custo.",
          points: { adm: 2, log: 1 },
        },
        {
          text: "Acalmar o grupo e aproveitar a pausa para cuidar do bem-estar da equipe.",
          points: { rh: 2, cui: 1 },
        },
      ],
      fragment: "UR",
      hint: "Problema técnico contornado. O protótipo na bancada agora pode ser trabalhado.",
    },
    {
      phase: 2,
      hotspotId: "hotspot-2-3",
      questionText:
        "Você percebe que só há material para UMA tentativa de consertar o protótipo. Como você usa esse último recurso?",
      answers: [
        {
          text: "Proponho que o grupo planeje e ensaie cada passo antes de tocar no material.",
          points: { adm: 3, log: 2 },
        },
        {
          text: "Sugiro que a pessoa mais calma e com maior habilidade manual faça o conserto.",
          points: { enf: 2, cui: 1 },
        },
        {
          text: "Uso meu conhecimento técnico para criar um molde ou guia para garantir a perfeição.",
          points: { ds: 3, inf: 1 },
        },
        {
          text: "Documento todo o processo, para que, se der errado, saibamos o motivo.",
          points: { seg: 2, jur: 1 },
        },
      ],
      fragment: "S",
      hint: "O protótipo está melhorando. A tensão é visível, hora de checar as ferramentas na parede.",
    },
    {
      phase: 2,
      hotspotId: "hotspot-2-4",
      questionText:
        "A pressão causa uma briga entre dois colegas. O clima fica péssimo. O que você faz?",
      answers: [
        {
          text: "Mediar uma conversa entre os dois, focando nos fatos e no objetivo do projeto.",
          points: { rh: 3, jur: 2 },
        },
        {
          text: "Dar apoio emocional a ambos, separadamente, e oferecer um copo d'água.",
          points: { enf: 2, cui: 3 },
        },
        {
          text: "Propor uma pausa geral e reorganizar as tarefas para diminuir o estresse.",
          points: { log: 2, adm: 1 },
        },
        {
          text: "Ignorar a briga e focar nas entregas, pois o prazo é a prioridade.",
          points: { ds: 1 },
        },
      ],
      fragment: "OS",
      hint: "No quadro de mensagens tem um post it com o ultimo digito",
    },
    {
      phase: 2,
      hotspotId: "hotspot-2-5",
      questionText:
        "O painel precisa ser recalibrado com a senha correta. Junte os fragmentos.",
      answers: [],
      fragment: "SENHA",
      password: "CURSOS",
      hint: "Agora no painel ao lado da porta. Preciso preencher a senha.",
    },
    {
      phase: 3,
      hotspotId: "hotspot-3-1",
      questionText:
        "Qual formato de apresentação tem mais chance de comunicar o valor do projeto de forma clara e profissional?",
      answers: [
        {
          text: "Uma demonstração ao vivo do protótipo, provando que ele funciona.",
          points: { ds: 3, inf: 2 },
        },
        {
          text: "Uma apresentação com storytelling e depoimentos de quem seria beneficiado.",
          points: { mkt: 3, cui: 1 },
        },
        {
          text: "Slides com métricas, projeções de custo e retorno sobre o investimento.",
          points: { adm: 2, log: 1, cex: 1 },
        },
        {
          text: "Um relatório detalhado sobre as normas de segurança e conformidade atendidas.",
          points: { seg: 2, jur: 1 },
        },
      ],
      fragment: "V",
      hint: "Que cheiro estranho. O microfone está ligado, deveria analisar.",
    },
    {
      phase: 3,
      hotspotId: "hotspot-3-2",
      questionText:
        "Minutos antes de apresentar, o arquivo principal da apresentação é corrompido. Qual o plano de contingência mais seguro?",
      answers: [
        {
          text: "Usar o backup salvo em um serviço de nuvem, que foi preparado previamente.",
          points: { seg: 3, inf: 2 },
        },
        {
          text: "Improvisar, usando o protótipo e a paixão da equipe para contar a história.",
          points: { mkt: 2, rh: 1 },
        },
        {
          text: "Pedir para apresentar por último para tentar refazer os slides mais importantes.",
          points: { adm: 2, cex: 1 },
        },
        {
          text: "Distribuir rapidamente as falas entre a equipe, focando nos pontos fortes de cada um.",
          points: { rh: 2 },
        },
      ],
      fragment: "E",
      hint: "O telão parece ter manchas de tinta. Algo não está certo. devo investigar.",
    },
    {
      phase: 3,
      hotspotId: "hotspot-3-3",
      questionText:
        "Durante a apresentação, um 'juiz invisível' faz uma crítica dura. Como você reage?",
      answers: [
        {
          text: "Agradeço a pergunta: 'Excelente observação. Vamos considerar para melhorar.'",
          points: { rh: 2, adm: 1 },
        },
        {
          text: "Defendo a decisão: 'Entendo seu ponto, mas nossa escolha foi baseada em X e Y, conforme a regra Z.'",
          points: { jur: 3 },
        },
        {
          text: "Anoto a crítica e pergunto mais: 'Poderia detalhar sua preocupação? Queremos entender a fundo.'",
          points: { ds: 2, inf: 1 },
        },
        {
          text: "Respondo com dados de mercado: 'Essa é uma preocupação válida, mas pesquisas mostram que...'",
          points: { mkt: 2, cex: 2 },
        },
      ],
      fragment: "N",
      hint: "A resposta impressionou. O silêncio das cadeiras vazias parece guardar o último segredo.",
    },
    {
      phase: 3,
      hotspotId: "hotspot-3-4",
      questionText:
        "Você percebe que seu colega de grupo, que é tímido, travou de nervoso. O que você faz?",
      answers: [
        {
          text: "Faço uma pergunta simples a ele sobre a parte que ele domina, para 'quebrar o gelo'.",
          points: { rh: 3, enf: 2 },
        },
        {
          text: "Assumo a fala dele de forma natural, para não quebrar o ritmo da apresentação.",
          points: { adm: 2, mkt: 1 },
        },
        {
          text: "Coloco a mão no ombro dele discretamente e digo 'estamos juntos nisso'.",
          points: { cui: 3, enf: 1 },
        },
        {
          text: "Peço uma pausa de 10 segundos ao 'juiz' para que ele possa beber uma água.",
          points: { seg: 1 },
        },
      ],
      fragment: "HA",
      hint: "Preciso verificar a ultima porta que fica ao final do auditorio.",
    },
    {
      phase: 3,
      hotspotId: "hotspot-3-5",
      questionText:
        "O desafio acabou. Você coletou as pistas. É hora de abrir a porta final.",
      answers: [],
      fragment: "SENHA",
      password: "VENHA",
      hint: "Está trancada. Agora com a senha posso ver a ultima porta.",
    },
  ];

  // --- 4. ESTADO DO JOGO ---
  let gameState = {
    currentPhase: 1,
    questionIndex: 0,
    scores: {},
    fragments: [],
    sessionId: null,
  };

  let objectiveTimeout;

  // --- 5. FUNÇÕES PRINCIPAIS DO JOGO ---

  function saveState() {
    localStorage.setItem("vocationalGameState", JSON.stringify(gameState));
  }
  function clearState() {
    localStorage.removeItem("vocationalGameState");
    localStorage.removeItem("tutorialVocacionalVisto");
  }
  function initializeScores() {
    for (const key in courses) {
      gameState.scores[key] = 0;
    }
  }

  async function createInProgressSession() {
    try {
      const docRef = await addDoc(collection(db, "resultados"), {
        status: "in_progress",
        horario: serverTimestamp(),
      });
      gameState.sessionId = docRef.id;
    } catch (e) {
      console.error("Erro ao criar sessão: ", e);
    }
  }

  async function updateResultInFirebase(courseKey, suggestions) {
    if (!gameState.sessionId) {
      console.error("ID da sessão não encontrado.");
      return;
    }
    try {
      const resultDocRef = doc(db, "resultados", gameState.sessionId);
      await updateDoc(resultDocRef, {
        status: "completed",
        cursoRecomendado: courseKey,
        outrasSugestoes: suggestions,
        horario: serverTimestamp(),
      });
    } catch (e) {
      console.error("Erro ao atualizar documento: ", e);
    }
  }

  function setupPhase(phaseNumber) {
    gameContainer.className = "";
    gameContainer.classList.add(`phase-${phaseNumber}-bg`);
    gameState.fragments = [];
    updateInventory();
  }

  function activateNextHotspot() {
    document
      .querySelectorAll(".hotspot")
      .forEach((h) => h.classList.add("hidden"));
    const currentQuestionData = gameData[gameState.questionIndex];
    if (currentQuestionData) {
      const hotspot = document.getElementById(currentQuestionData.hotspotId);
      if (hotspot) {
        hotspot.classList.remove("hidden");
        hotspot.onclick = () => showQuestion(gameState.questionIndex);
      }
    }
  }

  function showQuestion(index) {
    const questionData = gameData[index];
    questionText.textContent = questionData.questionText;
    answerOptions.innerHTML = "";

    if (questionData.fragment !== "SENHA") {
      questionData.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = () =>
          selectAnswer(answer.points, questionData.fragment);
        answerOptions.appendChild(button);
      });
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Digite a senha da fase";
      input.autocomplete = "off";
      input.addEventListener("focus", () => {
        passwordSound.volume = 0.3;
        passwordSound.play();
      });
      input.addEventListener("input", () => {
        const errorElement = document.getElementById("password-error-text");
        if (errorElement) {
          errorElement.classList.add("hidden");
        }
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          checkPassword(input.value);
        }
      });

      const button = document.createElement("button");
      button.textContent = "Destrancar";
      button.onclick = () => checkPassword(input.value);

      const errorText = document.createElement("p");
      errorText.id = "password-error-text";
      errorText.classList.add("hidden");

      answerOptions.appendChild(input);
      answerOptions.appendChild(button);
      answerOptions.appendChild(errorText);
      input.focus();
    }
    questionUI.classList.remove("hidden");
  }

  function selectAnswer(points, fragment) {
    clickSound.volume = 0.3;
    clickSound.play();

    const currentHotspot = document.getElementById(
      gameData[gameState.questionIndex].hotspotId
    );
    if (currentHotspot) {
      currentHotspot.classList.add("hidden");
      currentHotspot.onclick = null;
    }

    for (const course in points) {
      if (gameState.scores.hasOwnProperty(course)) {
        gameState.scores[course] += points[course];
      }
    }
    if (fragment) {
      gameState.fragments.push(fragment);
    }
    updateInventory();

    questionUI.classList.add("hidden");

    const previousHint = gameData[gameState.questionIndex].hint;
    showObjective(previousHint, "completed");

    gameState.questionIndex++;

    if (gameState.questionIndex < gameData.length) {
      const nextQuestionData = gameData[gameState.questionIndex];
      setTimeout(() => {
        showObjective(nextQuestionData.hint, "new");
        activateNextHotspot();
      }, 1500);
      saveState();
    } else {
      endGame();
    }
  }

  function checkPassword(passwordAttempt) {
    const currentQuestionData = gameData[gameState.questionIndex];
    const correctPassword = currentQuestionData.password;

    if (passwordAttempt.toUpperCase() === correctPassword.toUpperCase()) {
      unlockSound.play();
      questionUI.classList.add("hidden");

      showObjective("Senha decifrada. Acesso liberado.", "completed");

      gameState.questionIndex++;
      const nextQuestionData = gameData[gameState.questionIndex];
      if (nextQuestionData) {
        setTimeout(() => {
          showObjective(nextQuestionData.hint, "new");
          advanceToNextPhase();
        }, 1500);
      } else {
        setTimeout(endGame, 1500);
      }
    } else {
      const inputField = document.querySelector("#answer-options input");
      const errorElement = document.getElementById("password-error-text");
      if (inputField) {
        inputField.value = "";
        inputField.classList.add("input-shake");
        setTimeout(() => inputField.classList.remove("input-shake"), 500);
      }
      if (errorElement) {
        errorElement.textContent = "Senha Incorreta! Tente novamente.";
        errorElement.classList.remove("hidden");
      }
    }
  }

  function advanceToNextPhase() {
    const nextQuestionData = gameData[gameState.questionIndex];
    if (nextQuestionData) {
      const nextPhase = nextQuestionData.phase;
      if (gameState.currentPhase !== nextPhase) {
        gameState.currentPhase = nextPhase;
        setupPhase(nextPhase);
      }
      activateNextHotspot();
      saveState();
    } else {
      endGame();
    }
  }

  function updateInventory() {
    const inventoryPanel = document.getElementById("inventory");
    const fragmentsText = gameState.fragments.join("");

    inventoryPanel.innerHTML = `
            <i data-lucide="hash"></i>
            <div>
                Fragmentos: <span id="fragments-text">${fragmentsText}</span>
            </div>
        `;

    lucide.createIcons();
  }

  function showObjective(text, type = "new") {
    clearTimeout(objectiveTimeout);
    objectivePanel.classList.remove("show", "completed");

    let title, iconHtml;
    if (type === "completed") {
      title = "OBJETIVO CONCLUÍDO";
      iconHtml = '<i data-lucide="check-circle-2"></i>';
      objectivePanel.classList.add("completed");
      objectiveCompleteSound.play().catch((e) => {});
    } else {
      title = "NOVO OBJETIVO";
      iconHtml = '<i data-lucide="target"></i>';
      objectiveNewSound.play().catch((e) => {});
    }

    objectivePanel.innerHTML = `${iconHtml}<div><span class="objective-title">${title}:</span> ${text}</div>`;

    void objectivePanel.offsetWidth;

    objectivePanel.classList.add("show");

    lucide.createIcons();

    if (type === "completed") {
      objectiveTimeout = setTimeout(() => {
        objectivePanel.classList.remove("show");
      }, 4000);
    }
  }

  function endGame() {
    clearState();
    document
      .querySelectorAll(".hotspot, #question-ui, #inventory, #objective-panel")
      .forEach((el) => el.classList.add("hidden"));
    let highestScore = -1,
      recommendedCourse = null;
    for (const course in gameState.scores) {
      if (gameState.scores[course] > highestScore) {
        highestScore = gameState.scores[course];
        recommendedCourse = course;
      }
    }
    const otherSuggestions = Object.entries(gameState.scores)
      .filter(([course, score]) => course !== recommendedCourse)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([course, score]) => courses[course]);
    updateResultInFirebase(recommendedCourse, otherSuggestions);
    displayResults(recommendedCourse, otherSuggestions);
  }

  function displayResults(courseKey, suggestions) {
    const resultProfile = courseDetails[courseKey] || {
      title: "Seu Perfil é Versátil!",
      description:
        "Você demonstrou uma grande variedade de habilidades e pode se adaptar a diversas áreas.",
      image: "",
      strongPoints: ["Adaptabilidade", "Versatilidade", "Curiosidade"],
    };
    document.getElementById(
      "result-title"
    ).textContent = `Curso Recomendado: ${courses[courseKey]}`;
    document.getElementById("result-description").textContent =
      resultProfile.description;
    if (resultProfile.image) {
      courseImage.src = resultProfile.image;
      courseImage.classList.remove("hidden");
    } else {
      courseImage.classList.add("hidden");
    }
    etecLogo.classList.remove("hidden");
    strongPointsList.innerHTML = "";
    if (resultProfile.strongPoints && resultProfile.strongPoints.length > 0) {
      resultProfile.strongPoints.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        strongPointsList.appendChild(li);
      });
      document
        .getElementById("strong-points-container")
        .classList.remove("hidden");
    } else {
      document
        .getElementById("strong-points-container")
        .classList.add("hidden");
    }
    const courseList = document.getElementById("result-courses");
    courseList.innerHTML = "";
    if (suggestions.length > 0) {
      suggestions.forEach((course) => {
        const li = document.createElement("li");
        li.textContent = course;
        courseList.appendChild(li);
      });
    } else {
      courseList.innerHTML = "<li>Nenhuma outra sugestão no momento.</li>";
    }
    resultScreen.classList.remove("hidden");
  }

  // --- 6. INÍCIO E LÓGICA DE RESTAURAÇÃO DO JOGO ---
  async function startGame() {
    initializeScores();
    resultScreen.classList.add("hidden");
    document
      .querySelectorAll("#inventory")
      .forEach((el) => el.classList.remove("hidden"));
    await createInProgressSession();
    saveState();
    setupPhase(1);
    activateNextHotspot();
    setTimeout(
      () => showObjective("Investigar a sala em busca de pistas.", "new"),
      1000
    );
  }

  function loadAndResumeGame() {
    const savedStateJSON = localStorage.getItem("vocationalGameState");
    if (savedStateJSON) {
      try { // <-- MELHORIA ADICIONADA
        gameState = JSON.parse(savedStateJSON);
        resultScreen.classList.add("hidden");
        document
          .querySelectorAll("#inventory")
          .forEach((el) => el.classList.remove("hidden"));
        gameContainer.className = "";
        gameContainer.classList.add(`phase-${gameState.currentPhase}-bg`);
        updateInventory();
        const currentQuestion = gameData[gameState.questionIndex];
        if (currentQuestion) {
          showObjective(currentQuestion.hint, "new");
          activateNextHotspot();
        } else {
          clearState();
          startGame();
        }
      } catch (error) { // <-- MELHORIA ADICIONADA
          console.error("Falha ao ler o jogo salvo. Começando um novo.", error);
          clearState();
          startGame();
      }
    } else {
      startGame();
    }
  }

  restartButton.addEventListener("click", () => {
    document.body.classList.add("fade-out");
    setTimeout(() => {
        clearState();
        window.location.reload(); // Recarrega a página para um início limpo
    }, 500); // Espera a animação de fade-out terminar
  });

  viewAllResultsButton.addEventListener("click", () => {
    window.location.href = "/perguntas/dashboard";
  });

  // Funções de debug (podem ser removidas em produção)
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "p") {
      endGame();
    }
    if (e.key === "1")
      displayResults("ds", [
        "Informática para Internet",
        "Segurança do Trabalho",
      ]);
    if (e.key === "2") displayResults("adm", ["Logística", "Marketing"]);
    if (e.key === "3")
      displayResults("enf", ["Cuidados de Idosos", "Recursos Humanos"]);
  });

  loadAndResumeGame();
});

// A CHAVE "}" EXTRA QUE ESTAVA AQUI FOI REMOVIDA.