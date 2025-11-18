// Dados e Configurações
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const mesesAniversarios = ['Outubro', 'Novembro', 'Dezembro', 'Janeiro', 'Fevereiro', 
                           'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro'];

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
const datasComemorativas = {
    0: [ // Janeiro
        {dia: 1, descricao: "Ano Novo", tipo: "feriado"},
        {dia: 6, descricao: "Dia de Reis", tipo: "comemorativo"},
        {dia: 4, descricao: "Dia do Braille", tipo: "comemorativo"},
        {dia: 15, descricao: "Dia do Professor", tipo: "comemorativo"}
    ],
    1: [ // Fevereiro
        {dia: 2, descricao: "Dia de Iemanjá", tipo: "comemorativo"},
        {dia: 8, descricao: "Carnaval", tipo: "comemorativo"},
        {dia: 9, descricao: "Carnaval", tipo: "comemorativo"},
        {dia: 10, descricao: "Quarta-feira de Cinzas", tipo: "comemorativo"},
        {dia: 14, descricao: "Dia dos Namorados", tipo: "comemorativo"},
        {dia: 21, descricao: "Dia Internacional da Língua Materna", tipo: "comemorativo"}
    ],
    2: [ // Março
        {dia: 8, descricao: "Dia Internacional da Mulher", tipo: "comemorativo"},
        {dia: 14, descricao: "Dia Nacional da Poesia", tipo: "comemorativo"},
        {dia: 15, descricao: "Dia da Escola", tipo: "comemorativo"},
        {dia: 20, descricao: "Dia Internacional da Felicidade", tipo: "comemorativo"},
        {dia: 21, descricao: "Dia Internacional contra a Discriminação Racial", tipo: "comemorativo"},
        {dia: 25, descricao: "Dia Nacional do Orgulho Gay", tipo: "comemorativo"},
        {dia: 27, descricao: "Dia do Teatro", tipo: "comemorativo"}
    ],
    3: [ // Abril
        {dia: 1, descricao: "Dia da Mentira", tipo: "comemorativo"},
        {dia: 2, descricao: "Dia Mundial de Conscientização do Autismo", tipo: "comemorativo"},
        {dia: 7, descricao: "Dia Mundial da Saúde", tipo: "comemorativo"},
        {dia: 18, descricao: "Sexta-feira Santa", tipo: "feriado"},
        {dia: 19, descricao: "Páscoa", tipo: "feriado"},
        {dia: 21, descricao: "Tiradentes", tipo: "feriado"},
        {dia: 22, descricao: "Dia da Terra", tipo: "comemorativo"},
        {dia: 23, descricao: "Dia Mundial do Livro", tipo: "comemorativo"}
    ],
    4: [ // Maio
        {dia: 1, descricao: "Dia do Trabalhador", tipo: "feriado"},
        {dia: 5, descricao: "Dia Nacional das Comunicações", tipo: "comemorativo"},
        {dia: 8, descricao: "Dia das Mães", tipo: "comemorativo"},
        {dia: 13, descricao: "Abolição da Escravatura", tipo: "comemorativo"},
        {dia: 15, descricao: "Dia do Assistente Social", tipo: "comemorativo"},
        {dia: 18, descricao: "Dia Internacional dos Museus", tipo: "comemorativo"},
        {dia: 25, descricao: "Dia do Trabalhador Rural", tipo: "comemorativo"}
    ],
    5: [ // Junho
        {dia: 5, descricao: "Dia Mundial do Meio Ambiente", tipo: "comemorativo"},
        {dia: 12, descricao: "Dia dos Namorados (Brasil)", tipo: "comemorativo"},
        {dia: 19, descricao: "Dia do Cinema Brasileiro", tipo: "comemorativo"},
        {dia: 24, descricao: "Festa Junina - São João", tipo: "comemorativo"},
        {dia: 29, descricao: "Dia de São Pedro", tipo: "comemorativo"}
    ],
    6: [ // Julho
        {dia: 2, descricao: "Dia do Bombeiro", tipo: "comemorativo"},
        {dia: 8, descricao: "Dia do Panificador", tipo: "comemorativo"},
        {dia: 20, descricao: "Dia do Amigo", tipo: "comemorativo"},
        {dia: 25, descricao: "Dia do Escritor", tipo: "comemorativo"},
        {dia: 26, descricao: "Dia dos Avós", tipo: "comemorativo"}
    ],
    7: [ // Agosto
        {dia: 11, descricao: "Dia do Estudante", tipo: "comemorativo"},
        {dia: 12, descricao: "Dia Nacional das Artes", tipo: "comemorativo"},
        {dia: 15, descricao: "Dia dos Pais", tipo: "comemorativo"},
        {dia: 22, descricao: "Dia do Folclore", tipo: "comemorativo"},
        {dia: 25, descricao: "Dia do Soldado", tipo: "comemorativo"}
    ],
    8: [ // Setembro
        {dia: 5, descricao: "Dia da Amazônia", tipo: "comemorativo"},
        {dia: 7, descricao: "Independência do Brasil", tipo: "feriado"},
        {dia: 8, descricao: "Dia Internacional da Alfabetização", tipo: "comemorativo"},
        {dia: 21, descricao: "Dia da Árvore", tipo: "comemorativo"},
        {dia: 22, descricao: "Dia da Juventude", tipo: "comemorativo"}
    ],
    9: [ // Outubro
        {dia: 4, descricao: "Dia de São Francisco", tipo: "comemorativo"},
        {dia: 5, descricao: "Dia Mundial dos Professores", tipo: "comemorativo"},
        {dia: 12, descricao: "Nossa Senhora Aparecida", tipo: "feriado"},
        {dia: 15, descricao: "Dia do Professor", tipo: "comemorativo"},
        {dia: 16, descricao: "Dia Mundial da Alimentação", tipo: "comemorativo"},
        {dia: 31, descricao: "Halloween", tipo: "comemorativo"}
    ],
    10: [ // Novembro
        {dia: 2, descricao: "Finados", tipo: "feriado"},
        {dia: 15, descricao: "Proclamação da República", tipo: "feriado"},
        {dia: 19, descricao: "Dia da Bandeira", tipo: "comemorativo"},
        {dia: 20, descricao: "Dia da Consciência Negra", tipo: "comemorativo"},
        {dia: 25, descricao: "Dia Internacional pela Eliminação da Violência contra a Mulher", tipo: "comemorativo"}
    ],
    11: [ // Dezembro
        {dia: 1, descricao: "Dia Mundial de Combate à AIDS", tipo: "comemorativo"},
        {dia: 8, descricao: "Dia da Família", tipo: "comemorativo"},
        {dia: 10, descricao: "Dia Internacional dos Direitos Humanos", tipo: "comemorativo"},
        {dia: 25, descricao: "Natal", tipo: "feriado"},
        {dia: 31, descricao: "Ano Novo", tipo: "comemorativo"}
    ]
};

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
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já tem perfil salvo
    const perfilSalvo = localStorage.getItem('perfilAtual');
    if (perfilSalvo) {
        perfilAtual = perfilSalvo;
        mostrarConteudoPrincipal();
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
});

