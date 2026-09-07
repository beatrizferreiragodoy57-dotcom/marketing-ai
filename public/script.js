// ==================================================
// ELEMENTOS
// ==================================================

const botao = document.getElementById("enviar");
const chat = document.getElementById("chat");
const mensagem = document.getElementById("mensagem");
const listaHistorico = document.getElementById("listaHistorico");
const novaConversa = document.getElementById("novaConversa");
const novaConversaLateral = document.getElementById("novaConversaLateral");
const modoEscuro = document.getElementById("modoEscuro");
const botaoPDF = document.getElementById("exportarPDF");


// ==================================================
// HISTÓRICO
// ==================================================

let conversas = [];
let conversaAtual = -1;

// Guarda a última mensagem enviada.
// É usada pelo botão "Tentar novamente".
let ultimaMensagem = "";


// ==================================================
// SALVAR HISTÓRICO NO NAVEGADOR
// ==================================================

function salvarHistoricoLocal() {

    localStorage.setItem(
        "marketingConversas",
        JSON.stringify(conversas)
    );

}


// ==================================================
// CARREGAR HISTÓRICO
// ==================================================

function carregarHistorico() {

    const salvo =
        localStorage.getItem("marketingConversas");

    if (!salvo) {

        iniciarNovaConversa();

        return;
    }

    try {

        conversas = JSON.parse(salvo);

        if (!Array.isArray(conversas) || conversas.length === 0) {

            iniciarNovaConversa();

            return;
        }

        conversaAtual = 0;

        chat.innerHTML =
            conversas[0].html;

        atualizarHistorico();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );

        conversas = [];

        iniciarNovaConversa();

    }

}


// ==================================================
// MENSAGEM INICIAL
// ==================================================

function mensagemInicialHTML() {

    return `

        <div class="ia">

            <strong>🤖 Gemini</strong>

            <br><br>

            Olá! 👋

            <br><br>

            Bem-vinda ao
            <strong>MARKETING IA ASSISTENTE</strong>.

            <br><br>

            Sou uma Inteligência Artificial
            especializada em estratégias de marketing.

            <br><br>

            Posso ajudar você com:

            <br><br>

            ✅ Plano de Marketing<br>
            ✅ Análise SWOT<br>
            ✅ Persona<br>
            ✅ Campanhas Publicitárias<br>
            ✅ Redes Sociais<br>
            ✅ Calendário de Conteúdo

            <br><br>

            Escolha uma das opções abaixo
            ou envie sua pergunta.

        </div>

    `;

}


// ==================================================
// INICIAR NOVA CONVERSA
// ==================================================

function iniciarNovaConversa() {

    chat.innerHTML =
        mensagemInicialHTML();

    ultimaMensagem = "";

    conversas.push({

        titulo: "🆕 Nova Conversa",

        html: chat.innerHTML

    });

    conversaAtual =
        conversas.length - 1;

    salvarHistoricoLocal();

    atualizarHistorico();

}


// ==================================================
// ATUALIZAR HISTÓRICO
// ==================================================

function atualizarHistorico() {

    if (!listaHistorico) return;

    listaHistorico.innerHTML = "";

    conversas.forEach((conversa, indice) => {

        const item =
            document.createElement("div");

        item.className =
            "itemHistorico";

        if (indice === conversaAtual) {

            item.classList.add("ativo");

        }

        item.textContent =
            conversa.titulo;

        item.addEventListener(
            "click",
            () => {

                conversaAtual = indice;

                chat.innerHTML =
                    conversa.html;

                atualizarHistorico();

                chat.scrollTop =
                    chat.scrollHeight;

            }
        );

        listaHistorico.appendChild(item);

    });

}


// ==================================================
// ESCAPAR HTML
// ==================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


// ==================================================
// ATUALIZAR CONVERSA ATUAL
// ==================================================

