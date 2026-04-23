let pollutionMap = null;
let pollutionMarkers = [];
let selectedMarker = null;

const puneCoordinates = {
    center: { lat: 18.5204, lng: 73.8567 },
    zones: [
        { id: 'north-industrial', name: 'North Industrial Zone', lat: 18.5700, lng: 73.8400, level: 85, pollutants: { pm25: 150, pm10: 280, no2: 180, so2: 220 } },
        { id: 'east-residential', name: 'East Residential Area', lat: 18.5400, lng: 73.9200, level: 45, pollutants: { pm25: 65, pm10: 110, no2: 70, so2: 45 } },
        { id: 'south-commercial', name: 'South Commercial Zone', lat: 18.4800, lng: 73.8700, level: 60, pollutants: { pm25: 95, pm10: 165, no2: 120, so2: 85 } },
        { id: 'west-landfill', name: 'West Landfill Area', lat: 18.5300, lng: 73.7800, level: 75, pollutants: { pm25: 120, pm10: 220, no2: 140, so2: 160 } },
        { id: 'central-mixed', name: 'Central Mixed Zone', lat: 18.5200, lng: 73.8600, level: 55, pollutants: { pm25: 80, pm10: 140, no2: 100, so2: 70 } }
    ]
};

function getPollutionCircleColor(level) {
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

function initGoogleMap() {
    const mapContainer = document.getElementById('googleMap');
    if (!mapContainer) return;

    pollutionMap = new google.maps.Map(mapContainer, {
        zoom: 12,
        center: puneCoordinates.center,
        mapTypeId: 'satellite',
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    renderPollutionMarkers();
}

function renderPollutionMarkers() {
    clearMarkers();

    puneCoordinates.zones.forEach(zone => {
        const circle = new google.maps.Circle({
            map: pollutionMap,
            center: { lat: zone.lat, lng: zone.lng },
            radius: 3000,
            fillColor: getPollutionCircleColor(zone.level),
            fillOpacity: 0.6,
            strokeColor: getPollutionCircleColor(zone.level),
            strokeWeight: 2,
            strokeOpacity: 0.8
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: Arial;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px;">${zone.name}</h3>
                    <p style="margin: 4px 0; font-size: 12px;">AQI: ${zone.level}</p>
                    <p style="margin: 4px 0; font-size: 12px;">Status: ${getPollutionLabel(zone.level)}</p>
                </div>
            `
        });

        circle.addListener('click', () => {
            if (selectedMarker) {
                selectedMarker.infoWindow.close();
            }
            infoWindow.open(pollutionMap, circle);
            selectedMarker = { circle, infoWindow };
            updatePollutionDetails(zone);
        });

        pollutionMarkers.push({ circle, zone, infoWindow });
    });

    if (pollutionMarkers.length > 0) {
        pollutionMarkers[0].infoWindow.open(pollutionMap, pollutionMarkers[0].circle);
        selectedMarker = pollutionMarkers[0];
        updatePollutionDetails(pollutionMarkers[0].zone);
    }
}

function clearMarkers() {
    pollutionMarkers.forEach(marker => {
        marker.circle.setMap(null);
    });
    pollutionMarkers = [];
}

function updatePollutionDetails(zone) {
    const statusColor = getPollutionCircleColor(zone.level);
    const statusText = getPollutionLabel(zone.level);
    
    document.getElementById('zoneName').textContent = zone.name;
    document.getElementById('zoneStatus').textContent = `${statusText} - AQI ${zone.level}`;
    document.getElementById('zoneStatus').style.color = statusColor;
    document.getElementById('pm25').textContent = zone.pollutants.pm25;
    document.getElementById('pm10').textContent = zone.pollutants.pm10;
    document.getElementById('no2').textContent = zone.pollutants.no2;
    document.getElementById('so2').textContent = zone.pollutants.so2;
    
    const panel = document.getElementById('detailsPanel');
    panel.style.display = 'block';
    panel.style.background = `linear-gradient(to bottom right, ${statusColor}20, ${statusColor}10)`;
}

function toggleMapFullscreen() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function renderPollution() {
    const content = document.getElementById('pollution');
    content.innerHTML = `
        <div class="card pollution">
            <div class="card-header">
                <div>
                    <div class="card-title">Pollution Heatmap - Satellite View</div>
                    <div class="card-description">Real-time air quality monitoring across Pune zones</div>
                </div>
            </div>
            <div class="card-content">
                <div style="display: grid; grid-template-columns: 1fr 250px; gap: 24px; margin-bottom: 24px;">
                    <div id="mapContainer" style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <div id="googleMap" style="width: 100%; height: 400px;"></div>
                        <button onclick="window.toggleMapFullscreen()" style="position: absolute; top: 10px; right: 10px; padding: 8px 12px; background: white; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; z-index: 1000;">⛶ Fullscreen</button>
                    </div>

                    <div id="detailsPanel" class="details-panel" style="background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5); border: 1px solid #bbf7d0; display: none; max-height: 400px; overflow-y: auto;">
                        <h4 id="zoneName">Zone Name</h4>
                        <div class="details-grid">
                            <div class="detail-item">
                                <div class="detail-label">Status</div>
                                <div id="zoneStatus" class="detail-value" style="color: #065f46;">Good - AQI 20</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">PM 2.5 (µg/m³)</div>
                                <div id="pm25" class="detail-value">50</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">PM 10 (µg/m³)</div>
                                <div id="pm10" class="detail-value">100</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">NO₂ (ppb)</div>
                                <div id="no2" class="detail-value">60</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">SO₂ (ppb)</div>
                                <div id="so2" class="detail-value">40</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-title">Zone Legend</div>
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: #10b981; border-radius: 50%; width: 20px; height: 20px;"></div>
                            <span>Good (0-25)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #eab308; border-radius: 50%; width: 20px; height: 20px;"></div>
                            <span>Moderate (25-50)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #f97316; border-radius: 50%; width: 20px; height: 20px;"></div>
                            <span>Poor (50-75)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #ef4444; border-radius: 50%; width: 20px; height: 20px;"></div>
                            <span>Hazardous (75-100)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initGoogleMap();
    }, 100);
}

window.toggleMapFullscreen = toggleMapFullscreen;
