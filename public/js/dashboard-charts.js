// Initialize charts with data from the server
function initializeCharts(data) {
    const celasData = {
        labels: ['Total de Celas', 'Celas Ocupadas', 'Celas Disponíveis', 'Celas Alocadas'],
        datasets: [{
            label: 'Estatísticas de Celas',
            data: [data.totalCelas, data.totalCelasOcupadas, data.totalCelasDisponiveis, data.totalCelasAlocadas],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#17a2b8'],
            borderColor: ['#0056b3', '#1e7e34', '#d39e00', '#117a8b'],
            borderWidth: 1
        }]
    };

    const visitasData = {
        labels: ['Visitas Familiares', 'Visitas Advogados'],
        datasets: [{
            label: 'Estatísticas de Visitas',
            data: [data.totalVisitasFamiliares, data.totalVisitasAdvogados],
            backgroundColor: ['#17a2b8', '#dc3545'],
            borderColor: ['#117a8b', '#bd2130'],
            borderWidth: 1
        }]
    };

    const celasChart = new Chart(document.getElementById('celasChart'), {
        type: 'bar',
        data: celasData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const visitChart = new Chart(document.getElementById('visitChart'), {
        type: 'pie',
        data: visitasData,
        options: {
            responsive: true
        }
    });

    // Make charts available globally
    window.celasChart = celasChart;
    window.visitChart = visitChart;
}

function changeChartType(chartId, type) {
    const chart = chartId === 'celasChart' ? window.celasChart : window.visitChart;
    chart.config.type = type;
    chart.update();
}

// Function to show the selected section
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add events to menu buttons
    document.querySelectorAll('.sidebar-menu button').forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Show statistics section by default
    showSection('estatisticas');
}); 