function atualizarConversaAtual(titulo = null) {

    if (conversaAtual < 0) return;

    if (titulo) {

        conversas[conversaAtual].titulo =
            titulo;

    }

    conversas[conversaAtual].html =
        chat.innerHTML;

    salvarHistoricoLocal();

    atualizarHistorico();

}


// ==================================================
// ROLAR CHAT PARA O FINAL
// ==================================================

function rolarChatParaFinal() {

    chat.scrollTop =
        chat.scrollHeight;

}


// ==================================================
// CRIAR INDICADOR "PENSANDO"
// ==================================================

function criarIndicadorPensando() {

    const pensando =
        document.createElement("div");

    pensando.className =
        "ia pensando";

    pensando.id =
        "pensando";

    pensando.innerHTML = `

        <strong>🤖 Gemini</strong>

        <br><br>

        <span class="indicador-pensando">

            <span>●</span>
            <span>●</span>
            <span>●</span>

            <span class="texto-pensando">
                Pensando...
            </span>

        </span>

    `;

    return pensando;

}


// ==================================================
// ADICIONAR RESPOSTA DA IA
// ==================================================

function adicionarRespostaIA(texto) {

    const respostaSegura =
        escaparHTML(texto);

    const resposta =
        document.createElement("div");

    resposta.className =
        "ia resposta-ia";

    resposta.innerHTML = `

        <div class="cabecalho-ia">

            <strong>🤖 Gemini</strong>

        </div>

        <div class="conteudo-resposta">

            ${respostaSegura}

        </div>

        <div class="acoes-resposta">

            <button
                type="button"
                class="botao-copiar"
                title="Copiar resposta"
            >
                📋 Copiar
            </button>

        </div>

    `;

    chat.appendChild(resposta);

    const botaoCopiar =
        resposta.querySelector(".botao-copiar");

    botaoCopiar.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    texto
                );

                botaoCopiar.innerHTML =
                    "✅ Copiado!";

                setTimeout(
                    () => {

                        botaoCopiar.innerHTML =
                            "📋 Copiar";

                    },
                    1800
                );

            }

            catch (erro) {

                console.error(
                    "Erro ao copiar:",
                    erro
                );

                botaoCopiar.innerHTML =
                    "⚠️ Não foi possível copiar";

                setTimeout(
                    () => {

                        botaoCopiar.innerHTML =
                            "📋 Copiar";

                    },
                    1800
                );

            }

        }
    );

}


// ==================================================
// ADICIONAR MENSAGEM DE ERRO
// ==================================================

function adicionarMensagemErro() {

    const erro =
        document.createElement("div");

    erro.className =
        "ia erro-ia";

    erro.innerHTML = `

        <strong>⚠️ Não foi possível concluir</strong>

        <br><br>

        Não consegui conversar com o Gemini
        neste momento.

        <br><br>

        Verifique se o servidor está funcionando
        e tente novamente.

        <br><br>

        <button
            type="button"
            class="botao-tentar-novamente"
        >
            🔄 Tentar novamente
        </button>

    `;

    chat.appendChild(erro);

    const botaoTentar =
        erro.querySelector(
            ".botao-tentar-novamente"
        );

    botaoTentar.addEventListener(
        "click",
        () => {

            erro.remove();

            if (ultimaMensagem) {

                enviarMensagem(
                    ultimaMensagem
                );

            }

        }
    );

}


// ==================================================
// ENVIAR MENSAGEM
// ==================================================

