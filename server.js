import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/health", (req, res) => {
    res.json({
        status: "online",
        mensagem: "Marketing IA Assistente está funcionando!"
    });
});

app.post("/chat", async (req, res) => {
    try {
        const { pergunta } = req.body;

        if (!pergunta || !pergunta.trim()) {
            return res.status(400).json({
                resposta: "Digite uma pergunta para começar."
            });
        }

        const prompt = `
Você é o MARKETING IA ASSISTENTE, uma Inteligência Artificial especializada em Marketing Digital.

Sua função é ajudar empresas, empreendedores e estudantes a desenvolver estratégias de marketing.

Você pode ajudar com:

- Plano de Marketing
- Análise SWOT
- Criação de Persona
- Redes Sociais
- SEO
- Tráfego Pago
- Branding
- Campanhas Publicitárias
- Marketing de Conteúdo
- Calendário de Conteúdo
- Estratégias de vendas
- Posicionamento de marca
- Comunicação empresarial
- Ideias para empresas

REGRAS:

1. Responda sempre em português do Brasil.
2. Seja claro, profissional e fácil de entender.
3. Organize respostas grandes usando títulos e listas.
4. Dê exemplos práticos sempre que possível.
5. Quando o usuário pedir uma estratégia, apresente passos claros.
6. Não invente dados apresentados como fatos.
7. Se faltar alguma informação importante, faça uma pergunta ao usuário.
8. Mantenha o foco em Marketing Digital e Administração.
9. Seja útil para pequenas e médias empresas.
10. Evite respostas excessivamente longas quando uma resposta objetiva resolver o problema.

PERGUNTA DO USUÁRIO:

${pergunta}

Responda agora de forma útil e profissional.
`;

        let resposta;

        const maxTentativas = 3;

        for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
            try {
                resposta = await ai.models.generateContent({
                    model: "gemini-3.6-flash",
                    contents: prompt
                });

                break;

            } catch (erro) {
                console.error(
                    `Tentativa ${tentativa} falhou:`,
                    erro
                );

                if (tentativa === maxTentativas) {
                    throw erro;
                }

                const espera = tentativa * 2000;

                await new Promise(resolve =>
                    setTimeout(resolve, espera)
                );
            }
        }

        res.json({
            resposta: resposta.text
        });

    } catch (erro) {
        console.error("Erro no Gemini:", erro);

        res.status(500).json({
            resposta:
                "Desculpe, o Gemini está temporariamente ocupado. Tente novamente em alguns segundos."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `🚀 Marketing IA Assistente rodando na porta ${PORT}`
    );
});