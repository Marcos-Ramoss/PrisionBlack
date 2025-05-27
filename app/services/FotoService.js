class FotoService {
  static async processarFoto(file) {
    if (!file) return null;

    // Converte o arquivo para Base64
    const base64Image = file.buffer.toString('base64');
    return base64Image;
  }
}

module.exports = FotoService;