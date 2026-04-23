let chartInstances = {};
let submissions = [];
let currentAuthority = null;
let selectedZone = pollutionZones[0];

function getPollutionColor(level) {
    if (level < 25) return '#10b981';
    if (level < 50) return '#eab308';
    if (level < 75) return '#f97316';
    return '#ef4444';
}

function getPollutionLabel(level) {
    if (level < 25) return 'Good';
    if (level < 50) return 'Moderate';
    if (level < 75) return 'Poor';
    return 'Hazardous';
}

function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

function createPieChart(elementId, data, color) {
    const canvas = document.getElementById(elementId);
    if (!canvas || !canvas.getContext) return;
    
    destroyChart(elementId);
    
    const ctx = canvas.getContext('2d');
    chartInstances[elementId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                data: data.map(d => d.percentage),
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } }
            }
        }
    });
}

function createBarChart(elementId, data, color) {
    const canvas = document.getElementById(elementId);
    if (!canvas || !canvas.getContext) return;
    
    destroyChart(elementId);
    
    const ctx = canvas.getContext('2d');
    chartInstances[elementId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: 'Tonnage',
                data: data.map(d => d.tons),
                backgroundColor: color,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function createLineChart(elementId, timeline, datasets) {
    const canvas = document.getElementById(elementId);
    if (!canvas || !canvas.getContext) return;
    
    destroyChart(elementId);
    
    const ctx = canvas.getContext('2d');
    chartInstances[elementId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeline.map(d => d.date),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function populateTable(tableId, data) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = data.map((item) => `
        <tr>
            <td>${item.name}</td>
            <td style="text-align: right;">${item.percentage}%</td>
            <td style="text-align: right;">${item.tons.toLocaleString()}</td>
            <td style="text-align: right;">
                <span class="status-badge ${item.percentage > 30 ? 'status-high' : item.percentage > 15 ? 'status-medium' : 'status-low'}">
                    ${item.percentage > 30 ? 'High' : item.percentage > 15 ? 'Medium' : 'Low'}
                </span>
            </td>
        </tr>
    `).join('');
}

function closeModal() {
    document.getElementById('alertModal').classList.remove('active');
}

window.closeModal = closeModal;
