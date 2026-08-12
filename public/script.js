// ==================================================
// ELEMENTOS
// ==================================================

const botao = document.getElementById("enviar");

const chat = document.getElementById("chat");

const mensagem = document.getElementById("mensagem");

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


// ==================================================
// HISTÓRICO
// ==================================================

let conversas = [];

let conversaAtual = -1;


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


        item.addEventListener("click", () => {

            conversaAtual = indice;

            chat.innerHTML =
                conversa.html;

            atualizarHistorico();

            chat.scrollTop =
                chat.scrollHeight;

        });


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
// ENVIAR MENSAGEM
// ==================================================

async function enviarMensagem(
    textoAutomatico = null
) {

    const texto =
        textoAutomatico ||
        mensagem.value.trim();


    if (!texto) return;


    // Se não existir conversa
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


    chat.scrollTop =
        chat.scrollHeight;


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
        document.createElement("div");


    pensando.className = "ia";


    pensando.id = "pensando";


    pensando.innerHTML = `

        <strong>🤖 Gemini</strong>

        <br><br>

        ⏳ Pensando...

    `;


    chat.appendChild(pensando);


    chat.scrollTop =
        chat.scrollHeight;


    try {

        // ==========================================
        // ENVIA PARA O SERVIDOR
        // ==========================================

        const resposta =
            await fetch("/chat", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    pergunta: texto

                })

            });


        if (!resposta.ok) {

            throw new Error(
                "Erro no servidor"
            );

        }


        const dados =
            await resposta.json();


        // ==========================================
        // REMOVE "PENSANDO"
        // ==========================================

        pensando.remove();


        // ==========================================
        // RESPOSTA DA IA
        // ==========================================

        const respostaSegura =
            escaparHTML(
                dados.resposta ||
                "Não recebi uma resposta."
            );


        chat.innerHTML += `

            <div class="ia">

                <strong>🤖 Gemini</strong>

                <br><br>

                ${respostaSegura}

            </div>

        `;


        // ==========================================
        // SALVA CONVERSA
        // ==========================================

        atualizarConversaAtual();


        chat.scrollTop =
            chat.scrollHeight;

    }


    catch (erro) {

        console.error(erro);


        if (pensando) {

            pensando.remove();

        }


        chat.innerHTML += `

            <div class="ia">

                <strong>⚠️ Erro</strong>

                <br><br>

                Não foi possível conversar com o Gemini.

                <br><br>

                Verifique se o servidor está
                funcionando no terminal.

            </div>

        `;


        atualizarConversaAtual();

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

        if (event.key === "Enter") {

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


atalhos.forEach((atalho) => {

    atalho.addEventListener(
        "click",
        () => {

            let prompt = "";


            switch (atalho.innerText.trim()) {

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

                enviarMensagem(prompt);

            }

        }
    );

});


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

        document.body.classList.add("dark");

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


        linhas.forEach((linha) => {

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

        });


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