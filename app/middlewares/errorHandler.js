const RecursoNaoEncontradoExcecao = require('../exceptions/RecursoNaoEncontradoExcecao');
const ValidacaoExcecao = require('../exceptions/ValidacaoExcecao');
const AcessoNegadoExcecao = require('../exceptions/AcessoNegadoExcecao');
const RegraNegocioExcecao = require('../exceptions/RegraNegocioExcecao');

const errorHandler = (erro, req, res, next) => {
  let statusCode = 500;
  let mensagem = 'Erro interno do servidor';
  let detalhes = null;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (erro instanceof RecursoNaoEncontradoExcecao) {
    statusCode = erro.statusCode;
    mensagem = erro.message;
  } else if (erro instanceof ValidacaoExcecao) {
    statusCode = erro.statusCode;
    mensagem = erro.message;
    detalhes = erro.erros;
  } else if (erro instanceof AcessoNegadoExcecao) {
    statusCode = erro.statusCode;
    mensagem = erro.message;
  } else if (erro instanceof RegraNegocioExcecao) {
    statusCode = erro.statusCode;
    mensagem = erro.message;
  } else if (erro.name === 'ValidationError') {
    statusCode = 400;
    mensagem = 'Erro de validação';
    detalhes = Object.values(erro.errors).map(err => err.message);
  } else if (erro.name === 'CastError') {
    statusCode = 400;
    mensagem = 'ID inválido';
  } else if (erro.code === 11000) {
    statusCode = 409;
    mensagem = 'Recurso já existe';
  } else {
    console.error('Erro não tratado:', {
      mensagem: erro.message,
      stack: erro.stack,
      nome: erro.name,
      codigo: erro.code
    });
    
    if (isDevelopment) {
      mensagem = erro.message || 'Erro interno do servidor';
      detalhes = {
        nome: erro.name,
        mensagem: erro.message,
        stack: erro.stack
      };
    }
  }

  if (req.accepts('json')) {
    const resposta = {
      sucesso: false,
      mensagem,
      ...(detalhes && { detalhes })
    };
    
    if (isDevelopment && erro.stack) {
      resposta.debug = {
        stack: erro.stack,
        nome: erro.name
      };
    }
    
    return res.status(statusCode).json(resposta);
  }

  req.flash('error', mensagem);
  
  if (statusCode === 404) {
    return res.redirect('/home');
  }
  
  if (statusCode === 403) {
    return res.redirect('/');
  }

  if (isDevelopment) {
    return res.status(statusCode).send(`
      <h1>Erro ${statusCode}</h1>
      <p><strong>Mensagem:</strong> ${mensagem}</p>
      ${detalhes ? `<p><strong>Detalhes:</strong> ${JSON.stringify(detalhes, null, 2)}</p>` : ''}
      ${erro.stack ? `<pre>${erro.stack}</pre>` : ''}
    `);
  }

  return res.status(statusCode).send(mensagem);
};

module.exports = errorHandler;

