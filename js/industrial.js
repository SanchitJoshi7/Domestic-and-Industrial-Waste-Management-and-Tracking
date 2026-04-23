function renderIndustrial() {
    const content = document.getElementById('industrial');
    content.innerHTML = `
        <div class="card industrial">
            <div class="card-header">
                <div>
                    <div class="card-title">Industrial Waste Management</div>
                    <div class="card-description">Monitoring solid, liquid, and air emissions by industry</div>
                </div>
            </div>
            <div class="card-content">
                <div class="tab-list" style="margin-bottom: 20px;">
                    <button class="tab-trigger active industrial-subtab" data-subtab="solid">📦 Solid Waste</button>
                    <button class="tab-trigger industrial-subtab" data-subtab="liquid">💧 Liquid Waste</button>
                    <button class="tab-trigger industrial-subtab" data-subtab="air">💨 Air Emissions</button>
                </div>

                <div id="solid-industrial" class="subtab-content" style="display: block;">
                    ${renderWasteSection('Solid Waste', solidWasteData, 'MT', '#f59e0b', 4610, 2, 68)}
                </div>

                <div id="liquid-industrial" class="subtab-content" style="display: none;">
                    ${renderWasteSection('Liquid Waste', liquidWasteData, 'M³', '#3b82f6', 19800, 5, 72)}
                </div>

                <div id="air-industrial" class="subtab-content" style="display: none;">
                    ${renderWasteSection('Air Emissions', airWasteData, 'MT CO₂', '#6b7280', 10000, 8, 15)}
                </div>
            </div>
        </div>
    `;

    initIndustrialListeners();
    initIndustrialCharts('solid');
}

function renderWasteSection(title, data, unit, color, total, risks, rate) {
    const gradients = {
        'Solid Waste': 'from-amber-100 to-amber-50 border-amber-200',
        'Liquid Waste': 'from-blue-100 to-blue-50 border-blue-200',
        'Air Emissions': 'from-gray-100 to-gray-50 border-gray-200'
    };

    const metrics = title === 'Solid Waste' ? [
        { label: 'Total Solid Waste', value: total, unit: 'Metric Tons/Month', color: 'amber' },
        { label: 'High Risk Industries', value: risks, unit: 'Requiring intervention', color: 'red' },
        { label: 'Compliance Rate', value: rate + '%', unit: 'Industries compliant', color: 'green' }
    ] : title === 'Liquid Waste' ? [
        { label: 'Total Liquid Waste', value: total, unit: 'Cubic Meters/Month', color: 'blue' },
        { label: 'Critical Pollutants', value: risks, unit: 'Detected substances', color: 'red' },
        { label: 'Treatment Rate', value: rate + '%', unit: 'Treated before discharge', color: 'yellow' }
    ] : [
        { label: 'Total Air Emissions', value: total, unit: 'Metric Tons CO₂ Eq./Month', color: 'gray' },
        { label: 'Hazardous Emissions', value: risks, unit: 'Sources detected', color: 'red' },
        { label: 'Reduction Target', value: rate + '%', unit: 'Year-on-year goal', color: 'green' }
    ];

    return `
        <div class="metrics-grid">
            ${metrics.map(m => `
                <div class="metric-card" style="background: linear-gradient(to bottom right, #fe${m.color}00, #fe${m.color}50); border: 1px solid #fc${m.color}00;">
                    <div class="metric-label">${m.label}</div>
                    <div class="metric-value">${m.value}</div>
                    <div class="metric-description">${m.unit}</div>
                </div>
            `).join('')}
        </div>

        <div class="chart-container">
            <div class="chart-title">${title} - Industry Breakdown</div>
            <canvas id="${title.toLowerCase().replace(/\s+/g, '')}PieChart" style="max-height: 250px;"></canvas>
        </div>

        <div class="chart-container">
            <div class="chart-title">${title} - Tonnage Distribution</div>
            <canvas id="${title.toLowerCase().replace(/\s+/g, '')}BarChart" style="max-height: 250px;"></canvas>
        </div>

        <div class="chart-container">
            <div class="chart-title">Detailed Breakdown</div>
            <div class="table-wrapper">
                <table id="${title.toLowerCase().replace(/\s+/g, '')}Table">
                    <thead>
                        <tr>
                            <th>Industry</th>
                            <th style="text-align: right;">Percentage</th>
                            <th style="text-align: right;">Tonnage (${unit})</th>
                            <th style="text-align: right;">Status</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
}

function initIndustrialListeners() {
    document.querySelectorAll('.industrial-subtab').forEach(btn => {
        btn.addEventListener('click', function() {
            const subtab = this.getAttribute('data-subtab');
            document.querySelectorAll('.subtab-content').forEach(t => t.style.display = 'none');
            document.getElementById(`${subtab}-industrial`).style.display = 'block';
            document.querySelectorAll('.industrial-subtab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            setTimeout(() => initIndustrialCharts(subtab), 50);
        });
    });
}

function initIndustrialCharts(type) {
    let data, chartId, color;

    if (type === 'solid') {
        data = solidWasteData;
        chartId = 'solidwaste';
        color = '#f59e0b';
    } else if (type === 'liquid') {
        data = liquidWasteData;
        chartId = 'liquidwaste';
        color = '#3b82f6';
    } else {
        data = airWasteData;
        chartId = 'airemissions';
        color = '#6b7280';
    }

    createPieChart(`${chartId}PieChart`, data, color);
    createBarChart(`${chartId}BarChart`, data, color);
    populateTable(`${chartId}Table`, data);
}
