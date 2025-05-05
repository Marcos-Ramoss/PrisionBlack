// Função para calcular o tempo de carregamento baseado na velocidade da internet
function calculateLoadingTime() {

    let loadingTime = 3000;

    // Usando a API Navigator.connection para detectar a velocidade da conexão (quando disponível)
    if (navigator.connection) {
        const connection = navigator.connection;

        if (connection.effectiveType === '4g') {
            loadingTime = 1500;
        } else if (connection.effectiveType === '3g') {
            loadingTime = 2000;
        } else {
            loadingTime = 3000;
        }
    }

    return loadingTime;
}

// Criar o elemento loader
function createLoader() {
    const loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';

    const loaderIcon = document.createElement('div');
    loaderIcon.className = 'loader-icon';
    loaderIcon.innerHTML = '<i class="fa-solid fa-gavel"></i>';

    loaderContainer.appendChild(loaderIcon);
    document.body.appendChild(loaderContainer);

    return loaderContainer;
}


function showLoader(loader) {
    if (loader) {
        loader.classList.remove('loader-hidden');
    }
}


function hideLoader(loader) {
    if (loader) {
        loader.classList.add('loader-hidden');
    }
}

// Configuração do loader global
document.addEventListener('DOMContentLoaded', function () {

    const loader = createLoader();

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

            event.preventDefault();
            showLoader(loader);

            setTimeout(() => {
                window.location.href = link.href;
            }, calculateLoadingTime());
        }
    });


    window.addEventListener('popstate', function () {
        if (currentPage !== window.location.href) {
            showLoader(loader);

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