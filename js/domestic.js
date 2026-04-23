function renderDomestic() {
    const content = document.getElementById('domestic');
    content.innerHTML = `
        <div class="card domestic">
            <div class="card-header flex-between">
                <div>
                    <div class="card-title">Domestic Waste Quality Monitor</div>
                    <div class="card-description">Real-time BOD, COD, and TOC measurements by area</div>
                </div>
                <div class="select-group">
                    <select id="areaSelect" class="select-trigger">
                        <option value="North Zone">North Zone</option>
                        <option value="South Zone">South Zone</option>
                        <option value="East Zone">East Zone</option>
                        <option value="West Zone">West Zone</option>
                        <option value="Central Zone">Central Zone</option>
                    </select>
                </div>
            </div>
            <div class="card-content">
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">BOD (mg/L)</div>
                        <div class="metric-value" id="bodValue">120</div>
                        <div class="metric-description">Biochemical Oxygen Demand</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">COD (mg/L)</div>
                        <div class="metric-value" id="codValue">250</div>
                        <div class="metric-description">Chemical Oxygen Demand</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">TOC (mg/L)</div>
                        <div class="metric-value" id="tocValue">85</div>
                        <div class="metric-description">Total Organic Carbon</div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-title">Water Quality Trend - North Zone</div>
                    <canvas id="trendChart" style="max-height: 300px;"></canvas>
                </div>

                <div class="chart-container">
                    <div class="chart-title">Area Comparison - Current BOD Levels</div>
                    <canvas id="comparisonChart" style="max-height: 250px;"></canvas>
                </div>
            </div>
        </div>
    `;

    initDomesticListeners();
    initDomesticCharts();
}

function initDomesticListeners() {
    document.getElementById('areaSelect').addEventListener('change', function() {
        const area = this.value;
        const data = waterQualityData[area];
        document.getElementById('bodValue').textContent = data.BOD;
        document.getElementById('codValue').textContent = data.COD;
        document.getElementById('tocValue').textContent = data.TOC;
        document.querySelector('.chart-title').textContent = `Water Quality Trend - ${area}`;
        updateTrendChart(data.timeline);
    });
}

function initDomesticCharts() {
    const area = document.getElementById('areaSelect')?.value || 'North Zone';
    const data = waterQualityData[area];
    
    if (!data) return;

    // Trend Chart
    const lineDatasets = [
        {
            label: 'BOD',
            data: data.timeline.map(d => d.BOD),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            borderWidth: 2
        },
        {
            label: 'COD',
            data: data.timeline.map(d => d.COD),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            borderWidth: 2
        },
        {
            label: 'TOC',
            data: data.timeline.map(d => d.TOC),
            borderColor: '#14b8a6',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            tension: 0.4,
            borderWidth: 2
        }
    ];

    createLineChart('trendChart', data.timeline, lineDatasets);

    // Comparison Chart
    if (chartInstances.comparisonChart) chartInstances.comparisonChart.destroy();
    const canvas = document.getElementById('comparisonChart');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        chartInstances.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allWaterQualityData.map(d => d.area),
                datasets: [{
                    label: 'BOD (mg/L)',
                    data: allWaterQualityData.map(d => d.BOD),
                    backgroundColor: '#3b82f6',
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
}

function updateTrendChart(timeline) {
    if (chartInstances.trendChart) {
        chartInstances.trendChart.data.labels = timeline.map(d => d.date);
        chartInstances.trendChart.data.datasets[0].data = timeline.map(d => d.BOD);
        chartInstances.trendChart.data.datasets[1].data = timeline.map(d => d.COD);
        chartInstances.trendChart.data.datasets[2].data = timeline.map(d => d.TOC);
        chartInstances.trendChart.update();
    }
}
