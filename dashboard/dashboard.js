import { db } from '../firebase.js';
import { collection, query, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elementos da página
const totalRespostasEl = document.getElementById('total-respostas');
const logListEl = document.getElementById('log-list');
const courseListEl = document.getElementById('course-list');
const ctx = document.getElementById('cursosChart').getContext('2d');

// Mapeamento de abreviações para nomes completos dos cursos
const courses = {
    ds: "Desenvolvimento de Sistemas", inf: "Informática para Internet", seg: "Segurança do Trabalho",
    adm: "Administração", mkt: "Marketing", rh: "Recursos Humanos", log: "Logística",
    cex: "Comércio Exterior", jur: "Serviços Jurídicos", enf: "Enfermagem", cui: "Cuidados de Idosos"
};

const courseIcons = {
    ds:  'fas fa-laptop-code',
    inf: 'fas fa-laptop-code',
    adm: 'fas fa-briefcase',
    mkt: 'fas fa-bullhorn',
    rh:  'fas fa-users',
    log: 'fas fa-truck-fast',
    cex: 'fas fa-globe',
    enf: 'fas fa-heart-pulse',
    cui: 'fas fa-hands-holding-child',
    seg: 'fas fa-shield-halved',
    jur: 'fas fa-gavel'
};


// Variáveis para os dados
let todosResultados = [];
let chart;

// Paleta de cores para o gráfico
const chartColors = [
    '#00A1FF', '#33B5FF', '#66C9FF', '#99DDFF', '#CCEFFF',
    '#FF6384', '#FF9F40', '#FFCD56', '#4BC0C0', '#9966FF',
    '#C9CBCF', '#36A2EB'
];

// Função para inicializar o gráfico
function inicializarChart() {
    chart = new Chart(ctx, {
        type: 'pie', // Alterado para gráfico de pizza
        data: {
            labels: [],
            datasets: [{
                label: 'Nº de Recomendações',
                data: [],
                backgroundColor: chartColors,
                borderColor: '#1e1e1e', // Cor de fundo do card
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Posição da legenda
                    labels: {
                        color: '#e0e0e0',
                        boxWidth: 20,
                        padding: 20
                    }
                }
            }
        }
    });
}

// Função para atualizar a lista de cursos com porcentagens
// Em seu arquivo dashboard.js, substitua APENAS esta função.
// O resto do arquivo permanece o mesmo.

function atualizarListaCursos(cursosContagem, total) {
    courseListEl.innerHTML = ''; // Limpa a lista

    // NOVO: Cria um objeto de contagem que inclui todos os cursos, mesmo os com 0.
    const contagemCompleta = {};
    for (const key in courses) {
        const nomeCompleto = courses[key];
        contagemCompleta[nomeCompleto] = cursosContagem[nomeCompleto] || 0;
    }

    // Ordena a lista completa pela contagem, do maior para o menor.
    Object.entries(contagemCompleta)
        .sort(([, a], [, b]) => b - a)
        .forEach(([curso, contagem]) => {
            // Garante que a porcentagem seja '0.0' se não houver respostas.
            const percentage = total > 0 ? ((contagem / total) * 100).toFixed(1) : "0.0";

            const itemEl = document.createElement('div');
            itemEl.classList.add('course-item');
            
            // Adiciona uma classe especial se a recomendação for 0 para estilizar no CSS
            if (contagem === 0) {
                itemEl.classList.add('zero-recommendation');
            }

            itemEl.innerHTML = `
                <span class="course-name">${curso}</span>
                <div class="percentage-bar">
                    <div style="width: ${percentage}%;"></div>
                </div>
                <span class="percentage-text">${percentage}%</span>
            `;
            courseListEl.appendChild(itemEl);
        });
}


// Função para atualizar o dashboard completo
// Em seu arquivo dashboard.js, substitua APENAS esta função.
// O resto do arquivo permanece o mesmo.

// Em seu arquivo dashboard.js, adicione este objeto logo após o objeto 'courses'
// Agora, substitua a função 'atualizarDashboard' inteira por esta
function atualizarDashboard() {
    // Filtra os resultados
    const resultadosCompletos = todosResultados.filter(r => r.status !== 'in_progress');
    const pesquisasEmProgresso = todosResultados.filter(r => r.status === 'in_progress');
    
    const total = resultadosCompletos.length;
    
    // 1. Atualizar total
    totalRespostasEl.textContent = total;

    // 2. Calcular contagem de cursos
    const cursosContagem = {};
    resultadosCompletos.forEach(resultado => {
        if (resultado.cursoRecomendado && courses[resultado.cursoRecomendado]) {
            const curso = courses[resultado.cursoRecomendado];
            cursosContagem[curso] = (cursosContagem[curso] || 0) + 1;
        }
    });

    // 3. Atualizar o gráfico
    chart.data.labels = Object.keys(cursosContagem);
    chart.data.datasets[0].data = Object.values(cursosContagem);
    chart.update();

    // 4. Atualizar o log de respostas com o novo design
    logListEl.innerHTML = '';
    
    // Adiciona as pesquisas "em progresso"
    pesquisasEmProgresso.forEach(() => {
        const li = document.createElement('li');
        li.className = 'log-item in-progress'; // Classe para estilo especial
        li.innerHTML = `
            <div class="log-icon-container">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div class="log-details">
                <span class="log-course-name">Realizando Pesquisa...</span>
                <span class="log-timestamp">Aguardando resultado</span>
            </div>
        `;
        logListEl.prepend(li);
    });

    // Adiciona os resultados completos
    resultadosCompletos.forEach(resultado => {
        const li = document.createElement('li');
        li.className = 'log-item';
        
        const data = resultado.horario ? resultado.horario.toDate().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) : '...';
        const cursoKey = resultado.cursoRecomendado;
        const cursoNomeCompleto = courses[cursoKey] || "Resultado Inválido";
        const iconClass = courseIcons[cursoKey] || 'fas fa-question-circle'; // Ícone padrão
        
        li.innerHTML = `
            <div class="log-icon-container">
                <i class="${iconClass}"></i>
            </div>
            <div class="log-details">
                <span class="log-course-name">${cursoNomeCompleto}</span>
                <span class="log-timestamp">${data}</span>
            </div>
        `;
        logListEl.prepend(li);
    });
    
    // 5. Atualizar a lista de porcentagens
    atualizarListaCursos(cursosContagem, total);
}
// Inicia o listener do Firebase
function escutarResultados() {
    const q = query(collection(db, "resultados"), orderBy("horario", "desc"));
    
    onSnapshot(q, (querySnapshot) => {
        todosResultados = querySnapshot.docs.map(doc => doc.data());
        console.log("Dados recebidos: ", todosResultados);
        atualizarDashboard();
    });
}

// Inicia tudo
inicializarChart();
escutarResultados();