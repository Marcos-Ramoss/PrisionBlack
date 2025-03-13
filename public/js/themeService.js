class ThemeService {
    constructor() {
      this.themeKey = 'app-theme';
      this.defaultTheme = 'light'; // Tema padrão
      this.currentTheme = this.getSavedTheme();
      this.applyTheme(this.currentTheme);
      console.log(`Tema inicial: ${this.currentTheme}`); 
    }
  
    // Obtém o tema salvo no localStorage
    getSavedTheme() {
        const savedTheme = localStorage.getItem(this.themeKey) || this.defaultTheme;
        console.log(`Tema obtido do localStorage: ${savedTheme}`); 
        return savedTheme;
      }
  
    // Salva o tema no localStorage
    saveTheme(theme) {
      localStorage.setItem(this.themeKey, theme);
      console.log(`Tema salvo no localStorage: ${theme}`); 
    }
  
    // Alterna entre os temas
    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      console.log(`Alternando para o tema: ${newTheme}`); 
      this.applyTheme(newTheme);
      this.saveTheme(newTheme);
      this.currentTheme = newTheme;
    }
  
    // Aplica o tema ao documento
    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      console.log(`Tema aplicado ao documento: ${theme}`); 
    }
  }
  
  // Exporta uma instância única do serviço (Singleton)
  const themeService = new ThemeService();
  export default themeService;