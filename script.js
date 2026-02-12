// Dados e Configurações
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let anoAtual = 2026;
let perfilAtual = localStorage.getItem('perfilAtual') || 'coordenador'; // 'coordenador' ou 'professor'
let eventoEditando = null; // Para edição de eventos
let comentarioContexto = null; // Contexto para comentários (seção/evento)

const fotoPlaceholder = 'https://placehold.co/260x260?text=Coordenador';
const perfilPlaceholder = {
    nome: 'Nome do Coordenador',
    escola: 'Rede Excellent',
    areaAtuacao: 'Coordenação Pedagógica',
    tempoExperiencia: '--',
    email: '--',
    telefone: '--',
    mensagem: 'Mensagem de boas-vindas e apresentação aparecerá aqui.',
    foto: fotoPlaceholder
};

function isCoordenador() {
    return perfilAtual === 'coordenador';
}

function exigirCoordenador(mensagem) {
    if (!isCoordenador()) {
        alert(mensagem || 'Somente coordenadores podem realizar esta ação.');
        return false;
    }
    return true;
}

// Frases Inspiradoras Mensais (com referência cristã)
const frasesInspiradoras = {
    0: "Em janeiro, renovamos nossa fé e confiança: 'Tudo posso naquele que me fortalece' (Filipenses 4:13).",
    1: "Fevereiro nos ensina sobre perseverança: 'Os que esperam no Senhor renovam as suas forças' (Isaías 40:31).",
    2: "Março é tempo de semear: 'Tudo tem o seu tempo determinado' (Eclesiastes 3:1).",
    3: "Abril traz renovação: 'Eis que faço novas todas as coisas' (Apocalipse 21:5).",
    4: "Maio celebra a vida: 'Eu vim para que tenham vida, e a tenham em abundância' (João 10:10).",
    5: "Junho nos lembra da sabedoria: 'O temor do Senhor é o princípio da sabedoria' (Provérbios 9:10).",
    6: "Julho é tempo de descanso e reflexão: 'Vinde a mim, todos os que estais cansados' (Mateus 11:28).",
    7: "Agosto nos fortalece: 'Posso todas as coisas em Cristo que me fortalece' (Filipenses 4:13).",
    8: "Setembro é colheita: 'Aquele que semeia com fartura, também colherá com fartura' (2 Coríntios 9:6).",
    9: "Outubro nos inspira a servir: 'Quem quiser ser grande, seja vosso servo' (Mateus 20:26).",
    10: "Novembro nos ensina gratidão: 'Em tudo dai graças' (1 Tessalonicenses 5:18).",
    11: "Dezembro celebra o amor: 'Porque Deus amou o mundo de tal maneira' (João 3:16)."
};

// Datas Comemorativas 2026
const datasComemorativasDefault = {
    0: [ // Janeiro
        { dia: 1, descricao: "Ano Novo", tipo: "feriado" },
        { dia: 15, descricao: "Dia do Professor", tipo: "comemorativo" }
    ],
    1: [ // Fevereiro
        { dia: 8, descricao: "Carnaval", tipo: "comemorativo" },
        { dia: 21, descricao: "Dia Internacional da Língua Materna", tipo: "comemorativo" }
    ],
    2: [ // Março
        { dia: 15, descricao: "Dia da Escola", tipo: "comemorativo" },
        { dia: 27, descricao: "Dia do Teatro", tipo: "comemorativo" }
    ],
    3: [ // Abril
        { dia: 1, descricao: "Dia da Mentira", tipo: "comemorativo" },
        { dia: 23, descricao: "Dia Mundial do Livro", tipo: "comemorativo" }
    ],
    4: [ // Maio
        { dia: 1, descricao: "Dia do Trabalhador", tipo: "feriado" },
        { dia: 25, descricao: "Dia do Trabalhador Rural", tipo: "comemorativo" }
    ],
    5: [ // Junho
        { dia: 5, descricao: "Dia Mundial do Meio Ambiente", tipo: "comemorativo" },
        { dia: 29, descricao: "Dia de São Pedro", tipo: "comemorativo" }
    ],
    6: [ // Julho
        { dia: 20, descricao: "Dia do Amigo", tipo: "comemorativo" },
        { dia: 26, descricao: "Dia dos Avós", tipo: "comemorativo" }
    ],
    7: [ // Agosto
        { dia: 11, descricao: "Dia do Estudante", tipo: "comemorativo" },
        { dia: 25, descricao: "Dia do Soldado", tipo: "comemorativo" }
    ],
    8: [ // Setembro
        { dia: 7, descricao: "Independência do Brasil", tipo: "feriado" },
        { dia: 22, descricao: "Dia da Juventude", tipo: "comemorativo" }
    ],
    9: [ // Outubro
        { dia: 15, descricao: "Dia do Professor", tipo: "comemorativo" },
        { dia: 12, descricao: "Dia da Criança", tipo: "comemorativo" }
    ],
    10: [ // Novembro
        { dia: 2, descricao: "Finados", tipo: "feriado" },
        { dia: 25, descricao: "Dia Internacional pela Eliminação da Violência contra a Mulher", tipo: "comemorativo" }
    ],
    11: [ // Dezembro
        { dia: 8, descricao: "Dia da Família", tipo: "comemorativo" },
        { dia: 25, descricao: "Natal", tipo: "feriado" },
        { dia: 31, descricao: "Ano Novo", tipo: "comemorativo" }
    ]
};

const tipoEventoCores = {
    nacional: '#c62828',
    regional: '#d84315',
    estadual: '#2e7d32',
    municipal: '#558b2f',
    escolar: '#8e24aa',
    religioso: '#ad1457',
    cultural: '#00838f',
    comemorativo: '#f4a261',
    feriado: '#c62828',
    personalizado: '#4a4a4a'
};

let datasComemorativasData = null;
let dataComemorativaContext = null;

async function carregarDatasComemorativasData() {
    const dados = await FirebaseService.getDatasComemorativas();
    if (dados) {
        datasComemorativasData = dados;
    } else {
        datasComemorativasData = JSON.parse(JSON.stringify(datasComemorativasDefault));
        await salvarDatasComemorativas();
    }
}

function obterDatasComemorativas() {
    // Agora assume que já foi carregado no inicio
    return datasComemorativasData || datasComemorativasDefault;
}

async function salvarDatasComemorativas() {
    if (datasComemorativasData) {
        await FirebaseService.saveDatasComemorativas(datasComemorativasData);
    }
}

function obterCorPorTipo(tipo) {
    if (!tipo) return '#f4a261';
    const chave = tipo.toLowerCase();
    return tipoEventoCores[chave] || '#f4a261';
}

const aniversariosStorageKey = 'aniversarios_data_v2';
const mesesAntigosAniversarios = ['Outubro', 'Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'];
const nomeMesParaIndice = meses.reduce((acc, nome, idx) => {
    acc[nome] = idx;
    return acc;
}, {});
let aniversariosData = null;

function gerarId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function carregarAniversariosData() {
    const dados = await FirebaseService.getAniversarios();
    if (dados) {
        aniversariosData = dados;
    } else {
        aniversariosData = Array.from({ length: 12 }, () => []);
        await salvarAniversariosData();
    }
}

