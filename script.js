const apiKeyInput = document.getElementById("apiKey")
const gameSelect = document.getElementById("gameSelect")
const questionInput = document.getElementById("questionInput")
const askButton = document.getElementById("askButton")
const aiResponse = document.getElementById("aiResponse")
const form = document.getElementById("form")

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const pergunta = `
    ## Especialidade
    Voce é um especialista assistente de meta para o jogo ${game}

    ## Tarefa
    Voce deve responder as perguntas do usuario com base no seu conhecimento do jogo, estrategias, builds e dicas

    ## Regras
    - Se voce nao sabe a resposta, responda com 'Não sei' e nao tente inventar uma resposta.
    - Se a pergunta nao esta relacionada ao jogo, responda com 'Essa pergunta nao esta relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faca pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que voce nao tenha certeza que existe no patch atual. 

    ## Resposta
    - Economize na resposta, seja  direto e responda no maximo 500 caracteres
    - Responda em markdown
    - Nao precisa fazer nenhuma saudacao ou despedida, apenas responda o que o usuario esta querendo. 

   

    ---

    Aqui esta a pergunta do usuario ${question}

    `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // Chamada API
    
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (evento) => {
    evento.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

askButton.disabled = true
askButton.textContent = 'Perguntando...'
askButton.classList.add('loading')

try {
    // Perguntar para AI
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove('hidden')

} catch (error) {
    console.log("Erro: ", error)
}finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove("loading")
}

}

form.addEventListener("submit", enviarFormulario);