// Funções de Dados Pessoais
function salvarDadosPessoais() {
    if (!exigirCoordenador('Somente coordenadores podem atualizar estes dados.')) return;
    const dadosExistentes = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
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
        reader.onload = function(event) {
            dados.foto = event.target.result;
            salvarDadosPessoaisStorage(dados);
        };
        reader.readAsDataURL(arquivoFoto);
    } else {
        salvarDadosPessoaisStorage(dados);
    }
}

function salvarDadosPessoaisStorage(dados) {
    localStorage.setItem('dadosPessoais', JSON.stringify(dados));
    const inputFoto = document.getElementById('foto-coordenador');
    if (inputFoto) inputFoto.value = '';
    atualizarPerfilDisplay(dados);
    alert('Dados pessoais salvos com sucesso!');
}

function carregarDadosPessoais() {
    const dados = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
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
        if (datasComemorativas[mes]) {
            const comemorativa = datasComemorativas[mes].find(d => d.dia === dia);
            if (comemorativa) {
                dayDiv.title = (dayDiv.title ? dayDiv.title + ' | ' : '') + comemorativa.descricao;
            }
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
    
    mesesAniversarios.forEach((mesNome, index) => {
        const div = document.createElement('div');
        div.className = 'aniversario-month';
        
        const h3 = document.createElement('h3');
        h3.textContent = mesNome;
        div.appendChild(h3);
        
        const aniversarios = JSON.parse(localStorage.getItem(`aniversarios_${index}`) || '[]');
        
        // Adicionar aniversários existentes
        aniversarios.forEach((nome, idx) => {
            const item = criarItemAniversario(nome, index, idx);
            div.appendChild(item);
        });
        
        // Botão para adicionar novo
        const btnAdd = document.createElement('button');
        btnAdd.className = 'btn-secondary coord-only btn-add-aniversario';
        btnAdd.textContent = '+ Adicionar Aniversariante';
        btnAdd.onclick = () => adicionarAniversario(index, div);
        div.appendChild(btnAdd);
        
        container.appendChild(div);
    });
    
    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

function criarItemAniversario(nome, mesIndex, itemIndex) {
    const div = document.createElement('div');
    div.className = 'aniversario-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = nome;
    input.placeholder = 'Nome do aniversariante';
    input.onchange = () => salvarAniversario(mesIndex, itemIndex, input.value);
    
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn-secondary coord-only';
    btnRemover.textContent = 'Remover';
    btnRemover.style.marginTop = '0.5rem';
    btnRemover.onclick = () => removerAniversario(mesIndex, itemIndex);
    
    div.appendChild(input);
    div.appendChild(btnRemover);
    
    return div;
}

function adicionarAniversario(mesIndex, container) {
    if (!exigirCoordenador()) return;
    const aniversarios = JSON.parse(localStorage.getItem(`aniversarios_${mesIndex}`) || '[]');
    aniversarios.push('');
    localStorage.setItem(`aniversarios_${mesIndex}`, JSON.stringify(aniversarios));
    
    const item = criarItemAniversario('', mesIndex, aniversarios.length - 1);
    const btnAdd = container.querySelector('.btn-add-aniversario');
    container.insertBefore(item, btnAdd);
}

function salvarAniversario(mesIndex, itemIndex, nome) {
    if (!exigirCoordenador()) return;
    const aniversarios = JSON.parse(localStorage.getItem(`aniversarios_${mesIndex}`) || '[]');
    aniversarios[itemIndex] = nome;
    localStorage.setItem(`aniversarios_${mesIndex}`, JSON.stringify(aniversarios));
}

function removerAniversario(mesIndex, itemIndex) {
    if (!exigirCoordenador()) return;
    const aniversarios = JSON.parse(localStorage.getItem(`aniversarios_${mesIndex}`) || '[]');
    aniversarios.splice(itemIndex, 1);
    localStorage.setItem(`aniversarios_${mesIndex}`, JSON.stringify(aniversarios));
    gerarAniversarios();
}

// Funções de Planner Mensal
function carregarPlannerMensal() {
    const mesIndex = parseInt(document.getElementById('mes-planner').value);
    const container = document.getElementById('planner-mensal-content');
    
    const dados = JSON.parse(localStorage.getItem(`planner_mensal_${mesIndex}`) || '{}');
    
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

function salvarPlannerMensal(mesIndex) {
    if (!exigirCoordenador()) return;
    const dados = {
        visaoGeral: document.getElementById('visao-geral').value,
        atividades: document.getElementById('atividades').value,
        reunioes: document.getElementById('reunioes-agendadas').value,
        lembretes: document.getElementById('lembretes').value,
        metas: document.getElementById('metas').value
    };
    localStorage.setItem(`planner_mensal_${mesIndex}`, JSON.stringify(dados));
    alert('Planner mensal salvo com sucesso!');
}

// Funções de Planejamento Semanal
function carregarPlanejamentoSemanal() {
    const semanaInput = document.getElementById('semana-planner').value;
    const [ano, semana] = semanaInput.split('-W').map(Number);
    
    const container = document.getElementById('planejamento-semanal-content');
    const dados = JSON.parse(localStorage.getItem(`planejamento_semanal_${ano}_${semana}`) || '{}');
    
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

function salvarPlanejamentoSemanal() {
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
    
    localStorage.setItem(`planejamento_semanal_${ano}_${semana}`, JSON.stringify(dados));
    alert('Planejamento semanal salvo com sucesso!');
}

// Funções de Planejamento Diário
function salvarAcompanhamentoAluno() {
    if (!exigirCoordenador()) return;
    const acompanhamento = {
        data: document.getElementById('data-acompanhamento').value,
        aluno: document.getElementById('aluno-nome').value,
        turma: document.getElementById('aluno-turma').value,
        motivo: document.getElementById('motivo-observacao').value,
        acoes: document.getElementById('acoes-tomadas').value,
        proximosPassos: document.getElementById('proximos-passos').value,
        timestamp: new Date().toISOString()
    };
    
    if (!acompanhamento.data || !acompanhamento.aluno) {
        alert('Por favor, preencha pelo menos a data e o nome do aluno.');
        return;
    }
    
    const acompanhamentos = JSON.parse(localStorage.getItem('acompanhamentos_alunos') || '[]');
    acompanhamentos.push(acompanhamento);
    localStorage.setItem('acompanhamentos_alunos', JSON.stringify(acompanhamentos));
    
    // Limpar formulário
    document.getElementById('data-acompanhamento').value = '';
    document.getElementById('aluno-nome').value = '';
    document.getElementById('aluno-turma').value = '';
    document.getElementById('motivo-observacao').value = '';
    document.getElementById('acoes-tomadas').value = '';
    document.getElementById('proximos-passos').value = '';
    
    carregarAcompanhamentos();
    alert('Acompanhamento salvo com sucesso!');
}

function carregarAcompanhamentos() {
    const container = document.getElementById('lista-acompanhamentos');
    const acompanhamentos = JSON.parse(localStorage.getItem('acompanhamentos_alunos') || '[]');
    
    if (acompanhamentos.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhum acompanhamento registrado ainda.</p>';
        if (!isCoordenador()) {
            aplicarRestricoesProfessor();
        }
        return;
    }
    
    container.innerHTML = '<h3>Acompanhamentos Registrados</h3>';
    
    acompanhamentos.reverse().forEach((acomp, index) => {
        const div = document.createElement('div');
        div.className = 'acompanhamento-item';
        
        div.innerHTML = `
            <h4>${acomp.aluno} - ${acomp.turma}</h4>
            <div class="meta">Data: ${formatarData(acomp.data)}</div>
            <div class="content">
                <p><strong>Motivo da Observação:</strong> ${acomp.motivo}</p>
                <p><strong>Ações Tomadas:</strong> ${acomp.acoes}</p>
                <p><strong>Próximos Passos:</strong> ${acomp.proximosPassos}</p>
            </div>
            <button class="btn-secondary coord-only" onclick="removerAcompanhamento(${acompanhamentos.length - 1 - index})">Remover</button>
        `;
        
        container.appendChild(div);
    });
    
    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

function removerAcompanhamento(index) {
    if (!exigirCoordenador()) return;
    if (confirm('Deseja realmente remover este acompanhamento?')) {
        const acompanhamentos = JSON.parse(localStorage.getItem('acompanhamentos_alunos') || '[]');
        acompanhamentos.splice(index, 1);
        localStorage.setItem('acompanhamentos_alunos', JSON.stringify(acompanhamentos));
        carregarAcompanhamentos();
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

function salvarReuniao() {
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
    
    const reunioes = JSON.parse(localStorage.getItem('reunioes_pedagogicas') || '[]');
    reunioes.push(reuniao);
    localStorage.setItem('reunioes_pedagogicas', JSON.stringify(reunioes));
    
    // Limpar formulário
    document.getElementById('data-reuniao').value = '';
    document.getElementById('participantes').value = '';
    document.getElementById('pauta-reuniao').value = '';
    document.getElementById('ata-reuniao').value = '';
    
    carregarReunioes();
    alert('Reunião salva com sucesso!');
}

function carregarReunioes() {
    const container = document.getElementById('lista-reunioes');
    const reunioes = JSON.parse(localStorage.getItem('reunioes_pedagogicas') || '[]');
    
    if (reunioes.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhuma reunião registrada ainda.</p>';
        if (!isCoordenador()) {
            aplicarRestricoesProfessor();
        }
        return;
    }
    
    container.innerHTML = '<h3>Reuniões Registradas</h3>';
    
    reunioes.reverse().forEach((reuniao, index) => {
        const div = document.createElement('div');
        div.className = 'reuniao-item';
        
        div.innerHTML = `
            <h4>Reunião de ${formatarData(reuniao.data)}</h4>
            <div class="meta">Participantes: ${reuniao.participantes}</div>
            <div class="content">
                <p><strong>Pauta:</strong> ${reuniao.pauta}</p>
                <p><strong>Ata:</strong> ${reuniao.ata}</p>
            </div>
            <button class="btn-secondary coord-only" onclick="removerReuniao(${reunioes.length - 1 - index})">Remover</button>
        `;
        
        container.appendChild(div);
    });
    
    if (!isCoordenador()) {
        aplicarRestricoesProfessor();
    }
}

function removerReuniao(index) {
    if (!exigirCoordenador()) return;
    if (confirm('Deseja realmente remover esta reunião?')) {
        const reunioes = JSON.parse(localStorage.getItem('reunioes_pedagogicas') || '[]');
        reunioes.splice(index, 1);
        localStorage.setItem('reunioes_pedagogicas', JSON.stringify(reunioes));
        carregarReunioes();
    }
}

function salvarAvaliacaoMensal() {
    if (!exigirCoordenador()) return;
    const avaliacao = {
        mes: parseInt(document.getElementById('mes-avaliacao').value),
        notas: document.getElementById('notas-desempenho').value,
        decisoes: document.getElementById('decisoes-pedagogicas').value,
        timestamp: new Date().toISOString()
    };
    
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_mensais') || '[]');
    const indexExistente = avaliacoes.findIndex(a => a.mes === avaliacao.mes);
    
    if (indexExistente >= 0) {
        avaliacoes[indexExistente] = avaliacao;
    } else {
        avaliacoes.push(avaliacao);
    }
    
    localStorage.setItem('avaliacoes_mensais', JSON.stringify(avaliacoes));
    
    // Limpar formulário
    document.getElementById('notas-desempenho').value = '';
    document.getElementById('decisoes-pedagogicas').value = '';
    
    carregarAvaliacoes();
    alert('Avaliação mensal salva com sucesso!');
}

function carregarAvaliacoes() {
    const container = document.getElementById('lista-avaliacoes');
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_mensais') || '[]');
    
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

function editarAvaliacao(mes) {
    if (!exigirCoordenador()) return;
    const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_mensais') || '[]');
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
function gerarDatasComemorativas() {
    const container = document.getElementById('datas-comemorativas-content');
    container.innerHTML = '';
    
    meses.forEach((mesNome, mesIndex) => {
        const div = document.createElement('div');
        div.className = 'datas-month';
        
        const h3 = document.createElement('h3');
        h3.textContent = mesNome;
        div.appendChild(h3);
        
        if (datasComemorativas[mesIndex] && datasComemorativas[mesIndex].length > 0) {
            datasComemorativas[mesIndex].forEach(data => {
                const itemDiv = document.createElement('div');
                itemDiv.className = `data-item ${data.tipo === 'feriado' ? 'feriado' : ''}`;
                
                itemDiv.innerHTML = `
                    <div class="data">${String(data.dia).padStart(2, '0')}/${String(mesIndex + 1).padStart(2, '0')}</div>
                    <div class="descricao">${data.descricao}</div>
                `;
                
                div.appendChild(itemDiv);
            });
        } else {
            const empty = document.createElement('p');
            empty.className = 'info-text';
            empty.textContent = 'Nenhuma data comemorativa neste mês.';
            div.appendChild(empty);
        }
        
        container.appendChild(div);
    });
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
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
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

function mostrarConteudoPrincipal() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    atualizarInterfacePorPerfil();
    carregarDadosPessoais();
    gerarCalendarioAnual();
    gerarAniversarios();
    carregarPlannerMensal();
    carregarPlanejamentoSemanal();
    carregarAcompanhamentos();
    carregarReunioes();
    carregarAvaliacoes();
    gerarDatasComemorativas();
}

function selecionarPerfil(perfil) {
    perfilAtual = perfil;
    localStorage.setItem('perfilAtual', perfil);
    mostrarConteudoPrincipal();
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
    modal.onclick = function(e) {
        if (e.target === modal) {
            fecharModalAgendamento();
        }
    };
}

function fecharModalAgendamento() {
    document.getElementById('modal-agendamento').classList.remove('active');
    eventoEditando = null;
}

function salvarAgendamento() {
    if (!exigirCoordenador()) return;
    const evento = {
        id: eventoEditando ? eventoEditando.id : Date.now(),
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
    
    const eventos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    if (eventoEditando) {
        const index = eventos.findIndex(e => e.id === eventoEditando.id);
        if (index >= 0) {
            eventos[index] = evento;
        }
    } else {
        eventos.push(evento);
    }
    
    localStorage.setItem('agendamentos', JSON.stringify(eventos));
    fecharModalAgendamento();
    gerarCalendarioAnual();
    
    // Mostrar o evento recém-criado no painel
    const data = new Date(evento.data);
    setTimeout(() => {
        verEventosDoDia(data.getDate(), data.getMonth(), data.getFullYear());
    }, 300);
}

function obterEventosDoDia(dia, mes, ano) {
    const eventos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
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

function removerEvento(eventoId) {
    if (perfilAtual !== 'coordenador') {
        alert('Apenas coordenadores podem remover agendamentos.');
        return;
    }
    
    const eventos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const novosEventos = eventos.filter(e => e.id !== eventoId);
    localStorage.setItem('agendamentos', JSON.stringify(novosEventos));
    gerarCalendarioAnual();
    
    // Fechar painel e mostrar mensagem
    fecharPainelEventos();
    
    // Recarregar eventos se o painel estava aberto
    setTimeout(() => {
        const eventoRemovido = eventos.find(e => e.id === eventoId);
        if (eventoRemovido) {
            const data = new Date(eventoRemovido.data);
            verEventosDoDia(data.getDate(), data.getMonth(), data.getFullYear());
        }
    }, 300);
}

function verEventosDoDia(dia, mes, ano) {
    const eventos = obterEventosDoDia(dia, mes, ano);
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
    modal.onclick = function(e) {
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

function carregarComentarios() {
    const container = document.getElementById('comentarios-container');
    const comentarios = JSON.parse(localStorage.getItem('comentarios') || '[]');
    const comentariosFiltrados = comentarios.filter(c => c.contexto === comentarioContexto);
    
    if (comentariosFiltrados.length === 0) {
        container.innerHTML = '<p class="info-text">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
    } else {
        container.innerHTML = '';
        comentariosFiltrados.reverse().forEach(comentario => {
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

function adicionarComentario() {
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
        id: Date.now(),
        contexto: comentarioContexto,
        texto: texto,
        autor: perfilAtual === 'professor' ? 'Professor' : 'Coordenador',
        timestamp: new Date().toISOString()
    };
    
    const comentarios = JSON.parse(localStorage.getItem('comentarios') || '[]');
    comentarios.push(comentario);
    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    
    document.getElementById('novo-comentario').value = '';
    carregarComentarios();
}

function formatarDataHora(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString('pt-BR');
}

function aplicarRestricoesProfessor() {
    if (!isCoordenador()) {
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach(campo => {
            if (!campo.id.includes('comentario') && !campo.id.includes('novo-comentario')) {
                campo.setAttribute('readonly', 'readonly');
            }
        });
        document.querySelectorAll('input[type="file"]').forEach(campo => {
            campo.disabled = true;
        });
    }
}

