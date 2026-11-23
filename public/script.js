// ==================================================
// MARKETING IA ASSISTENTE
// JAVASCRIPT — VERSÃO COMPLETA
// ==================================================


// ==================================================
// ELEMENTOS
// ==================================================

const botao =
    document.getElementById("enviar");

const chat =
    document.getElementById("chat");

const mensagem =
    document.getElementById("mensagem");

const listaHistorico =
    document.getElementById("listaHistorico");

const novaConversa =
    document.getElementById("novaConversa");

const novaConversaLateral =
    document.getElementById("novaConversaLateral");

const modoEscuro =
    document.getElementById("modoEscuro");

const botaoPDF =
    document.getElementById("exportarPDF");

const limparHistorico =
    document.getElementById("limparHistorico");


// ==================================================
// ESTADO
// ==================================================

let conversas = [];

let conversaAtual = -1;

let ultimaMensagem = "";


// ==================================================
// SALVAR
// ==================================================

function salvarHistoricoLocal() {

    localStorage.setItem(
        "marketingConversas",
        JSON.stringify(conversas)
    );

}


// ==================================================
// ESCAPAR HTML
// ==================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}


// ==================================================
// FORMATAR RESPOSTA DA IA
// ==================================================

function formatarResposta(texto) {

    const seguro =
        escaparHTML(texto);

    const linhas =
        seguro.split("\n");

    let html = "";

    let listaAberta = false;

    linhas.forEach((linha) => {

        const limpa =
            linha.trim();


        // Lista
        if (
            limpa.startsWith("- ") ||
            limpa.startsWith("• ") ||
            /^\d+\.\s/.test(limpa)
        ) {

            if (!listaAberta) {

                html += "<ul>";

                listaAberta = true;

            }

            let item =
                limpa
                    .replace(/^-\s+/, "")
                    .replace(/^•\s+/, "")
                    .replace(/^\d+\.\s+/, "");

            item =
                destacarTexto(item);

            html +=
                `<li>${item}</li>`;

            return;

        }


        if (listaAberta) {

            html += "</ul>";

            listaAberta = false;

        }


        // Linha vazia
        if (!limpa) {

            html += "<br>";

            return;

        }


        // Títulos
        if (
            limpa.endsWith(":") &&
            limpa.length < 90
        ) {

            html +=
                `<h3>${destacarTexto(limpa)}</h3>`;

            return;

        }


        html +=
            `<p>${destacarTexto(limpa)}</p>`;

    });


    if (listaAberta) {

        html += "</ul>";

    }


    return html;

}


// ==================================================
// DESTAQUES
// ==================================================

function destacarTexto(texto) {

    return texto.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

}


// ==================================================
// MENSAGEM INICIAL
// ==================================================

function mensagemInicialHTML() {

    return `

        <div class="boas-vindas">

            <div class="icone-boas-vindas">
                🤖
            </div>

            <h2>
                Olá! 👋
            </h2>

            <p>
                Eu sou o <strong>MARKETING IA ASSISTENTE</strong>.
                Posso ajudar você a criar estratégias,
                campanhas e planos de marketing.
            </p>

            <div class="beneficios">

                <div class="beneficio">

                    <strong>
                        📊 Estratégia
                    </strong>

                    <small>
                        SWOT e planejamento
                    </small>

                </div>


                <div class="beneficio">

                    <strong>
                        👤 Público
                    </strong>

                    <small>
                        Personas e clientes
                    </small>

                </div>


                <div class="beneficio">

                    <strong>
                        🚀 Crescimento
                    </strong>

                    <small>
                        Campanhas e vendas
                    </small>

                </div>

            </div>

            <p style="margin-top:20px;">
                Escolha uma opção abaixo ou
                digite sua pergunta.
            </p>

        </div>

    `;

}


// ==================================================
// NOVA CONVERSA
// ==================================================

function iniciarNovaConversa() {

    chat.innerHTML =
        mensagemInicialHTML();

    ultimaMensagem = "";

    conversas.push({

        titulo:
            "🆕 Nova Conversa",

        html:
            chat.innerHTML,

        mensagens:
            []

    });

    conversaAtual =
        conversas.length - 1;

    salvarHistoricoLocal();

    atualizarHistorico();

}


// ==================================================
// CARREGAR HISTÓRICO
// ==================================================

