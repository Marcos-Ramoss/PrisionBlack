document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    const menuButtons = document.querySelectorAll('.sidebar-menu button');

    // Função para alternar a barra lateral
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
    }

    // Função para fechar a barra lateral
    function closeSidebar() {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    }

    // Função para mostrar uma seção
    function showSection(sectionId) {
        // Atualizar estado dos botões
        menuButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });

        // Mostrar a seção selecionada
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Em telas menores, fechar a barra lateral após selecionar uma seção
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    }

    // Event Listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);

    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Fechar a barra lateral ao clicar fora
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && 
            !sidebarToggle.contains(event.target) && 
            sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Mostrar a seção de estatísticas por padrão
    showSection('estatisticas');
    menuButtons[0].classList.add('active');

    // Ajustar layout em redimensionamento
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}); 