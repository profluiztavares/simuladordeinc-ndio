/* ==========================================================================
   1. CAPTURA DOS ELEMENTOS DA INTERFACE (DOM)
   ========================================================================== */
const formIncendio = document.querySelector('#form-incendio');
const inputUmidade = document.querySelector('#input-umidade');
const selectPalhada = document.querySelector('#select-palhada');
const selectRodovia = document.querySelector('#select-rodovia');

// Checkboxes de Infraestrutura
const checkTanque = document.querySelector('#check-tanque');
const checkTrator = document.querySelector('#check-trator');
const checkEpi = document.querySelector('#check-epi');

// Áreas de Output (Exibição de Resultados e Erros)
const containerErro = document.querySelector('#feedback-erro');
const containerResultado = document.querySelector('#resultado-painel');
const statusRisco = document.querySelector('#status-risco');
const diretrizesPlano = document.querySelector('#diretrizes-plano');

/* ==========================================================================
   2. ADICIONAR ESCUTADOR DE EVENTOS (EventListener)
   ========================================================================== */
formIncendio.addEventListener('submit', function (event) {
    // Impede o recarregamento automático da página
    event.preventDefault(); 
    
    // Executa a lógica principal
    processarSimulacao();
});

/* ==========================================================================
   3. FUNÇÃO PRINCIPAL DE PROCESSAMENTO E VALIDAÇÃO
   ========================================================================== */
function processarSimulacao() {
    // Captura e conversão dos valores inseridos
    const umidade = parseFloat(inputUmidade.value);
    const palhada = selectPalhada.value;
    const rodovia = selectRodovia.value;

    /* --- VALIDAÇÃO ESTRITA DE DADOS --- */
    // Reseta estados visuais anteriores
    containerErro.hidden = true;
    containerErro.textContent = "";
    containerResultado.hidden = true;

    // Verificação de campos vazios (caso passem pelo HTML)
    if (isNaN(umidade) || palhada === "" || rodovia === "") {
        exibirErro("Por favor, preencha todos os campos do formulário para realizar o diagnóstico.");
        return;
    }

    // Verificação de valores inconsistentes ou negativos
    if (umidade < 0 || umidade > 100) {
        exibirErro("Erro de digitação: A Umidade Relativa do Ar não pode ser negativa e nem maior do que 100%. Verifique o valor inserido.");
        return;
    }

    /* --- PROCESSAMENTO DOS DADOS (CÁLCULO DE RISCO) --- */
    let pontosRisco = 0;

    // Critério 1: Umidade do Ar (Clima seco eleva drasticamente o risco)
    if (umidade <= 20) {
        pontosRisco += 3; // Estado de Emergência Crítica
    } else if (umidade <= 40) {
        pontosRisco += 2; // Alerta moderado
    } else {
        pontosRisco += 1; // Condição favorável
    }

    // Critério 2: Manejo da Terra (Combustível seco no solo)
    if (palhada === "alta") pontosRisco += 3;
    if (palhada === "moderada") pontosRisco += 2;
    if (palhada === "baixa") pontosRisco += 1;

    // Critério 3: Localização de Risco
    if (rodovia === "perto") pontosRisco += 2; // Risco de bitucas de cigarro / faíscas

    // Classificação Final do Nível de Risco baseado na pontuação
    let nivelFinal = "";
    let classeEstilo = "";

    if (pontosRisco >= 7) {
        nivelFinal = "Alto Risco de Incêndio Florestal";
        classeEstilo = "risco-alto";
    } else if (pontosRisco >= 4) {
        nivelFinal = "Risco Moderado / Alerta";
        classeEstilo = "risco-medio";
    } else {
        nivelFinal = "Risco Baixo / Sob Controle";
        classeEstilo = "risco-baixo";
    }

    /* --- GERAÇÃO DO PLANO DE AÇÃO PREVENTIVO (RENDERIZAÇÃO) --- */
    renderizarResultados(nivelFinal, classeEstilo, umidade, palhada, rodovia);
}