async function enviarMensagem(
    textoAutomatico = null
) {

    const texto =
        textoAutomatico ||
        mensagem.value.trim();

    if (!texto) return;


    // ==============================================
    // EVITA ENVIO DUPLICADO
    // ==============================================

    if (botao.disabled) return;


    // ==============================================
    // GUARDA ÚLTIMA MENSAGEM
    // ==============================================

    ultimaMensagem =
        texto;


    // ==============================================
    // SE NÃO EXISTIR CONVERSA
    // ==============================================

    if (conversaAtual === -1) {

        iniciarNovaConversa();

    }


    // ==============================================
    // MENSAGEM DO USUÁRIO
    // ==============================================

    const textoSeguro =
        escaparHTML(texto);

    chat.innerHTML += `

        <div class="usuario">

            <strong>👤 Você</strong>

            <br><br>

            ${textoSeguro}

        </div>

    `;

    mensagem.value = "";

    rolarChatParaFinal();


    // ==============================================
    // PRIMEIRA MENSAGEM VIRA TÍTULO
    // ==============================================

    let titulo =
        texto.trim();

    if (titulo.length > 30) {

        titulo =
            titulo.substring(0, 30) + "...";

    }

    atualizarConversaAtual(
        "💬 " + titulo
    );


    // ==============================================
    // DESABILITA BOTÃO
    // ==============================================

    botao.disabled = true;


    // ==============================================
    // MENSAGEM "PENSANDO"
    // ==============================================

    const pensando =
        criarIndicadorPensando();

    chat.appendChild(
        pensando
    );

    rolarChatParaFinal();


    try {

        // ==========================================
        // ENVIA PARA O SERVIDOR
        // ==========================================

        const resposta =
            await fetch(
                "/chat",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        pergunta: texto

                    })

                }
            );


        // ==========================================
        // VERIFICA RESPOSTA DO SERVIDOR
        // ==========================================

        if (!resposta.ok) {

            throw new Error(
                "Erro no servidor: " +
                resposta.status
            );

        }


        // ==========================================
        // CONVERTE RESPOSTA PARA JSON
        // ==========================================

        const dados =
            await resposta.json();


        // ==========================================
        // REMOVE "PENSANDO"
        // ==========================================

        if (pensando) {

            pensando.remove();

        }


        // ==========================================
        // RESPOSTA DA IA
        // ==========================================

        const textoResposta =
            dados.resposta ||
            "Não recebi uma resposta da inteligência artificial.";


        adicionarRespostaIA(
            textoResposta
        );


        // ==========================================
        // SALVA CONVERSA
        // ==========================================

        atualizarConversaAtual();


        // ==========================================
        // ROLA CHAT
        // ==========================================

        rolarChatParaFinal();

    }


    catch (erro) {

        console.error(
            "Erro ao conversar com a IA:",
            erro
        );


        // ==========================================
        // REMOVE "PENSANDO"
        // ==========================================

        if (pensando) {

            pensando.remove();

        }


        // ==========================================
        // MOSTRA ERRO
        // ==========================================

        adicionarMensagemErro();


        // ==========================================
        // SALVA CONVERSA
        // ==========================================

        atualizarConversaAtual();


        rolarChatParaFinal();

    }


    finally {

        botao.disabled = false;

        mensagem.focus();

    }

}


// ==================================================
// BOTÃO ENVIAR
// ==================================================

botao.addEventListener(
    "click",
    () => {

        enviarMensagem();

    }
);


// ==================================================
// ENTER PARA ENVIAR
// ==================================================

mensagem.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagem();

        }

    }
);


// ==================================================
// ATALHOS
// ==================================================

const atalhos =
    document.querySelectorAll(".atalho");