function obterAniversariosData() {
    // Assume carregado no inicio
    if (!aniversariosData) return Array.from({ length: 12 }, () => []);
    return aniversariosData;
}

async function salvarAniversariosData() {
    if (aniversariosData) {
        await FirebaseService.saveAniversarios(aniversariosData);
    }
}

function ordenarAniversarios(lista = []) {
    return [...lista].sort((a, b) => {
        const diaA = parseInt(a.dia, 10) || 99;
        const diaB = parseInt(b.dia, 10) || 99;
        return diaA - diaB || (a.nome || '').localeCompare(b.nome || '');
    });
}

function obterAniversariosDoDia(mesIndex, dia) {
    const lista = obterAniversariosData()[mesIndex] || [];
    return lista.filter(item => parseInt(item.dia, 10) === dia && item.nome);
}

// Feriados Nacionais 2026
const feriados2026 = {
    0: [1], // Janeiro: Ano Novo
    3: [18, 19, 21], // Abril: Sexta Santa, Páscoa, Tiradentes
    4: [1], // Maio: Dia do Trabalhador
    8: [7], // Setembro: Independência
    9: [12], // Outubro: Nossa Senhora Aparecida
    10: [2, 15], // Novembro: Finados, Proclamação da República
    11: [25] // Dezembro: Natal
};

// Inicialização
document.addEventListener('DOMContentLoaded', async function () {
    // Inicializar Firebase Service (se necessário) ou apenas usar
    try {
        await FirebaseService.createInitialUser();
    } catch (e) {
        console.error("Erro ao criar usuário inicial", e);
    }

    // Verificar se já tem perfil salvo (agora via Firebase ou estado local temporário se quisessemos cache, mas vamos buscar direto)
    // Para simplificar a migração, vamos manter a lógica de "perfilAtual" em memória/localStorage apenas para a ESCOLHA do perfil (sessão),
    // mas os DADOS serão buscados do Firebase.

    const perfilSalvo = localStorage.getItem('perfilAtual');
    if (perfilSalvo) {
        perfilAtual = perfilSalvo;
        await mostrarConteudoPrincipal();
    } else {
        mostrarTelaLogin();
    }

    // Configurar data atual para semana
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const semana = getWeekNumber(hoje);
    const semanaInput = `${ano}-W${String(semana).padStart(2, '0')}`;
    if (document.getElementById('semana-planner')) {
        document.getElementById('semana-planner').value = semanaInput;
    }

    const tipoEventoSelect = document.getElementById('tipo-data');
    if (tipoEventoSelect) {
        tipoEventoSelect.addEventListener('change', atualizarCorTipoEvento);
    }
});

// Funções de Dados Pessoais
async function salvarDadosPessoais() {
    if (!exigirCoordenador('Somente coordenadores podem atualizar estes dados.')) return;
    const dadosExistentes = await FirebaseService.getDadosPessoais() || {};
    const dados = {
        nome: document.getElementById('nome').value,
        escola: document.getElementById('escola').value,
        areaAtuacao: document.getElementById('area-atuacao').value,
        tempoExperiencia: document.getElementById('tempo-experiencia').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        mensagem: document.getElementById('mensagem-boasvindas').value,
        foto: dadosExistentes.foto || ''
    };

    const arquivoFoto = document.getElementById('foto-coordenador').files[0];
    if (arquivoFoto) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            dados.foto = event.target.result;
            await salvarDadosPessoaisStorage(dados);
        };
        reader.readAsDataURL(arquivoFoto);
    } else {
        await salvarDadosPessoaisStorage(dados);
    }
}

async function salvarDadosPessoaisStorage(dados) {
    try {
        const sucesso = await FirebaseService.saveDadosPessoais(dados);
        if (sucesso) {
            const inputFoto = document.getElementById('foto-coordenador');
            if (inputFoto) inputFoto.value = '';
            atualizarPerfilDisplay(dados);
            alert('Dados pessoais salvos com sucesso!');
        } else {
            alert('Erro ao salvar dados pessoais via Firebase. Verifique o console.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro TÉCNICO ao salvar dados pessoais: ' + e.message);
    }
}

async function carregarDadosPessoais() {
    const dados = await FirebaseService.getDadosPessoais() || {};
    if (document.getElementById('nome')) document.getElementById('nome').value = dados.nome || '';
    if (document.getElementById('escola')) document.getElementById('escola').value = dados.escola || '';
    if (document.getElementById('area-atuacao')) document.getElementById('area-atuacao').value = dados.areaAtuacao || '';
    if (document.getElementById('tempo-experiencia')) document.getElementById('tempo-experiencia').value = dados.tempoExperiencia || '';
    if (document.getElementById('email')) document.getElementById('email').value = dados.email || '';
    if (document.getElementById('telefone')) document.getElementById('telefone').value = dados.telefone || '';
    if (document.getElementById('mensagem-boasvindas')) document.getElementById('mensagem-boasvindas').value = dados.mensagem || '';
    atualizarPerfilDisplay(dados);
}

function atualizarPerfilDisplay(dados = {}) {
    const info = {
        ...perfilPlaceholder,
        ...dados
    };

    const fotoEl = document.getElementById('foto-preview');
    if (fotoEl) {
        fotoEl.src = info.foto || fotoPlaceholder;
        fotoEl.alt = info.nome || 'Foto do Coordenador';
    }

    const map = [
        ['display-nome', info.nome || perfilPlaceholder.nome],
        ['display-area', info.areaAtuacao || perfilPlaceholder.areaAtuacao],
        ['display-escola', info.escola || perfilPlaceholder.escola],
        ['display-experiencia', info.tempoExperiencia || perfilPlaceholder.tempoExperiencia],
        ['display-email', info.email || perfilPlaceholder.email],
        ['display-telefone', info.telefone || perfilPlaceholder.telefone],
        ['display-mensagem', info.mensagem || perfilPlaceholder.mensagem]
    ];
    map.forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '--';
    });
}

// Funções de Calendário Anual
function navegarAno(direcao) {
    anoAtual += direcao;
    document.getElementById('ano-atual').textContent = anoAtual;
    gerarCalendarioAnual();
}

function gerarCalendarioAnual() {
    const container = document.getElementById('calendarios-mensais');
    container.innerHTML = '';

    for (let mes = 0; mes < 12; mes++) {
        const calendario = criarCalendarioMes(mes, anoAtual);
        container.appendChild(calendario);
    }
}