/* ==========================================================================
   4. FUNÇÕES AUXILIARES DE RENDERIZAÇÃO DE TELA (UI/UX)
   ========================================================================== */

// Função para exibir mensagem de erro amigável DIRETAMENTE NA TELA
function exibirErro(mensagem) {
    containerErro.textContent = mensagem;
    containerErro.hidden = false;
    // Rola a tela até o erro para garantir que o usuário veja
    containerErro.scrollIntoView({ behavior: 'smooth' });
}

// Função para construir as recomendações técnicas e exibir o painel
function renderizarResultados(nivel, classe, umidade, palhada, rodovia) {
    // 1. Aplica o status de risco com a cor correspondente (CSS)
    statusRisco.textContent = nivel;
    statusRisco.className = ""; // Limpa classes anteriores
    statusRisco.classList.add(classe);

    // 2. Cria as recomendações personalizadas dinamicamente baseada nos inputs
    let htmlDiretrizes = "";

    // Card Climático
    if (umidade <= 30) {
        htmlDiretrizes += `
            <div class="card-plano">
                <h4>⚠️ Alerta Climático Crítico</h4>
                <p>A umidade do ar está em ${umidade}%. Evite qualquer tipo de queima controlada e suspenda operações com maquinários que possam gerar faíscas nas horas mais quentes do dia.</p>
            </div>
        `;
    }

    // Card de Manejo de Solo (Aceiros)
    if (palhada === "alta" || palhada === "moderada") {
        htmlDiretrizes += `
            <div class="card-plano">
                <h4>🚜 Manejo de Combustível (Aceiros)</h4>
                <p>Com a presença de palhada seca, é fundamental a manutenção ou criação imediata de <strong>aceiros</strong> (faixas limpas de vegetação) ao redor das plantações e reservas florestais.</p>
            </div>
        `;
    }

    // Card de Vulnerabilidade por Rodovia
    if (rodovia === "perto") {
        htmlDiretrizes += `
            <div class="card-plano">
                <h4>🛣️ Proteção de Faixa de Domínio</h4>
                <p>Sua propriedade fica próxima a rodovias. Reforce a vigilância nas divisas, pois o descarte inadequado de materiais inflamáveis por motoristas é uma das maiores causas de focos de incêndio.</p>
            </div>
        `;
    }

    // Cards baseados na infraestrutura declarada (Checkboxes)
    if (!checkTrator.checked) {
        htmlDiretrizes += `
            <div class="card-plano">
                <h4>💡 Recomendação de Recursos</h4>
                <p>Considere deixar um trator com grade acoplada em ponto estratégico durante este período seco para agir rápido na contenção de focos se necessário.</p>
            </div>
        `;
    }
    
    if (!checkTanque.checked) {
        htmlDiretrizes += `
            <div class="card-plano">
                <h4>💧 Armazenamento de Água</h4>
                <p>Mantenha reservatórios de água cheios ou verifique a possibilidade de adaptar tanques móveis para dar suporte emergencial.</p>
            </div>
        `;
    }

    // Card Fixo de Contatos de Emergência (Requisito das fontes do SENAR-PR)
    htmlDiretrizes += `
        <div class="card-plano" style="border-left: 4px solid var(--cor-secundaria-laranja);">
            <h4>📞 Guia de Contatos Úteis</h4>
            <p>Em caso de foco descontrolado, acione imediatamente o <strong>Corpo de Bombeiros (193)</strong> ou a Defesa Civil local. Mantenha contato com o Sindicato Rural da sua região para apoio e cursos de brigada rural.</p>
        </div>
    `;

    // Injeta o HTML gerado para as diretrizes e exibe o painel de resultados
    diretrizesPlano.innerHTML = htmlDiretrizes;
    containerResultado.hidden = false;

    // Rola a página suavemente até o painel de resultados
    containerResultado.scrollIntoView({ behavior: 'smooth' });
}
