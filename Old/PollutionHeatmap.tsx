import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

interface PollutionZone {
  id: string;
  name: string;
  level: number; // 0-100, 0-25 green, 25-50 yellow, 50-75 orange, 75-100 red
  x: number;
  y: number;
  width: number;
  height: number;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
  };
}

const POLLUTION_ZONES: PollutionZone[] = [
  {
    id: 'north-industrial',
    name: 'North Industrial Zone',
    level: 85,
    x: 15,
    y: 15,
    width: 30,
    height: 25,
    pollutants: { pm25: 150, pm10: 280, no2: 180, so2: 220 },
  },
  {
    id: 'east-residential',
    name: 'East Residential Area',
    level: 45,
    x: 65,
    y: 20,
    width: 30,
    height: 25,
    pollutants: { pm25: 65, pm10: 110, no2: 70, so2: 45 },
  },
  {
    id: 'south-commercial',
    name: 'South Commercial Zone',
    level: 60,
    x: 50,
    y: 65,
    width: 35,
    height: 25,
    pollutants: { pm25: 95, pm10: 165, no2: 120, so2: 85 },
  },
  {
    id: 'west-landfill',
    name: 'West Landfill Area',
    level: 75,
    x: 10,
    y: 60,
    width: 30,
    height: 25,
    pollutants: { pm25: 120, pm10: 220, no2: 140, so2: 160 },
  },
  {
    id: 'central-mixed',
    name: 'Central Mixed Zone',
    level: 55,
    x: 40,
    y: 40,
    width: 25,
    height: 20,
    pollutants: { pm25: 80, pm10: 140, no2: 100, so2: 70 },
  },
];

const getPollutionColor = (level: number): string => {
  if (level < 25) return '#10b981'; // Green
  if (level < 50) return '#eab308'; // Yellow
  if (level < 75) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

const getPollutionLabel = (level: number): string => {
  if (level < 25) return 'Good';
  if (level < 50) return 'Moderate';
  if (level < 75) return 'Poor';
  return 'Hazardous';
};

const getPollutionBgColor = (level: number): string => {
  if (level < 25) return 'from-green-100 to-green-50 border-green-200';
  if (level < 50) return 'from-yellow-100 to-yellow-50 border-yellow-200';
  if (level < 75) return 'from-orange-100 to-orange-50 border-orange-200';
  return 'from-red-100 to-red-50 border-red-200';
};

export const PollutionHeatmap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<PollutionZone | null>(POLLUTION_ZONES[0]);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-900">Pollution Heatmap</CardTitle>
        <CardDescription className="text-green-700">Real-time air quality monitoring across city zones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">City Pollution Map</h3>
              <svg
                viewBox="0 0 800 600"
                className="w-full border border-gray-300 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50"
                style={{ aspectRatio: '4/3' }}
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="80" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 60" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="800" height="600" fill="url(#grid)" />

                {/* Pollution zones */}
                {POLLUTION_ZONES.map(zone => (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={zone.x * 8}
                      y={zone.y * 6}
                      width={zone.width * 8}
                      height={zone.height * 6}
                      fill={getPollutionColor(zone.level)}
                      fillOpacity={hoveredZone === zone.id ? 0.8 : 0.6}
                      stroke={hoveredZone === zone.id ? '#000' : getPollutionColor(zone.level)}
                      strokeWidth={hoveredZone === zone.id ? 2 : 1}
                      rx="4"
                    />
                    <text
                      x={zone.x * 8 + (zone.width * 8) / 2}
                      y={zone.y * 6 + (zone.height * 6) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-white pointer-events-none"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                    >
                      {zone.level}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-xs text-gray-700">Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-xs text-gray-700">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-xs text-gray-700">Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-xs text-gray-700">Hazardous</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          {selectedZone && (
            <div className={`bg-gradient-to-br ${getPollutionBgColor(selectedZone.level)} rounded-lg p-5 border lg:col-span-1`}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{selectedZone.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getPollutionColor(selectedZone.level) }}
                    ></div>
                    <span className={`text-sm font-semibold ${
                      selectedZone.level < 25 ? 'text-green-800' :
                      selectedZone.level < 50 ? 'text-yellow-800' :
                      selectedZone.level < 75 ? 'text-orange-800' :
                      'text-red-800'
                    }`}>
                      {getPollutionLabel(selectedZone.level)} - AQI {selectedZone.level}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">PM 2.5 (µg/m³)</p>
                    <div className="bg-white rounded px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{selectedZone.pollutants.pm25}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">PM 10 (µg/m³)</p>
                    <div className="bg-white rounded px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{selectedZone.pollutants.pm10}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">NO₂ (ppb)</p>
                    <div className="bg-white rounded px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{selectedZone.pollutants.no2}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">SO₂ (ppb)</p>
                    <div className="bg-white rounded px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{selectedZone.pollutants.so2}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition border border-gray-300 text-sm">
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* All Zones Overview */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">All Zones - Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {POLLUTION_ZONES.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedZone?.id === zone.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-2 rounded mb-2"
                  style={{ backgroundColor: getPollutionColor(zone.level) }}
                ></div>
                <p className="text-xs font-medium text-gray-900 mb-1">{zone.name}</p>
                <p className={`text-sm font-bold ${
                  zone.level < 25 ? 'text-green-700' :
                  zone.level < 50 ? 'text-yellow-700' :
                  zone.level < 75 ? 'text-orange-700' :
                  'text-red-700'
                }`}>
                  {zone.level}
                </p>
                <p className="text-xs text-gray-500">{getPollutionLabel(zone.level)}</p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