function carregarHistorico() {

    const salvo =
        localStorage.getItem(
            "marketingConversas"
        );


    if (!salvo) {

        iniciarNovaConversa();

        return;

    }


    try {

        conversas =
            JSON.parse(salvo);


        if (
            !Array.isArray(conversas) ||
            conversas.length === 0
        ) {

            iniciarNovaConversa();

            return;

        }


        // Compatibilidade com histórico antigo

        conversas =
            conversas.map((conversa) => {

                if (!conversa.mensagens) {

                    conversa.mensagens = [];

                }

                return conversa;

            });


        conversaAtual =
            0;

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
// HISTÓRICO VISUAL
// ==================================================

function atualizarHistorico() {

    if (!listaHistorico)
        return;


    listaHistorico.innerHTML = "";


    conversas.forEach(
        (conversa, indice) => {

            const item =
                document.createElement("div");

            item.className =
                "itemHistorico";


            if (
                indice === conversaAtual
            ) {

                item.classList.add(
                    "ativo"
                );

            }


            item.textContent =
                conversa.titulo;


            item.addEventListener(
                "click",
                () => {

                    conversaAtual =
                        indice;

                    chat.innerHTML =
                        conversa.html;

                    atualizarHistorico();

                    rolarChatParaFinal();

                }
            );


            listaHistorico.appendChild(
                item
            );

        }
    );

}


// ==================================================
// ATUALIZAR CONVERSA
// ==================================================

function atualizarConversaAtual(
    titulo = null
) {

    if (conversaAtual < 0)
        return;


    if (titulo) {

        conversas[
            conversaAtual
        ].titulo =
            titulo;

    }


    conversas[
        conversaAtual
    ].html =
        chat.innerHTML;


    salvarHistoricoLocal();

    atualizarHistorico();

}


// ==================================================
// ROLAR CHAT
// ==================================================

function rolarChatParaFinal() {

    chat.scrollTop =
        chat.scrollHeight;

}


// ==================================================
// INDICADOR PENSANDO
// ==================================================

function criarIndicadorPensando() {

    const pensando =
        document.createElement("div");

    pensando.className =
        "ia";

    pensando.id =
        "pensando";

    pensando.innerHTML = `

        <div class="cabecalho-ia">

            <span class="status-ia"></span>

            <strong>
                Gemini
            </strong>

        </div>

        <div style="margin-top:12px;">

            <span class="indicador-pensando">

                <span>●</span>
                <span>●</span>
                <span>●</span>

                <span class="texto-pensando">
                    Pensando...
                </span>

            </span>

        </div>

    `;

    return pensando;

}


// ==================================================
// RESPOSTA IA
// ==================================================

function adicionarRespostaIA(
    texto
) {

    const resposta =
        document.createElement("div");

    resposta.className =
        "ia resposta-ia";


    resposta.innerHTML = `

        <div class="cabecalho-ia">

            <span class="status-ia"></span>

            <strong>
                Gemini
            </strong>

        </div>


        <div class="conteudo-resposta">

            ${formatarResposta(texto)}

        </div>


        <div class="acoes-resposta">

            <button
                type="button"
                class="botao-copiar">

                📋 Copiar

            </button>

        </div>

    `;


    chat.appendChild(
        resposta
    );


    const copiar =
        resposta.querySelector(
            ".botao-copiar"
        );


    copiar.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    texto
                );

                copiar.innerHTML =
                    "✅ Copiado!";


                setTimeout(
                    () => {

                        copiar.innerHTML =
                            "📋 Copiar";

                    },
                    1800
                );

            }


            catch (erro) {

                console.error(
                    erro
                );

                copiar.innerHTML =
                    "⚠️ Erro";

            }

        }
    );

}


// ==================================================
// ERRO
// ==================================================

