// Função para inicializar a busca
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    let typingTimer;
    const doneTypingInterval = 400; // ms

    if (searchInput && searchForm) {
        searchInput.addEventListener('input', function() {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                if (searchInput.value.length === 0 || searchInput.value.length >= 10) {
                    searchForm.submit();
                }
            }, doneTypingInterval);
        });
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
}); 