// Função para mostrar mensagem de erro
function showErrorMessage(message) {
    document.getElementById('errorMessage').innerHTML = `
        <p class="mb-0">${message}</p>
        <p class="text-muted mt-2">Por favor, verifique as informações e tente novamente.</p>
    `;
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    document.getElementById('successMessage').innerHTML = `
        <p class="mb-0">${message}</p>
        <p class="text-muted mt-2">Você será redirecionado para a lista de celas.</p>
    `;
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();

    // Redireciona para /celas/lista ao fechar o modal
    const successModalElement = document.getElementById('successModal');
    successModalElement.addEventListener('hidden.bs.modal', () => {
        window.location.href = '/celas/lista';
    });
}

// Função para inicializar o formulário de cadastro de celas
function initializeCelaForm() {
    const form = document.getElementById('celaForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Coleta os dados do formulário
        const formData = {
            codigo: document.getElementById('codigo').value,
            pavilhao: document.getElementById('pavilhao').value,
            capacidade: document.getElementById('capacidade').value,
        };

        try {
            // Envia os dados para o backend
            const response = await fetch('/celas/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // Verifica se a resposta é válida
            if (!response.ok) {
                // Verifica o conteúdo da mensagem de erro
                if (result.message && result.message.includes('cela já cadastrada')) {
                    throw new Error('Cela já cadastrada');
                } else if (result.message && result.message.includes('detento já está em uma cela')) {
                    throw new Error('Detento já contém uma cela');
                } else {
                    throw new Error('Erro ao cadastrar cela.');
                }
            }

            if (result.success) {
                showSuccessMessage(result.message);
            } else {
                // Verifica o conteúdo da mensagem de erro
                if (result.message && result.message.includes('cela já cadastrada')) {
                    throw new Error('Cela já cadastrada');
                } else if (result.message && result.message.includes('detento já está em uma cela')) {
                    throw new Error('Detento já contém uma cela');
                } else {
                    throw new Error(result.message || 'Erro ao cadastrar cela.');
                }
            }
        } catch (error) {
            showErrorMessage(error.message);
        }
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeCelaForm();
}); 