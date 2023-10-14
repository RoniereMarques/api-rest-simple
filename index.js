const express = require("express");
const app = express();
const port = 8080;
const axios = require('axios');
const bodyParser = require("body-parser");
const cors = require('cors'); // Importe o pacote CORS
// bloqueia o app de parar se ouver erro no console 'catch'.
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});
// Configurar o body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Configurar middleware de CORS para permitir solicitações do seu domínio
app.use(cors({
  origin: 'https://ronieremarques.blogs-tutorials.com'
}));
// Adicionar uma rota para a página index.html
app.get("/", (req, res) => {
  res.json({
    'State': 'online',
    'Created': '17.09.2023',
    'Copyright': 'Roniere Marques',
    'Developer': 'https://ronieremarques.blogs-tutorials.com/',
    'Host': 'VPS 1.0'
  })
});

// Função para buscar informações de metadados da URL
async function buscarInformacoesDaURL(linkAfiliado) {
  try {
      const apiKey = 'sua_api-key-aqui'; // Substitua pela sua chave de API
      const endpoint = `https://opengraph.io/api/1.0/site/${encodeURIComponent(linkAfiliado)}?app_id=${apiKey}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data && data.hybridGraph) {
          const titulo = data.hybridGraph.title || 'Título não encontrado';
          const imagem = data.hybridGraph.image || '';

          return {
              titulo: titulo,
              imagem: imagem,
              link: linkAfiliado
          };
      } else {
          return {
              erro: 'Informações não encontradas.'
          };
      }
  } catch (error) {
      return {
          erro: error.message
      };
  }
}


app.get("/affiliate", async (req, res) => {
  const { link } = req.query;

  if (!link) {
      return res.status(400).json({ erro: 'Fornça um link válido.' });
  }

  const informacoes = await buscarInformacoesDaURL(link);

  res.json(informacoes);
});

app.get("/youtube", (req, res) => {
  // Extrair o ID do vídeo da consulta da URL
  const videoId = req.query.id;

  // Verificar se o ID do vídeo foi fornecido
  if (!videoId) {
    res.json({
      'status': 404,
      'response': 'ID do video nao fornecido'
    });
    return;
  }

  // Construir a URL com o ID do vídeo
  const apiUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;

  // Fazer a solicitação GET
  axios.get(apiUrl)
    .then((response) => {
      // Enviar os dados da resposta de volta ao cliente
      res.json(response.data);
    })
    .catch((error) => {
      // Tratamento de erros
      console.error('Erro ao fazer a solicitacao:', error);
      res.json({
        'status': 404,
        'response': 'Erro ao buscar informacoes do video'
      });
    });
});


  app.use((req, res) => {
    res.redirect('/')
  });

  // Iniciar o servidor
  app.listen(port, () => {
    console.log(`Olá, eu loguei com sucesso no ID: ${port}`);
});