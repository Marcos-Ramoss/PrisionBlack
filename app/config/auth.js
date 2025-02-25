module.exports = {
  secretKey: process.env.JWT_SECRET || 'segredo-padrao',
  expiresIn: '1h'
};