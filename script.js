const apiKeyInput = document.getElementById('apiKEY')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}


// AIzaSyAydFidkxYz15Dzur5PO4yXLI94gNR867A
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
    ## Especialidade
    VocÊ é um especialista assistente de meta para o jogo ${game}
    ## Tarefa
VocÊ deve responder as perguntas do usuário com base no seu conheciemnto do jogo, estratégias,build e dicas

    ## Regras
- Se vocÊ não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
- Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
- Considere a data atual ${new Date().toLocaleDateString()}
- Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
- Nunca responda itens que vc não tenha certeza de que existe no patch atual.


    ## Respostas
    - Economize na resposta, seja díreto e responda 650 caracteres
    - Responda em markDown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo

    ## Exemplo de respostas
     - Pergunta do usuário Melhor build colt
     resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n


     ---
     Aqui está a pergunta do usuário: ${question}

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

  // chamada API
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

const sendForm = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value



  if (apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos')
    return

  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading...')

  try {
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)

  } catch (error) {
    console.log('Erro: ', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }
}
form.addEventListener('submit', sendForm)
