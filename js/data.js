const waterQualityData = {
    'North Zone': { BOD: 120, COD: 250, TOC: 85, timeline: [
        { date: 'Jan 1', BOD: 120, COD: 250, TOC: 85 },
        { date: 'Jan 8', BOD: 125, COD: 260, TOC: 88 },
        { date: 'Jan 15', BOD: 118, COD: 245, TOC: 83 },
        { date: 'Jan 22', BOD: 130, COD: 270, TOC: 92 },
        { date: 'Jan 29', BOD: 115, COD: 240, TOC: 80 }
    ]},
    'South Zone': { BOD: 95, COD: 180, TOC: 62, timeline: [
        { date: 'Jan 1', BOD: 95, COD: 180, TOC: 62 },
        { date: 'Jan 8', BOD: 92, COD: 175, TOC: 60 },
        { date: 'Jan 15', BOD: 98, COD: 190, TOC: 65 },
        { date: 'Jan 22', BOD: 88, COD: 170, TOC: 58 },
        { date: 'Jan 29', BOD: 100, COD: 195, TOC: 67 }
    ]},
    'East Zone': { BOD: 150, COD: 310, TOC: 105, timeline: [
        { date: 'Jan 1', BOD: 150, COD: 310, TOC: 105 },
        { date: 'Jan 8', BOD: 155, COD: 320, TOC: 110 },
        { date: 'Jan 15', BOD: 148, COD: 305, TOC: 103 },
        { date: 'Jan 22', BOD: 160, COD: 330, TOC: 115 },
        { date: 'Jan 29', BOD: 145, COD: 300, TOC: 100 }
    ]},
    'West Zone': { BOD: 80, COD: 160, TOC: 55, timeline: [
        { date: 'Jan 1', BOD: 80, COD: 160, TOC: 55 },
        { date: 'Jan 8', BOD: 82, COD: 165, TOC: 57 },
        { date: 'Jan 15', BOD: 78, COD: 155, TOC: 53 },
        { date: 'Jan 22', BOD: 85, COD: 170, TOC: 59 },
        { date: 'Jan 29', BOD: 75, COD: 150, TOC: 50 }
    ]},
    'Central Zone': { BOD: 110, COD: 230, TOC: 78, timeline: [
        { date: 'Jan 1', BOD: 110, COD: 230, TOC: 78 },
        { date: 'Jan 8', BOD: 112, COD: 235, TOC: 80 },
        { date: 'Jan 15', BOD: 108, COD: 225, TOC: 76 },
        { date: 'Jan 22', BOD: 115, COD: 240, TOC: 82 },
        { date: 'Jan 29', BOD: 105, COD: 220, TOC: 74 }
    ]}
};

const allWaterQualityData = [
    { area: 'North Zone', BOD: 120, COD: 250, TOC: 85 },
    { area: 'South Zone', BOD: 95, COD: 180, TOC: 62 },
    { area: 'East Zone', BOD: 150, COD: 310, TOC: 105 },
    { area: 'West Zone', BOD: 80, COD: 160, TOC: 55 },
    { area: 'Central Zone', BOD: 110, COD: 230, TOC: 78 }
];

const solidWasteData = [
    { name: 'Construction', percentage: 35, tons: 1500 },
    { name: 'Mining', percentage: 25, tons: 1200 },
    { name: 'Manufacturing', percentage: 20, tons: 950 },
    { name: 'Food Processing', percentage: 12, tons: 580 },
    { name: 'Others', percentage: 8, tons: 380 }
];

const liquidWasteData = [
    { name: 'Chemical Plants', percentage: 40, tons: 8000 },
    { name: 'Textile Mills', percentage: 28, tons: 5600 },
    { name: 'Paper Mills', percentage: 18, tons: 3600 },
    { name: 'Food Industries', percentage: 10, tons: 2000 },
    { name: 'Others', percentage: 4, tons: 800 }
];

const airWasteData = [
    { name: 'Power Plants', percentage: 45, tons: 4500 },
    { name: 'Steel Industry', percentage: 30, tons: 3000 },
    { name: 'Cement Plants', percentage: 18, tons: 1800 },
    { name: 'Chemical Plants', percentage: 5, tons: 500 },
    { name: 'Others', percentage: 2, tons: 200 }
];

const pollutionZones = [
    { id: 'north-industrial', name: 'North Industrial Zone', level: 85, x: 15, y: 15, width: 30, height: 25, pollutants: { pm25: 150, pm10: 280, no2: 180, so2: 220 } },
    { id: 'east-residential', name: 'East Residential Area', level: 45, x: 65, y: 20, width: 30, height: 25, pollutants: { pm25: 65, pm10: 110, no2: 70, so2: 45 } },
    { id: 'south-commercial', name: 'South Commercial Zone', level: 60, x: 50, y: 65, width: 35, height: 25, pollutants: { pm25: 95, pm10: 165, no2: 120, so2: 85 } },
    { id: 'west-landfill', name: 'West Landfill Area', level: 75, x: 10, y: 60, width: 30, height: 25, pollutants: { pm25: 120, pm10: 220, no2: 140, so2: 160 } },
    { id: 'central-mixed', name: 'Central Mixed Zone', level: 55, x: 40, y: 40, width: 25, height: 20, pollutants: { pm25: 80, pm10: 140, no2: 100, so2: 70 } }
];

const authorities = [
    { id: 'municipality', name: 'Municipality', icon: '🏛️', email: 'alerts@municipality.gov.in', description: 'Local municipal corporation for waste management', color: 'blue', templates: [
        'Illegal dumping site found in residential area',
        'Waste collection vehicle not arrived for pickup',
        'Foul smell from local waste dump',
        'Water contamination near dump site',
        'Waste saturation in locality'
    ]},
    { id: 'spcb', name: 'State Pollution Control Board', icon: '🌍', email: 'grievances@spcb.gov.in', description: 'State authority for pollution monitoring and regulation', color: 'green', templates: [
        'High pollution levels detected',
        'Industrial effluent discharge observed',
        'Air quality below standards',
        'Water quality degradation',
        'Hazardous waste disposal'
    ]},
    { id: 'cpcb', name: 'Central Pollution Control Board', icon: '🏢', email: 'complaints@cpcb.gov.in', description: 'National environmental protection authority', color: 'purple', templates: [
        'Cross-state pollution incident',
        'Major industrial contamination',
        'National environmental emergency',
        'Compliance violation by large industry',
        'National water pollution crisis'
    ]}
];

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
