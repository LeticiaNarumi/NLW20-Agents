const apiKeyInput = document.getElementById("apiKey")
const gameSelect = document.getElementById("gameSelect")
const questionInput = document.getElementById("questionInput")
const askButton = document.getElementById("askButton")
const aiResponse = document.getElementById("aiResponse")
const form = document.getElementById("form")


const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const pergunta = `olha, eu tenho esse jogo ${game} e queria saber ${question}`

    const contents = [{
        parts: [{
            text: pergunta
        }]
    }]
    // Chamada API
    
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents
        })
    })

    const data = await response.json()
    console.log({ data })
    return
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
    await perguntarAI(question, game, apiKey)
} catch (error) {
    console.log("Erro: ", error)
}finally {
    askButton.disabled = false
    askButton.textContent = 'Perguntar'
    askButton.classList.remove("loading")
}

}

form.addEventListener("submit", enviarFormulario);