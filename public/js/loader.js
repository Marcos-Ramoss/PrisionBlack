// Função para calcular o tempo de carregamento baseado na velocidade da internet
function calculateLoadingTime() {
    // Por padrão, definimos um tempo mínimo de 3 segundos
    let loadingTime = 3000;

    // Usando a API Navigator.connection para detectar a velocidade da conexão (quando disponível)
    if (navigator.connection) {
        const connection = navigator.connection;

        // Ajustar o tempo de carregamento baseado no tipo de conexão
        if (connection.effectiveType === '4g') {
            loadingTime = 1500; // 3 segundos para conexões rápidas
        } else if (connection.effectiveType === '3g') {
            loadingTime = 2000; // 4 segundos para conexões médias
        } else {
            loadingTime = 3000; // 5 segundos para conexões lentas (2g ou menos)
        }
    }

    return loadingTime;
}

// Criar o elemento loader
function createLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';

    const loader = document.createElement('div');
    loader.className = 'loader';

    const loaderText = document.createElement('div');
    loaderText.className = 'loader-text';
    loaderText.innerHTML = '<i class="fa-solid fa-gavel"></i> Carregando...';

    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderText);
    document.body.appendChild(loaderContainer);

    return loaderContainer;
}

// Mostrar o loader
function showLoader(loader) {
    if (loader) {
        loader.classList.remove('loader-hidden');
    }
}

// Esconder o loader
function hideLoader(loader) {
    if (loader) {
        loader.classList.add('loader-hidden');
    }
}

// Configuração do loader global
document.addEventListener('DOMContentLoaded', function () {
    // Criar o loader ao carregar a página
    const loader = createLoader();

    // Registrar página atual para detectar navegação
    let currentPage = window.location.href;

    // Esconder o loader após o carregamento inicial
    setTimeout(() => {
        hideLoader(loader);
    }, calculateLoadingTime());

    // Configurar evento para capturar cliques em links internos
    document.addEventListener('click', function (event) {
        // Verificar se o clique foi em um link
        const link = event.target.closest('a');

        if (link && link.href && link.href.startsWith(window.location.origin) &&
            !link.hasAttribute('data-bs-toggle') &&
            !link.getAttribute('href').startsWith('#')) {
            // É um link interno, não é um toggle de modal ou similar, e não é uma âncora
            event.preventDefault();

            // Mostrar o loader
            showLoader(loader);

            // Navegar para a página após o tempo de carregamento
            setTimeout(() => {
                window.location.href = link.href;
            }, calculateLoadingTime());
        }
    });

    // Lidar com navegação usando botões de voltar/avançar do navegador
    window.addEventListener('popstate', function () {
        if (currentPage !== window.location.href) {
            showLoader(loader);

            // Recarregar a página após o tempo de carregamento
            setTimeout(() => {
                window.location.reload();
            }, calculateLoadingTime());
        }
    });

    // Salvar a URL no sessionStorage antes de descarregar a página
    window.addEventListener('beforeunload', function () {
        sessionStorage.setItem('previousPage', window.location.href);
    });

    // Verificar se estamos vindo de outra página interna
    if (sessionStorage.getItem('previousPage')) {
        const previousPage = sessionStorage.getItem('previousPage');

        // Se está vindo de outra página do mesmo site, mostrar o loader
        if (previousPage && previousPage.startsWith(window.location.origin)) {
            showLoader(loader);

            setTimeout(() => {
                hideLoader(loader);
            }, calculateLoadingTime());
        }
    }
}); 