function criarCalendarioMes(mes, ano) {
    const div = document.createElement('div');
    div.className = 'month-calendar';

    const h3 = document.createElement('h3');
    h3.textContent = meses[mes];
    div.appendChild(h3);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Cabeçalho dos dias da semana
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'calendar-day-name';
        header.textContent = dia;
        grid.appendChild(header);
    });

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < diaSemanaInicio; i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    // Dias do mês
    const hoje = new Date();
    const datasMes = obterDatasComemorativas()[mes] || [];
    const aniversariosMes = obterAniversariosData()[mes] || [];
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        const dataAtual = new Date(ano, mes, dia);

        // Verificar eventos do dia
        const eventosDoDia = obterEventosDoDia(dia, mes, ano);
        if (eventosDoDia.length > 0) {
            dayDiv.classList.add('has-event');
            const primeiroEvento = eventosDoDia[0];
            dayDiv.title = `${eventosDoDia.length} agendamento(s) - ${primeiroEvento.titulo}`;
        }

        // Criar estrutura do dia
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = dia;
        dayDiv.appendChild(dayNumber);

        // Adicionar preview do evento se houver
        if (eventosDoDia.length > 0) {
            const preview = document.createElement('div');
            preview.className = 'event-preview';
            preview.textContent = eventosDoDia[0].titulo.substring(0, 10) + (eventosDoDia[0].titulo.length > 10 ? '...' : '');
            dayDiv.appendChild(preview);
        }

        // Verificar se é hoje
        if (dataAtual.toDateString() === hoje.toDateString()) {
            dayDiv.classList.add('today');
        }

        // Verificar se é fim de semana
        if (dataAtual.getDay() === 0 || dataAtual.getDay() === 6) {
            dayDiv.classList.add('weekend');
        }

        // Verificar se é feriado
        if (feriados2026[mes] && feriados2026[mes].includes(dia)) {
            dayDiv.classList.add('holiday');
        }

        // Verificar se há data comemorativa
        const comemorativa = datasMes.find(d => d.dia === dia);
        if (comemorativa) {
            dayDiv.title = (dayDiv.title ? dayDiv.title + ' | ' : '') + comemorativa.descricao;
        }

        const aniversariantesDia = aniversariosMes.filter(aniv => parseInt(aniv.dia, 10) === dia && aniv.nome);
        if (aniversariantesDia.length > 0) {
            dayDiv.classList.add('has-birthday');
            const indicator = document.createElement('div');
            indicator.className = 'birthday-indicator';
            indicator.textContent = '🎈';
            dayDiv.appendChild(indicator);
            const nomes = aniversariantesDia.map(aniv => `Aniversário ${aniv.nome}`).join(', ');
            dayDiv.title = (dayDiv.title ? dayDiv.title + ' | ' : '') + nomes;
        }

        // Adicionar clique no dia
        dayDiv.onclick = () => verEventosDoDia(dia, mes, ano);
        dayDiv.style.cursor = 'pointer';

        grid.appendChild(dayDiv);
    }

    div.appendChild(grid);
    return div;
}

// Funções de Aniversários
function gerarAniversarios() {
    const container = document.getElementById('aniversarios-container');
    container.innerHTML = '';
    const dados = obterAniversariosData();

    meses.forEach((mesNome, mesIndex) => {
        const div = document.createElement('div');
        div.className = 'aniversario-month';

        const h3 = document.createElement('h3');
        h3.textContent = mesNome;
        div.appendChild(h3);

        const lista = ordenarAniversarios(dados[mesIndex] || []);
        if (lista.length === 0) {
            const vazio = document.createElement('p');
            vazio.className = 'info-text';
            vazio.textContent = 'Nenhum aniversariante registrado.';
            div.appendChild(vazio);
        } else {
            lista.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'aniversario-item';

                const display = document.createElement('div');
                display.className = 'aniversario-display';
                display.innerHTML = `
                    <div class="aniversario-dia">${item.dia ? String(item.dia).padStart(2, '0') : '--'}</div>
                    <div class="aniversario-nome"><span class="emoji">🎈</span>${item.nome || 'Nome não informado'}</div>
                `;
                itemDiv.appendChild(display);

                const editor = document.createElement('div');
                editor.className = 'aniversario-editor coord-only';
                editor.innerHTML = `
                    <label>Dia:
                        <input type="number" min="1" max="31" value="${item.dia || ''}" onchange="atualizarAniversarioCampo(${mesIndex}, '${item.id}', 'dia', this.value)">
                    </label>
                    <label>Nome:
                        <input type="text" value="${item.nome || ''}" placeholder="Nome completo" onchange="atualizarAniversarioCampo(${mesIndex}, '${item.id}', 'nome', this.value)">
                    </label>
                    <button class="btn-small btn-delete" onclick="removerAniversario(${mesIndex}, '${item.id}')">Remover</button>
                `;
                itemDiv.appendChild(editor);

                div.appendChild(itemDiv);
            });
        }

        const btnAdd = document.createElement('button');
        btnAdd.className = 'btn-secondary coord-only';
        btnAdd.textContent = '+ Adicionar Aniversariante';
        btnAdd.onclick = () => adicionarAniversario(mesIndex);
        div.appendChild(btnAdd);

        container.appendChild(div);
    });

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

function atualizarAniversarioCampo(mesIndex, itemId, campo, valor) {
    if (!exigirCoordenador()) return;
    const dados = obterAniversariosData();
    const lista = dados[mesIndex] || [];
    const item = lista.find(aniv => aniv.id === itemId);
    if (!item) return;
    item[campo] = valor;
    salvarAniversariosData();
    gerarAniversarios();
    gerarCalendarioAnual();
    gerarDatasComemorativas();
}

function adicionarAniversario(mesIndex) {
    if (!exigirCoordenador()) return;
    const dados = obterAniversariosData();
    dados[mesIndex] = dados[mesIndex] || [];
    dados[mesIndex].push({ id: gerarId(), nome: '', dia: '' });
    salvarAniversariosData();
    gerarAniversarios();
}

function removerAniversario(mesIndex, itemId) {
    if (!exigirCoordenador()) return;
    const dados = obterAniversariosData();
    dados[mesIndex] = (dados[mesIndex] || []).filter(item => item.id !== itemId);
    salvarAniversariosData();
    gerarAniversarios();
    gerarCalendarioAnual();
    gerarDatasComemorativas();
}