function adicionarMensagemErro() {

    const erro =
        document.createElement("div");

    erro.className =
        "ia erro-ia";


    erro.innerHTML = `

        <strong>
            ⚠️ Não foi possível concluir
        </strong>

        <br><br>

        O assistente não conseguiu responder
        neste momento.

        <br><br>

        <button
            type="button"
            class="botao-tentar-novamente">

            🔄 Tentar novamente

        </button>

    `;


    chat.appendChild(
        erro
    );


    erro.querySelector(
        ".botao-tentar-novamente"
    ).addEventListener(
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


    if (!texto)
        return;


    if (botao.disabled)
        return;


    ultimaMensagem =
        texto;


    if (conversaAtual === -1) {

        iniciarNovaConversa();

    }


    // ----------------------------------------------
    // MENSAGEM DO USUÁRIO
    // ----------------------------------------------

    const usuario =
        document.createElement("div");

    usuario.className =
        "usuario";


    usuario.innerHTML = `

        <strong>
            👤 Você
        </strong>

        <br><br>

        ${escaparHTML(texto)}

    `;


    chat.appendChild(
        usuario
    );


    mensagem.value = "";

    ajustarAlturaTextarea();

    rolarChatParaFinal();


    // ----------------------------------------------
    // TÍTULO
    // ----------------------------------------------

    let titulo =
        texto.trim();


    if (titulo.length > 35) {

        titulo =
            titulo.substring(0, 35) +
            "...";

    }


    atualizarConversaAtual(
        "💬 " + titulo
    );


    // ----------------------------------------------
    // BOTÃO
    // ----------------------------------------------

    botao.disabled =
        true;

    botao.innerHTML =
        "⏳";


    // ----------------------------------------------
    // PENSANDO
    // ----------------------------------------------

    const pensando =
        criarIndicadorPensando();

    chat.appendChild(
        pensando
    );

    rolarChatParaFinal();


    try {

        // ------------------------------------------
        // PREPARA HISTÓRICO PARA O GEMINI
        // ------------------------------------------

        const historico =
            construirHistoricoParaServidor();


        // ------------------------------------------
        // CHAMADA
        // ------------------------------------------

        const resposta =
            await fetch(
                "/chat",
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify({

                            pergunta:
                                texto,

                            historico:
                                historico

                        })

                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro no servidor: " +
                resposta.status
            );

        }


        const dados =
            await resposta.json();


        if (pensando) {

            pensando.remove();

        }


        const textoResposta =
            dados.resposta ||
            "Não recebi uma resposta da inteligência artificial.";


        adicionarRespostaIA(
            textoResposta
        );


        atualizarConversaAtual();

        rolarChatParaFinal();

    }


    catch (erro) {

        console.error(
            "Erro ao conversar com a IA:",
            erro
        );


        if (pensando) {

            pensando.remove();

        }


        adicionarMensagemErro();

        atualizarConversaAtual();

        rolarChatParaFinal();

    }


    finally {

        botao.disabled =
            false;

        botao.innerHTML =
            `<span class="texto-enviar">Enviar</span>
             <span class="icone-enviar">➤</span>`;

        mensagem.focus();

    }

}


// ==================================================
// CONSTRUIR MEMÓRIA
// ==================================================

function construirHistoricoParaServidor() {

    if (conversaAtual < 0)
        return [];


    const mensagens =
        conversas[
            conversaAtual
        ].mensagens || [];


    return mensagens
        .slice(-12)
        .map((item) => ({

            role:
                item.role,

            text:
                item.text

        }));

}


// ==================================================
// SALVAR MENSAGENS NA MEMÓRIA
// ==================================================

function salvarMensagemNaMemoria(
    role,
    text
) {

    if (conversaAtual < 0)
        return;


    if (
        !conversas[
            conversaAtual
        ].mensagens
    ) {

        conversas[
            conversaAtual
        ].mensagens = [];

    }


    conversas[
        conversaAtual
    ].mensagens.push({

        role:
            role,

        text:
            text

    });


    // Limita memória local

    if (
        conversas[
            conversaAtual
        ].mensagens.length > 20
    ) {

        conversas[
            conversaAtual
        ].mensagens =
            conversas[
                conversaAtual
            ].mensagens.slice(-20);

    }

}


// ==================================================
// AJUSTAR TEXTAREA
// ==================================================

