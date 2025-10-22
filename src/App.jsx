import { useState } from 'react'
import './App.css'

function App() {
  const [nome, setNome] = useState('')
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [imc, setImc] = useState(null)
  const [classificacao, setClassificacao] = useState('')
  const [diferenca, setDiferenca] = useState('')
  const [emoji, setEmoji] = useState('')
  const [historico, setHistorico] = useState([])
  const [alerta, setAlerta] = useState('')
  const [erros, setErros] = useState({ nome: false, altura: false, peso: false })

  function validarEntrada(alturaNum, pesoNum) {
    if (alturaNum > 3) {
      alturaNum = alturaNum / 100
    }

    if (alturaNum < 1.2 || alturaNum > 2.3) {
      setAlerta('⚠️ Altura fora do intervalo realista (1.2m a 2.3m)')
      setErros((prev) => ({ ...prev, altura: true }))
      return null
    }

    if (pesoNum < 20 || pesoNum > 300) {
      setAlerta('⚠️ Peso fora do intervalo realista (20kg a 300kg)')
      setErros((prev) => ({ ...prev, peso: true }))
      return null
    }

    setAlerta('')
    setErros({ nome: false, altura: false, peso: false })
    return alturaNum
  }

  function calcularIMC() {
    let camposInvalidos = { nome: false, altura: false, peso: false }

    if (!nome) camposInvalidos.nome = true
    if (!altura) camposInvalidos.altura = true
    if (!peso) camposInvalidos.peso = true

    if (camposInvalidos.nome || camposInvalidos.altura || camposInvalidos.peso) {
      setAlerta('⚠️ Preencha todos os campos corretamente!')
      setErros(camposInvalidos)
      return
    }

    let alturaNum = parseFloat(altura.replace(',', '.'))
    const pesoNum = parseFloat(peso.replace(',', '.'))

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      setAlerta('⚠️ Insira apenas valores numéricos válidos!')
      setErros({ nome: false, altura: true, peso: true })
      return
    }

    // Corrige entradas como 178 ou 1780 → 1.78
    if (alturaNum > 999) {
      alturaNum = alturaNum / 1000
    } else if (alturaNum > 10) {
      alturaNum = alturaNum / 100
    }

    alturaNum = validarEntrada(alturaNum, pesoNum)
    if (!alturaNum) return

    const resultado = pesoNum / (alturaNum * alturaNum)
    const imcFinal = resultado.toFixed(2)
    setImc(imcFinal)

    let classificacao = ''
    let emoji = ''

    if (resultado < 18.5) {
      classificacao = 'Abaixo do peso'
      emoji = '🥦'
    } else if (resultado < 25) {
      classificacao = 'Peso normal'
      emoji = '😎'
    } else if (resultado < 30) {
      classificacao = 'Sobrepeso'
      emoji = '😅'
    } else if (resultado < 35) {
      classificacao = 'Obesidade grau I'
      emoji = '😬'
    } else if (resultado < 40) {
      classificacao = 'Obesidade grau II'
      emoji = '😭⚖️'
    } else {
      classificacao = 'Obesidade grau III'
      emoji = '💀⚖️'
    }

    setClassificacao(classificacao)
    setEmoji(emoji)

    const pesoIdeal = 22 * (alturaNum * alturaNum)
    const diferencaPeso = pesoNum - pesoIdeal
    const textoDiferenca =
      diferencaPeso > 0
        ? `Você está ${diferencaPeso.toFixed(1)} kg acima do peso ideal.`
        : `Você está ${Math.abs(diferencaPeso).toFixed(1)} kg abaixo do peso ideal.`

    setDiferenca(textoDiferenca)

    const novaEntrada = {
      nome,
      altura: alturaNum,
      peso: pesoNum,
      imc: imcFinal,
      classificacao,
    }

    setHistorico((prev) => [novaEntrada, ...prev].slice(0, 5))
  }

  function limparCampos() {
    setNome('')
    setAltura('')
    setPeso('')
    setImc(null)
    setClassificacao('')
    setDiferenca('')
    setEmoji('')
    setAlerta('')
    setErros({ nome: false, altura: false, peso: false })
  }

  return (
    <div className="container">
      <h1>Calculadora de IMC</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={erros.nome ? 'erro' : ''}
        />
        <input
          type="text"
          placeholder="Altura (ex: 1.75 ou 175)"
          maxLength={5}
          value={altura}
          onChange={(e) => setAltura(e.target.value.replace(/[^0-9.,]/g, ''))}
          className={erros.altura ? 'erro' : ''}
        />
        <input
          type="text"
          placeholder="Peso (ex: 70)"
          maxLength={6}
          value={peso}
          onChange={(e) => setPeso(e.target.value.replace(/[^0-9.,]/g, ''))}
          className={erros.peso ? 'erro' : ''}
        />

        <div className="buttons">
          <button onClick={calcularIMC}>Calcular</button>
          <button onClick={limparCampos}>Limpar</button>
        </div>

        {alerta && <p className="alerta">{alerta}</p>}
      </div>

      {imc && (
        <div className="resultado">
          <h2>
            {emoji} {nome}, seu IMC é: {imc}
          </h2>
          <p>
            Classificação: <strong>{classificacao}</strong>
          </p>
          <p>{diferenca}</p>
        </div>
      )}

      {historico.length > 0 && (
        <div className="historico">
          <h3>Últimas medições:</h3>
          <ul>
            {historico.map((item, index) => (
              <li key={index}>
                <strong>{item.nome}</strong> — {item.peso} kg / {item.altura} m → IMC:{' '}
                {item.imc} ({item.classificacao})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
