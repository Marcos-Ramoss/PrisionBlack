const UserModel = require('../models/UserModel');

class AuthService {
  static async register(userData) {
    const { username, password } = userData;
    const userExists = await UserModel.findOne({ username });
    if (userExists) throw new Error('Usuário já existe.');
    const newUser = new UserModel({ username, password });
    return await newUser.save();
  }

  static async login(username, password) {
    const user = await UserModel.findOne({ username });
    if (!user) throw new Error('Usuário não encontrado.');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Senha incorreta.');
    return user;
  }
}

module.exports = AuthService;