function ajustarAlturaTextarea() {

    mensagem.style.height =
        "auto";

    mensagem.style.height =
        Math.min(
            mensagem.scrollHeight,
            130
        ) + "px";

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
// ENTER
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


mensagem.addEventListener(
    "input",
    ajustarAlturaTextarea
);


// ==================================================
// ATALHOS INTELIGENTES
// ==================================================

const atalhos =
    document.querySelectorAll(
        ".atalho"
    );


const prompts = {

    swot:
        `Quero fazer uma Análise SWOT completa para minha empresa.

Faça a análise considerando:
- Forças
- Fraquezas
- Oportunidades
- Ameaças

Depois apresente recomendações estratégicas.

Antes de começar, faça as perguntas necessárias para entender minha empresa.`,

    persona:
        `Quero criar uma persona completa para minha empresa.

Considere:
- Nome fictício
- Idade
- Profissão
- Renda
- Objetivos
- Dores
- Necessidades
- Hábitos
- Comportamento de compra
- Redes sociais
- Motivações

Antes de criar, faça as perguntas necessárias para conhecer meu público.`,

    plano:
        `Quero criar um Plano de Marketing profissional para minha empresa.

Inclua:
- Diagnóstico
- Objetivos
- Público-alvo
- Posicionamento
- Estratégias
- Canais
- Conteúdo
- Cronograma
- Orçamento sugerido
- KPIs

Primeiro faça as perguntas necessárias para entender meu negócio.`,

    redes:
        `Quero criar uma estratégia completa de Redes Sociais para minha empresa.

Analise:
- Instagram
- Facebook
- TikTok
- LinkedIn

Defina:
- Objetivos
- Público
- Pilares de conteúdo
- Frequência
- Formatos
- Ideias de posts
- Estratégias de crescimento

Primeiro faça as perguntas necessárias.`,

    calendario:
        `Quero criar um calendário de conteúdo de 30 dias para minha empresa.

Para cada dia indique:
- Tema
- Formato
- Ideia
- Objetivo
- CTA

Antes de criar o calendário, faça as perguntas necessárias sobre minha empresa e meu público.`,

    campanha:
        `Quero criar uma campanha de marketing profissional.

Desenvolva:
- Nome da campanha
- Conceito
- Objetivo
- Público-alvo
- Oferta
- Mensagem principal
- Canais
- Conteúdos
- Cronograma
- CTA
- KPIs

Primeiro faça as perguntas necessárias para entender o negócio.`

};


atalhos.forEach(
    (atalho) => {

        atalho.addEventListener(
            "click",
            () => {

                const tipo =
                    atalho.dataset.tipo;

                if (
                    prompts[tipo]
                ) {

                    mensagem.value =
                        prompts[tipo];

                    ajustarAlturaTextarea();

                    mensagem.focus();

                }

            }
        );

    }
);


// ==================================================
// NOVA CONVERSA
// ==================================================

function nova() {

    iniciarNovaConversa();

    rolarChatParaFinal();

    mensagem.focus();

}


novaConversa.addEventListener(
    "click",
    nova
);


novaConversaLateral.addEventListener(
    "click",
    nova
);


// ==================================================
// LIMPAR HISTÓRICO
// ==================================================

limparHistorico.addEventListener(
    "click",
    () => {

        const confirmar =
            confirm(
                "Tem certeza que deseja apagar todo o histórico?"
            );


        if (!confirmar)
            return;


        localStorage.removeItem(
            "marketingConversas"
        );


        conversas = [];

        conversaAtual = -1;

        iniciarNovaConversa();

        mensagem.focus();

    }
);


// ==================================================
// TEMA
// ==================================================

function carregarTema() {

    const tema =
        localStorage.getItem(
            "tema"
        );


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


        const escuro =
            document.body.classList.contains(
                "dark"
            );


        if (escuro) {

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
// PDF
// ==================================================

botaoPDF.addEventListener(
    "click",
    () => {

        if (
            typeof window.jspdf ===
            "undefined"
        ) {

            alert(
                "A biblioteca PDF ainda não carregou. Atualize a página."
            );

            return;

        }


        const {
            jsPDF
        } =
            window.jspdf;


        const pdf =
            new jsPDF();


        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(
            18
        );


        pdf.text(
            "MARKETING IA ASSISTENTE",
            20,
            20
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(
            10
        );


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


        const conversa =
            chat.innerText;


        const linhas =
            pdf.splitTextToSize(
                conversa,
                170
            );


        let y =
            44;


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


        pdf.setFontSize(
            8
        );


        pdf.text(
            "MARKETING IA ASSISTENTE",
            20,
            290
        );


        pdf.save(
            "Marketing_IA_Assistente.pdf"
        );

    }
);


// ==================================================
// INTERCEPTAR MEMÓRIA
// ==================================================

// Guarda a pergunta antes do envio.
const enviarMensagemOriginal =
    enviarMensagem;


// Sobrescreve para registrar pergunta/resposta.
enviarMensagem =
    async function(textoAutomatico = null) {

        const texto =
            textoAutomatico ||
            mensagem.value.trim();


        if (!texto)
            return;


        salvarMensagemNaMemoria(
            "user",
            texto
        );


        try {

            await enviarMensagemOriginal(
                texto
            );

        }


        catch (erro) {

            console.error(
                erro
            );

        }

    };


// ==================================================
// AJUSTE DA RESPOSTA NA MEMÓRIA
// ==================================================

const adicionarRespostaIAOriginal =
    adicionarRespostaIA;


// Não altera a interface.
// O servidor recebe o histórico do usuário.
// A próxima versão pode ampliar a memória,
// mantendo a aplicação leve.


// ==================================================
// INICIAR
// ==================================================

carregarHistorico();

mensagem.focus();

ajustarAlturaTextarea();
