document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO HTML ---
    const gameContainer = document.getElementById('game-container');
    const dynamicIsland = document.getElementById('dynamic-island');
    const questionUI = document.getElementById('question-ui');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const fragmentsDisplay = document.getElementById('fragments-display');
    const resultScreen = document.getElementById('result-screen');

    // --- 2. MAPEAMENTO DE CURSOS ---
    const courses = {
        ds: "Desenvolvimento de Sistemas", inf: "Informática para Internet", seg: "Segurança do Trabalho",
        adm: "Administração", mkt: "Marketing", rh: "Recursos Humanos", log: "Logística",
        cex: "Comércio Exterior", jur: "Serviços Jurídicos", enf: "Enfermagem", cui: "Cuidados de Idosos"
    };

    // --- 3. BANCO DE DADOS COMPLETO DO JOGO ---
    const gameData = [
        // --- FASE 1 ---
        { phase: 1, hotspotId: 'hotspot-1-1', questionText: "Para iniciar o projeto da forma mais eficaz e evitar desperdício de tempo, qual é a primeira ação fundamental?", answers: [{ text: "Analisar dados e pesquisas sobre os problemas reais da comunidade.", points: { ds: 3, inf: 2 } }, { text: "Fazer um brainstorm de soluções criativas.", points: { mkt: 1 } }, { text: "Perguntar ao grupo o que eles se sentem mais motivados a fazer.", points: { rh: 1 } }], fragment: "7G", hint: "A resposta ativou o quadro branco. Precisamos investigar os símbolos que apareceram." },
        { phase: 1, hotspotId: 'hotspot-1-2', questionText: "Você tem dados sobre 3 problemas. Qual é o critério mais estratégico para escolher em qual deles focar?", answers: [{ text: "O que apresentar o melhor equilíbrio entre impacto e viabilidade (recursos/tempo).", points: { adm: 3, log: 2 } }, { text: "O que usar a tecnologia mais inovadora para impressionar.", points: { ds: 1 } }, { text: "O que for mais fácil de executar, para garantir a conclusão.", points: { seg: 1 } }], fragment: "H3", hint: "Boa decisão. Agora que o caminho foi definido, o armário de metal parece ter algo útil." },
        { phase: 1, hotspotId: 'hotspot-1-3', questionText: "Um colega sugere quebrar uma regra importante do desafio. Qual a sua posição?", answers: [{ text: "Explico que seguir as regras é essencial para a validade e segurança do projeto.", points: { jur: 3, seg: 2 } }, { text: "Digo que entendo a pressa, mas que as consequências de quebrar as regras são piores.", points: { rh: 1 } }, { text: "Analiso se a regra pode ser contornada de forma inteligente e permitida.", points: { adm: 1 } }], fragment: "K9", hint: "Manter a integridade é crucial. Agora, nosso foco deve ser a porta de saída." },
        { phase: 1, hotspotId: 'hotspot-1-4', questionText: "O grupo precisa decidir se o projeto será para poucas pessoas com grande impacto ou muitas pessoas com pequeno impacto. Qual a decisão mais sensata?", answers: [{ text: "Focar em um nicho menor para garantir a qualidade e a entrega completa do prometido.", points: { adm: 3, mkt: 2 } }, { text: "Tentar alcançar o maior número de pessoas, mesmo que o benefício individual seja pequeno.", points: { mkt: 1 } }, { text: "A decisão depende dos nossos recursos. Vamos analisar o que conseguimos fazer bem feito.", points: { log: 1 } }], fragment: "4B", hint: "Escopo definido. Falta apenas a senha final. O painel ao lado da porta está ativo." },
        { phase: 1, hotspotId: 'hotspot-1-5', questionText: "O painel exige a senha final da fase. Junte os fragmentos.", answers: [], fragment: "SENHA", password: "7GH3K94B", hint: "Conseguimos! A porta se abriu para a oficina. A próxima fase é a execução." },
        // --- FASE 2 ---
        { phase: 2, hotspotId: 'hotspot-2-1', questionText: "Uma tarefa crucial está atrasada, comprometendo o cronograma. Qual a ação mais produtiva?", answers: [{ text: "Conversar com o responsável para entender o problema e oferecer ajuda prática.", points: { rh: 3, cui: 2 } }, { text: "Reunir o grupo e reorganizar o cronograma de forma realista, redistribuindo tarefas.", points: { adm: 2, log: 1 } }, { text: "Assumir a tarefa para garantir que seja feita, mesmo que te sobrecarregue.", points: { seg: 1 } }], fragment: "M4", hint: "O cronograma está ajustado. Mas a impressora 3D começou a piscar uma luz de erro." },
        { phase: 2, hotspotId: 'hotspot-2-2', questionText: "Uma falha técnica paralisa o projeto. Ninguém sabe consertar. O que fazer primeiro?", answers: [{ text: "Isolar o problema, pesquisar a documentação técnica e procurar soluções em fóruns.", points: { inf: 3, ds: 2 } }, { text: "Comunicar a falha à gestão do projeto e pedir ajuda de um especialista.", points: { adm: 1 } }, { text: "Manter a calma do grupo e focar em outras tarefas que não dependam da falha.", points: { rh: 1 } }], fragment: "K1", hint: "Problema técnico contornado. O protótipo na bancada agora pode ser trabalhado." },
        { phase: 2, hotspotId: 'hotspot-2-3', questionText: "Você percebe que só há material para UMA tentativa de consertar o protótipo. Como você usa esse último recurso?", answers: [{ text: "Proponho que o grupo planeje e ensaie cada passo antes de tocar no material.", points: { adm: 3, log: 2 } }, { text: "Sugiro que a pessoa mais calma e cuidadosa do grupo faça o conserto.", points: { enf: 1 } }, { text: "Uso meu conhecimento técnico para criar um molde ou guia para garantir a perfeição.", points: { ds: 2, inf: 1 } }], fragment: "N4", hint: "O protótipo está melhorando, mas a tensão na sala é visível. As ferramentas na parede parecem pesadas." },
        { phase: 2, hotspotId: 'hotspot-2-4', questionText: "A pressão causa uma briga entre dois colegas. O clima fica péssimo. O que você faz?", answers: [{ text: "Mediar uma conversa entre os dois, focando nos fatos e no objetivo do projeto.", points: { rh: 3, jur: 2 } }, { text: "Dar apoio emocional a ambos, mas separadamente, para não piorar o clima.", points: { enf: 1, cui: 1 } }, { text: "Ignorar a briga e focar nas entregas, esperando que eles se resolvam.", points: { ds: 0 } }], fragment: "S", hint: "Com o conflito resolvido, o caminho está livre para o painel final da porta." },
        { phase: 2, hotspotId: 'hotspot-2-5', questionText: "O painel precisa ser recalibrado com a senha correta. Junte os fragmentos.", answers: [], fragment: "SENHA", password: "M4K1N4S", hint: "Oficina concluída! A porta range e se abre para um palco escuro. É hora da apresentação." },
        // --- FASE 3 ---
        { phase: 3, hotspotId: 'hotspot-3-1', questionText: "Qual formato de apresentação tem mais chance de comunicar o valor do projeto de forma clara e profissional?", answers: [{ text: "Uma demonstração ao vivo do protótipo, provando que ele funciona.", points: { ds: 3, inf: 2 } }, { text: "Uma apresentação com storytelling e depoimentos de quem seria beneficiado.", points: { mkt: 2, cui: 1 } }, { text: "Slides com métricas, projeções de custo e retorno sobre o investimento.", points: { adm: 2, log: 1 } }], fragment: "F1", hint: "Formato decidido. O púlpito no centro do palco parece ser o próximo passo." },
        { phase: 3, hotspotId: 'hotspot-3-2', questionText: "Minutos antes de apresentar, o arquivo principal da apresentação é corrompido. Qual o plano de contingência mais seguro?", answers: [{ text: "Usar o backup salvo em um serviço de nuvem, que foi preparado previamente.", points: { seg: 3, inf: 2 } }, { text: "Improvisar a apresentação sem slides, confiando no conhecimento do grupo.", points: { rh: 1 } }, { text: "Pedir para apresentar por último para tentar refazer os slides rapidamente.", points: { adm: 1 } }], fragment: "N4", hint: "Crise contornada. O holofote acima do palco treme, chamando sua atenção." },
        { phase: 3, hotspotId: 'hotspot-3-3', questionText: "Durante a apresentação, um 'juiz invisível' faz uma crítica dura. Como você reage?", answers: [{ text: "Agradeço a pergunta: 'Excelente observação. Vamos considerar para melhorar.'", points: { rh: 2, adm: 1 } }, { text: "Tento defender o projeto: 'Entendo seu ponto, mas nossa decisão foi baseada em X e Y.'", points: { jur: 2 } }, { text: "Anoto a crítica e pergunto mais: 'Poderia detalhar sua preocupação?'", points: { ds: 2, inf: 1 } }], fragment: "L3", hint: "A resposta impressionou. O silêncio das cadeiras vazias parece guardar o último segredo." },
        { phase: 3, hotspotId: 'hotspot-3-4', questionText: "Você percebe que seu colega de grupo, que é tímido, travou de nervoso. O que você faz?", answers: [{ text: "Faço uma pergunta simples e direta a ele sobre a parte que ele domina, para 'quebrar o gelo'.", points: { enf: 3, cui: 2, rh: 1 } }, { text: "Assumo a fala dele de forma natural, para não quebrar o ritmo da apresentação.", points: { adm: 1 } }, { text: "Sussurro a primeira frase da fala dele para ajudá-lo a lembrar.", points: { sc: 1 } }], fragment: "", hint: "O time está unido. Apenas a porta final resta." },
        { phase: 3, hotspotId: 'hotspot-3-5', questionText: "O desafio acabou. Você coletou as pistas. É hora de abrir a porta final.", answers: [], fragment: "SENHA", password: "F1N4L3", hint: "Parabéns! Você concluiu o desafio." }
    ];

    // --- 4. ESTADO DO JOGO ---
    let gameState = {
        currentPhase: 1,
        questionIndex: 0,
        scores: {},
        fragments: []
    };

    // --- 5. FUNÇÕES PRINCIPAIS DO JOGO ---

    function initializeScores() {
        for (const key in courses) {
            gameState.scores[key] = 0;
        }
    }

    function setupPhase(phaseNumber) {
        gameContainer.className = '';
        gameContainer.classList.add(`phase-${phaseNumber}-bg`);
        gameState.fragments = [];
        updateInventory();
    }

    function activateNextHotspot() {
        document.querySelectorAll('.hotspot').forEach(h => h.classList.add('hidden'));
        const currentQuestionData = gameData[gameState.questionIndex];
        if (currentQuestionData) {
            const hotspot = document.getElementById(currentQuestionData.hotspotId);
            if(hotspot) {
                hotspot.classList.remove('hidden');
                hotspot.onclick = () => showQuestion(gameState.questionIndex);
            }
        }
    }

    function showQuestion(index) {
        const questionData = gameData[index];
        questionText.textContent = questionData.questionText;
        answerOptions.innerHTML = '';

        if (questionData.fragment !== "SENHA") {
            questionData.answers.forEach(answer => {
                const button = document.createElement('button');
                button.textContent = answer.text;
                button.onclick = () => selectAnswer(answer.points, questionData.fragment);
                answerOptions.appendChild(button);
            });
        } else {
            const input = document.createElement('input');
            input.type = "text";
            input.placeholder = "Digite a senha da fase";
            input.autocomplete = "off";
            const button = document.createElement('button');
            button.textContent = "Destrancar";
            button.onclick = () => checkPassword(input.value);
            answerOptions.appendChild(input);
            answerOptions.appendChild(button);
            input.focus();
        }
        
        questionUI.classList.remove('hidden');
    }
    
    function selectAnswer(points, fragment) {
        for (const course in points) {
            if (gameState.scores.hasOwnProperty(course)) {
                gameState.scores[course] += points[course];
            }
        }
        if (fragment) { 
            gameState.fragments.push(fragment);
        }
        updateInventory();
        
        questionUI.classList.add('hidden');
        gameState.questionIndex++;
        
        if (gameState.questionIndex < gameData.length) {
            const nextQuestionData = gameData[gameState.questionIndex];
            showDynamicIsland(nextQuestionData.hint);
            activateNextHotspot();
        } else {
            endGame();
        }
    }

    function checkPassword(passwordAttempt) {
        const currentQuestionData = gameData[gameState.questionIndex];
        const correctPassword = currentQuestionData.password;

        if (passwordAttempt.toUpperCase() === correctPassword) {
            questionUI.classList.add('hidden');
            gameState.questionIndex++;
            const nextQuestionData = gameData[gameState.questionIndex];
            if(nextQuestionData) {
                 showDynamicIsland(nextQuestionData.hint);
            }
            advanceToNextPhase();
        } else {
            alert("Senha Incorreta!");
            const inputField = document.querySelector('#answer-options input');
            if (inputField) inputField.value = "";
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
        } else {
            endGame();
        }
    }

    function updateInventory() {
        fragmentsDisplay.textContent = gameState.fragments.join(' | ');
    }

    function showDynamicIsland(hintText) {
        if (!hintText) return;
        dynamicIsland.textContent = hintText;
        dynamicIsland.classList.add('visible');
        setTimeout(() => {
            dynamicIsland.classList.remove('visible');
        }, 5000);
    }

    function endGame() {
        document.querySelectorAll('.hotspot, #question-ui, #inventory, #dynamic-island').forEach(el => el.classList.add('hidden'));
        
        let highestScore = -1;
        let recommendedCourse = null;
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

        displayResults(recommendedCourse, otherSuggestions);
    }

    function displayResults(courseKey, suggestions) {
        const resultsData = {
            ds: { title: "Perfil: O Arquiteto de Sistemas", description: "Você tem uma mente lógica e gosta de construir soluções eficientes para problemas complexos." },
            adm: { title: "Perfil: O Estrategista", description: "Você tem talento para organizar, liderar e planejar, transformando ideias em realidade." },
            rh: { title: "Perfil: O Mediador", description: "Você entende de pessoas, sabe como motivar e resolver conflitos para construir equipes fortes." },
            log: { title: "Perfil: O Otimizador", description: "Você enxerga processos e encontra as melhores rotas e métodos para que tudo funcione com eficiência." },
            mkt: { title: "Perfil: O Comunicador", description: "Você sabe como criar mensagens impactantes e conectar ideias com o público certo." },
            inf: { title: "Perfil: O Solucionador Digital", description: "Você é prático e rápido para resolver problemas técnicos e fazer a tecnologia funcionar a seu favor." },
            seg: { title: "Perfil: O Protetor", description: "Você tem um olhar atento para riscos e normas, garantindo a segurança e o bem-estar de todos." },
            jur: { title: "Perfil: O Analista de Regras", description: "Você tem uma mente metódica, que entende a importância das regras e dos processos formais." },
            enf: { title: "Perfil: O Cuidador", description: "Você tem empatia e a capacidade de oferecer conforto e cuidado técnico em momentos de necessidade." },
            cui: { title: "Perfil: O Guardião", description: "Você se dedica ao bem-estar dos outros, oferecendo suporte, paciência e atenção." }
        };

        const mainCourseName = courses[courseKey] || "N/A";
        const resultProfile = resultsData[courseKey] || { title: "Seu Perfil é Versátil!", description: "Você demonstrou uma grande variedade de habilidades." };
        
        document.getElementById('result-title').textContent = `Curso Recomendado: ${mainCourseName}`;
        document.getElementById('result-description').textContent = resultProfile.description;
        
        const courseList = document.getElementById('result-courses');
        courseList.innerHTML = '';
        suggestions.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course;
            courseList.appendChild(li);
        });

        resultScreen.classList.remove('hidden');
    }

    // --- 6. INÍCIO DO JOGO ---
    function startGame() {
        initializeScores();
        setupPhase(1);
        activateNextHotspot();
    }

    startGame();
});