// Funções de Planner Mensal
async function carregarPlannerMensal() {
    const mesIndex = parseInt(document.getElementById('mes-planner').value);
    const container = document.getElementById('planner-mensal-content');

    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const dados = await FirebaseService.getPlannerMensal(mesIndex) || {};

    container.innerHTML = `
        <div class="frase-inspiradora">
            ${frasesInspiradoras[mesIndex]}
        </div>
        
        <div class="planner-card">
            <h3>Visão Geral do Mês</h3>
            <textarea id="visao-geral" placeholder="Resumo dos principais objetivos e metas para ${meses[mesIndex]}">${dados.visaoGeral || ''}</textarea>
        </div>
        
        <div class="planner-card">
            <h3>Atividades e Projetos</h3>
            <textarea id="atividades" placeholder="Liste e detalhe atividades pedagógicas ou projetos em andamento">${dados.atividades || ''}</textarea>
        </div>
        
        <div class="planner-card">
            <h3>Reuniões Agendadas</h3>
            <textarea id="reunioes-agendadas" placeholder="Registre reuniões pedagógicas e de equipe">${dados.reunioes || ''}</textarea>
        </div>
        
        <div class="planner-card">
            <h3>Lembretes Importantes</h3>
            <textarea id="lembretes" placeholder="Apontamentos críticos ou pendências">${dados.lembretes || ''}</textarea>
        </div>
        
        <div class="planner-card">
            <h3>Metas do Mês</h3>
            <textarea id="metas" placeholder="Desafios e metas pedagógicas específicas do período">${dados.metas || ''}</textarea>
        </div>
        
        <button class="btn-primary coord-only" onclick="salvarPlannerMensal(${mesIndex})">Salvar Planner Mensal</button>
    `;

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

async function salvarPlannerMensal(mesIndex) {
    if (!exigirCoordenador()) return;
    const dados = {
        visaoGeral: document.getElementById('visao-geral').value,
        atividades: document.getElementById('atividades').value,
        reunioes: document.getElementById('reunioes-agendadas').value,
        lembretes: document.getElementById('lembretes').value,
        metas: document.getElementById('metas').value
    };

    try {
        const sucesso = await FirebaseService.savePlannerMensal(mesIndex, dados);
        if (sucesso) {
            alert('Planner mensal salvo com sucesso!');
        } else {
            alert('Erro ao salvar planner mensal. Verifique o console.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro TÉCNICO ao salvar planner: ' + e.message);
    }
}

// Funções de Planejamento Semanal
async function carregarPlanejamentoSemanal() {
    await sincronizarSemanaSelector();
    const semanaInput = document.getElementById('semana-planner').value;
    const container = document.getElementById('planejamento-semanal-content');
    if (!semanaInput) {
        container.innerHTML = '<p class="info-text">Nenhuma semana registrada ainda.</p>';
        return;
    }
    const [ano, semana] = semanaInput.split('-W').map(Number);

    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const dados = await FirebaseService.getPlanejamentoSemanal(ano, semana) || {};

    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    container.innerHTML = '';

    dias.forEach((diaNome, index) => {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-semana';

        diaDiv.innerHTML = `
            <h3>${diaNome}</h3>
            <textarea id="dia_${index}" placeholder="Anotações, horários, atividades e reuniões">${dados[`dia_${index}`] || ''}</textarea>
            <div class="prioridades">
                <label>Prioridade 1:</label>
                <input type="text" id="prioridade1_${index}" value="${dados[`prioridade1_${index}`] || ''}" placeholder="Primeira prioridade do dia">
                <label>Prioridade 2:</label>
                <input type="text" id="prioridade2_${index}" value="${dados[`prioridade2_${index}`] || ''}" placeholder="Segunda prioridade do dia">
                <label>Prioridade 3:</label>
                <input type="text" id="prioridade3_${index}" value="${dados[`prioridade3_${index}`] || ''}" placeholder="Terceira prioridade do dia">
            </div>
        `;

        container.appendChild(diaDiv);
    });

    container.innerHTML += `
        <div style="grid-column: 1 / -1;">
            <button class="btn-primary coord-only" onclick="salvarPlanejamentoSemanal()">Salvar Planejamento Semanal</button>
        </div>
    `;

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

async function salvarPlanejamentoSemanal() {
    if (!exigirCoordenador()) return;
    const semanaInput = document.getElementById('semana-planner').value;
    const [ano, semana] = semanaInput.split('-W').map(Number);

    const dados = {};
    for (let i = 0; i < 6; i++) {
        dados[`dia_${i}`] = document.getElementById(`dia_${i}`).value;
        dados[`prioridade1_${i}`] = document.getElementById(`prioridade1_${i}`).value;
        dados[`prioridade2_${i}`] = document.getElementById(`prioridade2_${i}`).value;
        dados[`prioridade3_${i}`] = document.getElementById(`prioridade3_${i}`).value;
    }

    const sucesso = await FirebaseService.savePlanejamentoSemanal(ano, semana, dados);
    if (sucesso) {
        await sincronizarSemanaSelector();
        alert('Planejamento semanal salvo com sucesso!');
    } else {
        alert('Erro ao salvar planejamento semanal.');
    }
}

async function listarSemanasPlanejamento() {
    return await FirebaseService.getSemanasRegistradas();
}

function registrarSemanaPlanejamento(ano, semana) {
    // Deprecado: FirebaseService.savePlanejamentoSemanal já lida com o registro
}

function formatarSemanaLabel(valor) {
    if (!valor) return 'Semana';
    const [ano, semana] = valor.split('-W');
    return `Semana ${semana} / ${ano}`;
}

async function sincronizarSemanaSelector() {
    const select = document.getElementById('semana-planner-select');
    const input = document.getElementById('semana-planner');
    if (!select || !input) return;

    if (isCoordenador()) {
        select.style.display = 'none';
        select.innerHTML = '';
        select.disabled = true;
        input.style.display = 'inline-block';
        return;
    }

    const semanas = await listarSemanasPlanejamento();
    select.innerHTML = '';

    if (semanas.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Sem semanas registradas';
        select.appendChild(option);
        select.disabled = true;
        input.value = '';
    } else {
        select.disabled = false;
        semanas.forEach(valor => {
            const option = document.createElement('option');
            option.value = valor;
            option.textContent = formatarSemanaLabel(valor);
            select.appendChild(option);
        });
        if (!semanas.includes(input.value)) {
            input.value = semanas[0];
        }
        select.value = input.value;
    }

    input.style.display = 'none';
    select.style.display = 'inline-block';
}

function selecionarSemanaExistente() {
    const select = document.getElementById('semana-planner-select');
    const input = document.getElementById('semana-planner');
    if (!select || !input) return;
    input.value = select.value;
    carregarPlanejamentoSemanal();
}

// Funções de Planejamento Diário
async function salvarAcompanhamentoAluno() {
    if (!exigirCoordenador()) return;
    const aluno = document.getElementById('aluno-nome').value;
    const turma = document.getElementById('aluno-turma').value;
    const motivo = document.getElementById('motivo-observacao').value;
    const acoes = document.getElementById('acoes-tomadas').value;
    const data = document.getElementById('data-acompanhamento').value;

    if (!aluno || !turma || !motivo || !data) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const acompanhamento = {
        aluno,
        turma,
        motivo,
        acoes,
        proximosPassos: document.getElementById('proximos-passos').value,
        data,
        timestamp: new Date().toISOString()
    };

    const sucesso = await FirebaseService.addAcompanhamentoAluno(acompanhamento);
    if (sucesso) {
        // Limpar formulário
        document.getElementById('aluno-nome').value = '';
        document.getElementById('aluno-turma').value = '';
        document.getElementById('motivo-observacao').value = '';
        document.getElementById('acoes-tomadas').value = '';
        document.getElementById('proximos-passos').value = '';
        document.getElementById('data-acompanhamento').value = '';

        await carregarAcompanhamentos();
        alert('Acompanhamento salvo com sucesso!');
    } else {
        alert('Erro ao salvar acompanhamento.');
    }
}

async function carregarAcompanhamentos() {
    const container = document.getElementById('lista-acompanhamentos');
    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const acompanhamentos = await FirebaseService.getAcompanhamentosAlunos() || [];

    if (acompanhamentos.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhum acompanhamento registrado ainda.</p>';
        if (!isCoordenador()) {
            aplicarRestricoesProfessor();
        }
        return;
    }

    container.innerHTML = '<h3>Acompanhamentos Registrados</h3>';

    // Ordenar por data (mais recente primeiro) se não vier ordenado
    acompanhamentos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    acompanhamentos.forEach((acomp) => {
        const div = document.createElement('div');
        div.className = 'acompanhamento-item';

        // Usar ID do documento para remover
        div.innerHTML = `
            <h4>${acomp.aluno} - ${acomp.turma}</h4>
            <div class="meta">Data: ${formatarData(acomp.data)}</div>
            <div class="content">
                <p><strong>Motivo da Observação:</strong> ${acomp.motivo}</p>
                <p><strong>Ações Tomadas:</strong> ${acomp.acoes}</p>
                <p><strong>Próximos Passos:</strong> ${acomp.proximosPassos}</p>
            </div>
            <button class="btn-secondary coord-only" onclick="removerAcompanhamento('${acomp.id}')">Remover</button>
        `;

        container.appendChild(div);
    });

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

async function removerAcompanhamento(id) {
    if (!exigirCoordenador()) return;
    if (confirm('Deseja realmente remover este acompanhamento?')) {
        const sucesso = await FirebaseService.deleteAcompanhamentoAluno(id);
        if (sucesso) {
            await carregarAcompanhamentos();
        } else {
            alert('Erro ao remover acompanhamento.');
        }
    }
}

// Funções de Acompanhamento de Equipe
function abrirTab(tabName, buttonElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
}

async function salvarReuniao() {
    if (!exigirCoordenador()) return;
    const reuniao = {
        data: document.getElementById('data-reuniao').value,
        participantes: document.getElementById('participantes').value,
        pauta: document.getElementById('pauta-reuniao').value,
        ata: document.getElementById('ata-reuniao').value,
        timestamp: new Date().toISOString()
    };

    if (!reuniao.data) {
        alert('Por favor, preencha a data da reunião.');
        return;
    }

    const sucesso = await FirebaseService.addReuniaoPedagogica(reuniao);
    if (sucesso) {
        // Limpar formulário
        document.getElementById('data-reuniao').value = '';
        document.getElementById('participantes').value = '';
        document.getElementById('pauta-reuniao').value = '';
        document.getElementById('ata-reuniao').value = '';

        await carregarReunioes();
        alert('Reunião salva com sucesso!');
    } else {
        alert('Erro ao salvar reunião.');
    }
}

async function carregarReunioes() {
    const container = document.getElementById('lista-reunioes');
    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const reunioes = await FirebaseService.getReunioesPedagogicas() || [];

    if (reunioes.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhuma reunião registrada ainda.</p>';
        if (!isCoordenador()) {
            aplicarRestricoesProfessor();
        }
        return;
    }

    container.innerHTML = '<h3>Reuniões Registradas</h3>';

    // Ordenar por data (mais recente primeiro)
    reunioes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    reunioes.forEach((reuniao) => {
        const div = document.createElement('div');
        div.className = 'reuniao-item';

        div.innerHTML = `
            <h4>Reunião de ${formatarData(reuniao.data)}</h4>
            <div class="meta">Participantes: ${reuniao.participantes}</div>
            <div class="content">
                <p><strong>Pauta:</strong> ${reuniao.pauta}</p>
                <p><strong>Ata:</strong> ${reuniao.ata}</p>
            </div>
            <button class="btn-secondary coord-only" onclick="removerReuniao('${reuniao.id}')">Remover</button>
        `;

        container.appendChild(div);
    });

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

async function removerReuniao(id) {
    if (!exigirCoordenador()) return;
    if (confirm('Deseja realmente remover esta reunião?')) {
        const sucesso = await FirebaseService.deleteReuniaoPedagogica(id);
        if (sucesso) {
            await carregarReunioes();
        } else {
            alert('Erro ao remover reunião.');
        }
    }
}

async function salvarAvaliacaoMensal() {
    if (!exigirCoordenador()) return;
    const mes = parseInt(document.getElementById('mes-avaliacao').value);
    const avaliacao = {
        mes: mes,
        notas: document.getElementById('notas-desempenho').value,
        decisoes: document.getElementById('decisoes-pedagogicas').value,
        timestamp: new Date().toISOString()
    };

    const sucesso = await FirebaseService.saveAvaliacaoMensal(mes, avaliacao);
    if (sucesso) {
        // Limpar formulário
        document.getElementById('notas-desempenho').value = '';
        document.getElementById('decisoes-pedagogicas').value = '';

        await carregarAvaliacoes();
        alert('Avaliação mensal salva com sucesso!');
    } else {
        alert('Erro ao salvar avaliação mensal.');
    }
}

async function carregarAvaliacoes() {
    const container = document.getElementById('lista-avaliacoes');
    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const avaliacoes = await FirebaseService.getAvaliacoesMensais() || [];

    if (avaliacoes.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhuma avaliação mensal registrada ainda.</p>';
        if (!isCoordenador()) {
            aplicarRestricoesProfessor();
        }
        return;
    }

    container.innerHTML = '<h3>Avaliações Mensais</h3>';

    avaliacoes.sort((a, b) => a.mes - b.mes).forEach((avaliacao) => {
        const div = document.createElement('div');
        div.className = 'avaliacao-item';

        div.innerHTML = `
            <h4>${meses[avaliacao.mes]}</h4>
            <div class="content">
                <p><strong>Notas sobre Desempenho:</strong> ${avaliacao.notas}</p>
                <p><strong>Decisões Pedagógicas Tomadas:</strong> ${avaliacao.decisoes}</p>
            </div>
            <button class="btn-secondary coord-only" onclick="editarAvaliacao(${avaliacao.mes})">Editar</button>
        `;

        container.appendChild(div);
    });

    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

async function editarAvaliacao(mes) {
    if (!exigirCoordenador()) return;
    const avaliacoes = await FirebaseService.getAvaliacoesMensais() || [];
    const avaliacao = avaliacoes.find(a => a.mes === mes);

    if (avaliacao) {
        document.getElementById('mes-avaliacao').value = avaliacao.mes;
        document.getElementById('notas-desempenho').value = avaliacao.notas;
        document.getElementById('decisoes-pedagogicas').value = avaliacao.decisoes;

        // Scroll para o formulário
        document.getElementById('avaliacao-mensal').scrollIntoView({ behavior: 'smooth' });
    }
}

// Funções de Datas Comemorativas
async function gerarDatasComemorativas() {
    const container = document.getElementById('datas-comemorativas-content');
    container.innerHTML = '';
    const datas = obterDatasComemorativas();
    const aniversarios = obterAniversariosData();
    let atualizou = false;

    meses.forEach((mesNome, mesIndex) => {
        const div = document.createElement('div');
        div.className = 'datas-month';

        const h3 = document.createElement('h3');
        h3.textContent = mesNome;
        div.appendChild(h3);

        const eventos = (datas[mesIndex] || []).sort((a, b) => a.dia - b.dia);
        const aniversariosMes = ordenarAniversarios(aniversarios[mesIndex] || []).filter(a => a.nome && a.dia);
        let temConteudo = false;

        if (eventos.length > 0) {
            temConteudo = true;
            eventos.forEach((evento, eventoIndex) => {
                if (!evento.cor) {
                    evento.cor = obterCorPorTipo(evento.tipo);
                    atualizou = true;
                }

                const itemDiv = document.createElement('div');
                itemDiv.className = 'data-item';
                itemDiv.style.borderLeftColor = evento.cor;

                itemDiv.innerHTML = `
                    <div class="data-linha">
                        <span class="data">${String(evento.dia).padStart(2, '0')}/${String(mesIndex + 1).padStart(2, '0')}</span>
                        <span class="data-badge" style="background-color: ${evento.cor};">${formatarTipoEventoLabel(evento.tipo)}</span>
                    </div>
                    <div class="descricao">${evento.descricao}</div>
                `;

                if (isCoordenador()) {
                    const actions = document.createElement('div');
                    actions.className = 'data-actions coord-only';

                    const btnEdit = document.createElement('button');
                    btnEdit.className = 'btn-small btn-edit';
                    btnEdit.textContent = 'Editar';
                    btnEdit.onclick = () => abrirModalDataComemorativa(mesIndex, eventoIndex);

                    const btnDelete = document.createElement('button');
                    btnDelete.className = 'btn-small btn-delete';
                    btnDelete.textContent = 'Excluir';
                    btnDelete.onclick = () => removerDataComemorativa(mesIndex, eventoIndex);

                    actions.appendChild(btnEdit);
                    actions.appendChild(btnDelete);
                    itemDiv.appendChild(actions);
                }

                div.appendChild(itemDiv);
            });
        }

        if (aniversariosMes.length > 0) {
            temConteudo = true;
            const titulo = document.createElement('p');
            titulo.className = 'datas-subtitle';
            titulo.textContent = 'Aniversariantes';
            div.appendChild(titulo);

            aniversariosMes.forEach(aniv => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'data-item birthday-item';
                itemDiv.style.borderLeftColor = '#ff6f91';
                itemDiv.innerHTML = `
                    <div class="data-linha">
                        <span class="data">🎈 ${String(aniv.dia).padStart(2, '0')}/${String(mesIndex + 1).padStart(2, '0')}</span>
                        <span class="data-badge birthday-badge">Aniversário</span>
                    </div>
                    <div class="descricao">${aniv.nome}</div>
                `;
                div.appendChild(itemDiv);
            });
        }

        if (!temConteudo) {
            const empty = document.createElement('p');
            empty.className = 'info-text';
            empty.textContent = 'Nenhuma data comemorativa neste mês.';
            div.appendChild(empty);
        }

        if (isCoordenador()) {
            const btnAdd = document.createElement('button');
            btnAdd.className = 'btn-secondary coord-only';
            btnAdd.textContent = '+ Adicionar Data';
            btnAdd.onclick = () => abrirModalDataComemorativa(mesIndex);
            div.appendChild(btnAdd);
        }

        container.appendChild(div);
    });

    if (atualizou) {
        await salvarDatasComemorativas();
    }
}

function formatarTipoEventoLabel(tipo) {
    if (!tipo) return 'Comemorativo';
    const texto = tipo.toString().replace(/_/g, ' ');
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function abrirModalDataComemorativa(mesIndex, eventoIndex = null) {
    if (!exigirCoordenador()) return;
    const modal = document.getElementById('modal-data-comemorativa');
    const datas = obterDatasComemorativas();
    const eventosMes = datas[mesIndex] || [];
    const evento = eventoIndex !== null ? eventosMes[eventoIndex] : { dia: '', descricao: '', tipo: 'comemorativo', cor: obterCorPorTipo('comemorativo') };

    dataComemorativaContext = { mesIndex, eventoIndex };

    document.getElementById('mes-evento-label').value = meses[mesIndex];
    document.getElementById('data-dia').value = evento.dia || '';
    document.getElementById('data-descricao').value = evento.descricao || '';
    document.getElementById('tipo-data').value = (evento.tipo || 'comemorativo');
    document.getElementById('cor-data').value = evento.cor || obterCorPorTipo(evento.tipo);

    modal.classList.add('active');
    modal.onclick = function (e) {
        if (e.target === modal) {
            fecharModalDataComemorativa();
        }
    };
}

function fecharModalDataComemorativa() {
    const modal = document.getElementById('modal-data-comemorativa');
    modal.classList.remove('active');
    dataComemorativaContext = null;
    document.getElementById('data-dia').value = '';
    document.getElementById('data-descricao').value = '';
}

function salvarDataComemorativa() {
    if (!exigirCoordenador()) return;
    if (!dataComemorativaContext) return;

    const dia = parseInt(document.getElementById('data-dia').value, 10);
    const descricao = document.getElementById('data-descricao').value.trim();
    const tipo = document.getElementById('tipo-data').value || 'comemorativo';
    const cor = document.getElementById('cor-data').value || obterCorPorTipo(tipo);

    if (!dia || dia < 1 || dia > 31 || !descricao) {
        alert('Informe o dia (1 a 31) e a descrição do evento.');
        return;
    }

    const datas = obterDatasComemorativas();
    datas[dataComemorativaContext.mesIndex] = datas[dataComemorativaContext.mesIndex] || [];
    const eventosMes = datas[dataComemorativaContext.mesIndex];
    const evento = { dia, descricao, tipo, cor };

    if (dataComemorativaContext.eventoIndex !== null) {
        eventosMes[dataComemorativaContext.eventoIndex] = evento;
    } else {
        eventosMes.push(evento);
    }

    salvarDatasComemorativas();
    gerarDatasComemorativas();
    fecharModalDataComemorativa();
}

function removerDataComemorativa(mesIndex, eventoIndex) {
    if (!exigirCoordenador()) return;
    if (!confirm('Deseja remover esta data comemorativa?')) return;

    const datas = obterDatasComemorativas();
    datas[mesIndex] = datas[mesIndex] || [];
    datas[mesIndex].splice(eventoIndex, 1);
    salvarDatasComemorativas();
    gerarDatasComemorativas();
}

function atualizarCorTipoEvento() {
    const tipo = document.getElementById('tipo-data')?.value;
    const corInput = document.getElementById('cor-data');
    if (tipo && corInput) {
        corInput.value = obterCorPorTipo(tipo);
    }
}

// Funções Auxiliares
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Navegação suave
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }, 100);
});

// ========== FUNÇÕES DE PERFIL ==========

function mostrarTelaLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

async function mostrarConteudoPrincipal() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';

    atualizarInterfacePorPerfil();

    // Carregar dados iniciais essenciais para renderização
    await Promise.all([
        carregarDadosPessoais(),
        carregarDatasComemorativasData(),
        carregarAniversariosData()
    ]);

    gerarCalendarioAnual();
    gerarAniversarios();
    await carregarPlannerMensal();
    await carregarPlanejamentoSemanal();
    await sincronizarSemanaSelector();
    await carregarAcompanhamentos();
    await carregarReunioes();
    await carregarAvaliacoes();
    await gerarDatasComemorativas();
}

function selecionarPerfil(perfil) {
    if (perfil === 'coordenador') {
        abrirModalLogin();
    } else {
        perfilAtual = perfil;
        localStorage.setItem('perfilAtual', perfil);
        mostrarConteudoPrincipal();
    }
}

function abrirModalLogin() {
    document.getElementById('modal-login').classList.add('active');
}

function fecharModalLogin() {
    document.getElementById('modal-login').classList.remove('active');
    document.getElementById('login-usuario').value = '';
    document.getElementById('login-senha').value = '';
}

async function fazerLogin() {
    const usuario = document.getElementById('login-usuario').value;
    const senha = document.getElementById('login-senha').value;

    if (!usuario || !senha) {
        alert('Por favor, preencha usuário e senha.');
        return;
    }

    const valido = await FirebaseService.checkLogin(usuario, senha);
    if (valido) {
        perfilAtual = 'coordenador';
        localStorage.setItem('perfilAtual', 'coordenador');
        fecharModalLogin();
        mostrarConteudoPrincipal();
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

function trocarPerfil() {
    if (confirm('Deseja trocar de perfil? Você precisará selecionar novamente.')) {
        localStorage.removeItem('perfilAtual');
        perfilAtual = null;
        mostrarTelaLogin();
    }
}

function atualizarInterfacePorPerfil() {
    const indicator = document.getElementById('perfil-indicator');
    if (indicator) {
        indicator.textContent = perfilAtual === 'coordenador' ? '👤 Coordenador' : '👨‍🏫 Professor';
    }

    const body = document.body;
    const formDados = document.getElementById('form-dados-pessoais');
    if (perfilAtual === 'professor') {
        body.classList.add('modo-professor');
        if (formDados) formDados.style.display = 'none';

        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(campo => {
            if (!campo.id.includes('comentario') && !campo.id.includes('novo-comentario')) {
                campo.setAttribute('readonly', 'readonly');
            }
        });
        document.querySelectorAll('input[type="file"]').forEach(campo => campo.disabled = true);

        const btnNovoAgendamento = document.getElementById('btn-novo-agendamento');
        if (btnNovoAgendamento) btnNovoAgendamento.style.display = 'none';
    } else {
        body.classList.remove('modo-professor');
        if (formDados) formDados.style.display = 'block';

        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(campo => {
            campo.removeAttribute('readonly');
        });
        document.querySelectorAll('input[type="file"]').forEach(campo => campo.disabled = false);

        const btnNovoAgendamento = document.getElementById('btn-novo-agendamento');
        if (btnNovoAgendamento) btnNovoAgendamento.style.display = 'inline-block';
    }

    aplicarRestricoesProfessor();
    sincronizarSemanaSelector();
}

// ========== FUNÇÕES DE AGENDAMENTOS ==========

function abrirModalAgendamento(data, mes, ano) {
    if (perfilAtual !== 'coordenador') {
        alert('Apenas coordenadores podem criar agendamentos.');
        return;
    }

    eventoEditando = null;
    const modal = document.getElementById('modal-agendamento');
    document.getElementById('evento-data').value = data || '';
    document.getElementById('evento-horario').value = '';
    document.getElementById('evento-titulo').value = '';
    document.getElementById('evento-descricao').value = '';

    // Se data foi passada, formatar corretamente
    if (data && mes !== undefined && ano !== undefined) {
        const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(data).padStart(2, '0')}`;
        document.getElementById('evento-data').value = dataFormatada;
    }

    modal.classList.add('active');

    // Fechar ao clicar fora do modal
    modal.onclick = function (e) {
        if (e.target === modal) {
            fecharModalAgendamento();
        }
    };
}

function fecharModalAgendamento() {
    document.getElementById('modal-agendamento').classList.remove('active');
    eventoEditando = null;
}

async function salvarAgendamento() {
    if (!exigirCoordenador()) return;
    const evento = {
        id: eventoEditando ? eventoEditando.id : Date.now().toString(),
        data: document.getElementById('evento-data').value,
        horario: document.getElementById('evento-horario').value,
        titulo: document.getElementById('evento-titulo').value,
        descricao: document.getElementById('evento-descricao').value,
        timestamp: new Date().toISOString()
    };

    if (!evento.data || !evento.titulo) {
        alert('Por favor, preencha pelo menos a data e o título do evento.');
        return;
    }

    let sucesso = false;
    if (eventoEditando) {
        sucesso = await FirebaseService.updateAgendamento(evento);
    } else {
        sucesso = await FirebaseService.addAgendamento(evento);
    }

    try {
        if (sucesso) {
            fecharModalAgendamento();
            gerarCalendarioAnual();

            // Mostrar o evento recém-criado no painel
            const data = new Date(evento.data);
            setTimeout(() => {
                verEventosDoDia(data.getDate(), data.getMonth(), data.getFullYear());
            }, 300);
            alert('Agendamento salvo com sucesso!');
        } else {
            alert('Erro ao salvar agendamento. Verifique se você tem permissão.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro TÉCNICO ao salvar agendamento: ' + e.message);
    }
}

async function obterEventosDoDia(dia, mes, ano) {
    const eventos = await FirebaseService.getAgendamentos() || [];
    const dataString = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(e => e.data === dataString);
}

function editarEvento(evento) {
    if (perfilAtual !== 'coordenador') {
        alert('Apenas coordenadores podem editar agendamentos.');
        return;
    }

    eventoEditando = evento;
    document.getElementById('evento-data').value = evento.data;
    document.getElementById('evento-horario').value = evento.horario || '';
    document.getElementById('evento-titulo').value = evento.titulo;
    document.getElementById('evento-descricao').value = evento.descricao || '';
    document.getElementById('modal-agendamento').classList.add('active');
}

async function removerEvento(eventoId) {
    if (perfilAtual !== 'coordenador') {
        alert('Apenas coordenadores podem remover agendamentos.');
        return;
    }

    if (confirm('Deseja realmente remover este agendamento?')) {
        const sucesso = await FirebaseService.deleteAgendamento(eventoId);
        if (sucesso) {
            gerarCalendarioAnual();
            fecharPainelEventos();
            // Sem refresh automatico do painel pois fechou-se
        } else {
            alert('Erro ao remover agendamento.');
        }
    }
}

async function verEventosDoDia(dia, mes, ano) {
    const eventos = await obterEventosDoDia(dia, mes, ano);
    if (eventos.length === 0) {
        if (perfilAtual === 'coordenador') {
            abrirModalAgendamento(dia, mes, ano);
        } else {
            mostrarPainelEventos([], dia, mes, ano);
        }
    } else {
        mostrarPainelEventos(eventos, dia, mes, ano);
    }
}

function mostrarPainelEventos(eventos, dia, mes, ano) {
    const panel = document.getElementById('eventos-panel');
    const overlay = document.getElementById('overlay-eventos');
    const content = document.getElementById('eventos-panel-content');

    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;

    content.innerHTML = `<div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border-color);">
        <h4 style="color: var(--primary-color); margin: 0 0 0.5rem 0;">${dataFormatada}</h4>
        <p style="color: #666; margin: 0;">${eventos.length === 0 ? 'Nenhum agendamento para este dia' : `${eventos.length} agendamento(s)`}</p>
    </div>`;

    if (eventos.length === 0) {
        if (perfilAtual === 'coordenador') {
            content.innerHTML += `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: #666; margin-bottom: 1.5rem;">Não há agendamentos para este dia.</p>
                    <button class="btn-primary" onclick="fecharPainelEventos(); abrirModalAgendamento(${dia}, ${mes}, ${ano});">➕ Criar Agendamento</button>
                </div>
            `;
        }
    } else {
        eventos.forEach(evento => {
            const div = document.createElement('div');
            div.className = 'evento-detalhe';

            div.innerHTML = `
                <div class="evento-data">${formatarData(evento.data)}</div>
                <div class="evento-horario">🕐 ${evento.horario || 'Sem horário definido'}</div>
                <div class="evento-titulo">${evento.titulo}</div>
                ${evento.descricao ? `<div class="evento-descricao">${evento.descricao}</div>` : ''}
            `;

            if (perfilAtual === 'coordenador') {
                const acoesDiv = document.createElement('div');
                acoesDiv.className = 'evento-acoes';

                const btnEdit = document.createElement('button');
                btnEdit.className = 'btn-small btn-edit';
                btnEdit.textContent = '✏️ Editar';
                btnEdit.onclick = () => {
                    fecharPainelEventos();
                    editarEvento(evento);
                };

                const btnDelete = document.createElement('button');
                btnDelete.className = 'btn-small btn-delete';
                btnDelete.textContent = '🗑️ Remover';
                btnDelete.onclick = () => {
                    if (confirm('Deseja realmente remover este agendamento?')) {
                        removerEvento(evento.id);
                        verEventosDoDia(dia, mes, ano);
                    }
                };

                acoesDiv.appendChild(btnEdit);
                acoesDiv.appendChild(btnDelete);
                div.appendChild(acoesDiv);
            }

            content.appendChild(div);
        });
    }

    panel.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharPainelEventos() {
    const panel = document.getElementById('eventos-panel');
    const overlay = document.getElementById('overlay-eventos');
    panel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== FUNÇÕES DE COMENTÁRIOS ==========

function abrirModalComentarios(contexto) {
    comentarioContexto = contexto;
    const modal = document.getElementById('modal-comentarios');
    carregarComentarios();
    modal.classList.add('active');

    // Fechar ao clicar fora do modal
    modal.onclick = function (e) {
        if (e.target === modal) {
            fecharModalComentarios();
        }
    };
}

function fecharModalComentarios() {
    document.getElementById('modal-comentarios').classList.remove('active');
    comentarioContexto = null;
    document.getElementById('novo-comentario').value = '';
}

async function carregarComentarios() {
    const container = document.getElementById('comentarios-container');
    container.innerHTML = '<p class="info-text">Carregando...</p>';

    const comentarios = await FirebaseService.getComentarios(comentarioContexto) || [];

    if (comentarios.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
    } else {
        container.innerHTML = '';
        // Ordenar, mais recente primeiro
        comentarios.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        comentarios.forEach(comentario => {
            const div = document.createElement('div');
            div.className = 'comentario-item';
            div.innerHTML = `
                <div class="comentario-header">
                    <span class="comentario-autor">${comentario.autor || 'Professor'}</span>
                    <span class="comentario-data">${formatarDataHora(comentario.timestamp)}</span>
                </div>
                <div class="comentario-texto">${comentario.texto}</div>
            `;
            container.appendChild(div);
        });
    }
}

async function adicionarComentario() {
    const texto = document.getElementById('novo-comentario').value.trim();
    if (!texto) {
        alert('Por favor, digite um comentário.');
        return;
    }

    if (!comentarioContexto) {
        alert('Erro: contexto não definido.');
        return;
    }

    const comentario = {
        contexto: comentarioContexto,
        texto: texto,
        autor: perfilAtual === 'professor' ? 'Professor' : 'Coordenador',
        timestamp: new Date().toISOString()
    };

    const sucesso = await FirebaseService.addComentario(comentario);

    if (sucesso) {
        document.getElementById('novo-comentario').value = '';
        await carregarComentarios();
    } else {
        alert('Erro ao adicionar comentário.');
    }
}

function formatarDataHora(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR');
}

function aplicarRestricoesProfessor() {
    if (!isCoordenador()) {
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(campo => {
            if (!campo.id.includes('comentario') && !campo.id.includes('novo-comentario') && !campo.id.includes('login-')) {
                campo.setAttribute('readonly', 'readonly');
            }
        });
        document.querySelectorAll('input[type="file"]').forEach(campo => {
            campo.disabled = true;
        });
    }
}


// Expor funções para o escopo global (window)
window.selecionarPerfil = selecionarPerfil;
window.trocarPerfil = trocarPerfil;
window.abrirModalLogin = abrirModalLogin;
window.fecharModalLogin = fecharModalLogin;
window.fazerLogin = fazerLogin;
window.salvarDadosPessoais = salvarDadosPessoais; // Added
window.navegarAno = navegarAno; // Added
window.abrirModalAgendamento = abrirModalAgendamento; // Added
window.fecharModalAgendamento = fecharModalAgendamento;
window.salvarAgendamento = salvarAgendamento;
window.verEventosDoDia = verEventosDoDia; // Added
window.editarEvento = editarEvento;
window.removerEvento = removerEvento;
window.fecharPainelEventos = fecharPainelEventos;
window.adicionarAniversario = adicionarAniversario; // Added
window.atualizarAniversarioCampo = atualizarAniversarioCampo; // Added
window.removerAniversario = removerAniversario; // Added
window.carregarPlannerMensal = carregarPlannerMensal; // Added
window.salvarPlannerMensal = salvarPlannerMensal;
window.carregarPlanejamentoSemanal = carregarPlanejamentoSemanal; // Added
window.selecionarSemanaExistente = selecionarSemanaExistente; // Added
window.salvarPlanejamentoSemanal = salvarPlanejamentoSemanal;
window.salvarAcompanhamentoAluno = salvarAcompanhamentoAluno;
window.removerAcompanhamento = removerAcompanhamento;
window.abrirTab = abrirTab; // Added
window.salvarReuniao = salvarReuniao;
window.removerReuniao = removerReuniao;
window.salvarAvaliacaoMensal = salvarAvaliacaoMensal;
window.editarAvaliacao = editarAvaliacao;
window.abrirModalDataComemorativa = abrirModalDataComemorativa; // Added
window.fecharModalDataComemorativa = fecharModalDataComemorativa;
window.salvarDataComemorativa = salvarDataComemorativa;
window.removerDataComemorativa = removerDataComemorativa; // Added
window.abrirModalComentarios = abrirModalComentarios; // Added
window.fecharModalComentarios = fecharModalComentarios;
window.adicionarComentario = adicionarComentario;
