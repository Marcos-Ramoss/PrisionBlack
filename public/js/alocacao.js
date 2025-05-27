// Função para mostrar alertas
function showAlert(type, message) {
    const alert = document.getElementById(`${type}Alert`);
    alert.textContent = message;
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Função para inicializar o formulário de alocação
function initializeAlocacaoForm() {
    const form = document.getElementById('alocacaoForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const detentoId = document.getElementById('detentoId').value;
        const celaId = document.getElementById('celaId').value;
        const celaSelect = document.getElementById('celaId');
        const celaOption = celaSelect.options[celaSelect.selectedIndex];

        // Verificar se a cela está cheia
        const capacidade = parseInt(celaOption.dataset.capacidade);
        const ocupantes = parseInt(celaOption.dataset.ocupantes);

        if (ocupantes >= capacidade) {
            showAlert('error', 'Esta cela está com capacidade máxima');
            return;
        }

        try {
            const response = await fetch('/alocacao/alocar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    detentoId,
                    celaId
                })
            });

            const data = await response.json();

            if (data.success) {
                showAlert('success', data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                showAlert('error', data.message);
            }
        } catch (error) {
            showAlert('error', 'Erro ao alocar detento. Tente novamente.');
            console.error('Erro:', error);
        }
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeAlocacaoForm();
}); 