atalhos.forEach(
    (atalho) => {

        atalho.addEventListener(
            "click",
            () => {

                let prompt = "";


                switch (
                    atalho.innerText.trim()
                ) {

                    case "📊 Análise SWOT":

                        prompt =
                            "Crie uma análise SWOT completa para uma empresa. Explique forças, fraquezas, oportunidades e ameaças.";

                        break;


                    case "👤 Criar Persona":

                        prompt =
                            "Crie uma persona completa para uma empresa, incluindo nome fictício, idade, profissão, objetivos, dores, necessidades, hábitos de consumo e canais de comunicação.";

                        break;


                    case "📈 Plano de Marketing":

                        prompt =
                            "Crie um plano de marketing completo para uma empresa, incluindo objetivos, público-alvo, estratégias, canais, ações e indicadores de desempenho.";

                        break;


                    case "📱 Redes Sociais":

                        prompt =
                            "Crie uma estratégia de marketing para Instagram, Facebook, LinkedIn e TikTok, indicando tipos de conteúdo, frequência e objetivos.";

                        break;


                    case "📅 Calendário":

                        prompt =
                            "Monte um calendário de conteúdo para 30 dias para uma empresa, com ideias de posts, formatos, temas e objetivos.";

                        break;


                    case "🎯 Campanha":

                        prompt =
                            "Crie uma campanha completa de marketing, incluindo nome da campanha, objetivo, público-alvo, conceito, canais, conteúdos, cronograma e indicadores.";

                        break;

                }


                if (prompt) {

                    enviarMensagem(
                        prompt
                    );

                }

            }
        );

    }
);


// ==================================================
// NOVA CONVERSA - BOTÃO SUPERIOR
// ==================================================

novaConversa.addEventListener(
    "click",
    () => {

        iniciarNovaConversa();

        chat.scrollTop = 0;

        mensagem.focus();

    }
);


// ==================================================
// NOVA CONVERSA - BOTÃO LATERAL
// ==================================================

novaConversaLateral.addEventListener(
    "click",
    () => {

        iniciarNovaConversa();

        chat.scrollTop = 0;

        mensagem.focus();

    }
);


// ==================================================
// MODO ESCURO
// ==================================================

function carregarTema() {

    const tema =
        localStorage.getItem("tema");

    if (tema === "escuro") {

        document.body.classList.add(
            "dark"
        );

        modoEscuro.innerHTML =
            "☀️ Modo Claro";

    }

}


carregarTema();


modoEscuro.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            modoEscuro.innerHTML =
                "☀️ Modo Claro";

            localStorage.setItem(
                "tema",
                "escuro"
            );

        }

        else {

            modoEscuro.innerHTML =
                "🌙 Modo Escuro";

            localStorage.setItem(
                "tema",
                "claro"
            );

        }

    }
);


// ==================================================
// EXPORTAR PDF
// ==================================================

botaoPDF.addEventListener(
    "click",
    () => {

        if (
            typeof window.jspdf ===
            "undefined"
        ) {

            alert(
                "A biblioteca do PDF ainda não carregou. Atualize a página e tente novamente."
            );

            return;

        }


        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF();


        // ==========================================
        // TÍTULO
        // ==========================================

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(18);

        pdf.text(
            "MARKETING IA ASSISTENTE",
            20,
            20
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10);

        pdf.text(
            "Inteligência Artificial para criar estratégias de marketing",
            20,
            28
        );


        pdf.line(
            20,
            34,
            190,
            34
        );


        // ==========================================
        // CONVERSA
        // ==========================================

        const conversa =
            chat.innerText;


        const linhas =
            pdf.splitTextToSize(
                conversa,
                170
            );


        let y = 44;

        pdf.setFontSize(10);


        linhas.forEach(
            (linha) => {

                if (y > 275) {

                    pdf.addPage();

                    y = 20;

                }


                pdf.text(
                    linha,
                    20,
                    y
                );

                y += 5;

            }
        );


        // ==========================================
        // DATA
        // ==========================================

        const agora =
            new Date();


        const data =
            agora.toLocaleDateString(
                "pt-BR"
            )
            +
            " "
            +
            agora.toLocaleTimeString(
                "pt-BR"
            );


        pdf.setFontSize(8);


        pdf.text(
            "Gerado em: " + data,
            20,
            290
        );


        // ==========================================
        // SALVAR
        // ==========================================

        pdf.save(
            "Marketing_IA_Assistente.pdf"
        );

    }
);


// ==================================================
// INICIAR SISTEMA
// ==================================================

carregarHistorico();

mensagem.focus();