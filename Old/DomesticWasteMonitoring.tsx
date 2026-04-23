import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WaterQualityData {
  area: string;
  BOD: number;
  COD: number;
  TOC: number;
  date: string;
}

const WATER_QUALITY_DATA: WaterQualityData[] = [
  { area: 'North Zone', BOD: 120, COD: 250, TOC: 85, date: '2024-01-01' },
  { area: 'South Zone', BOD: 95, COD: 180, TOC: 62, date: '2024-01-01' },
  { area: 'East Zone', BOD: 150, COD: 310, TOC: 105, date: '2024-01-01' },
  { area: 'West Zone', BOD: 80, COD: 160, TOC: 55, date: '2024-01-01' },
  { area: 'Central Zone', BOD: 110, COD: 230, TOC: 78, date: '2024-01-01' },
];

const AREA_TIMELINE_DATA = {
  'North Zone': [
    { date: 'Jan 1', BOD: 120, COD: 250, TOC: 85 },
    { date: 'Jan 8', BOD: 125, COD: 260, TOC: 88 },
    { date: 'Jan 15', BOD: 118, COD: 245, TOC: 83 },
    { date: 'Jan 22', BOD: 130, COD: 270, TOC: 92 },
    { date: 'Jan 29', BOD: 115, COD: 240, TOC: 80 },
  ],
  'South Zone': [
    { date: 'Jan 1', BOD: 95, COD: 180, TOC: 62 },
    { date: 'Jan 8', BOD: 92, COD: 175, TOC: 60 },
    { date: 'Jan 15', BOD: 98, COD: 190, TOC: 65 },
    { date: 'Jan 22', BOD: 88, COD: 170, TOC: 58 },
    { date: 'Jan 29', BOD: 100, COD: 195, TOC: 67 },
  ],
};

export const DomesticWasteMonitoring: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState('North Zone');
  const timelineData = AREA_TIMELINE_DATA[selectedArea as keyof typeof AREA_TIMELINE_DATA];
  const areaData = WATER_QUALITY_DATA.find(d => d.area === selectedArea);

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-900">Domestic Waste Quality Monitor</CardTitle>
              <CardDescription className="text-blue-700">Real-time BOD, COD, and TOC measurements by area</CardDescription>
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-48 bg-white border-blue-300">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {WATER_QUALITY_DATA.map(item => (
                  <SelectItem key={item.area} value={item.area}>
                    {item.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">BOD (mg/L)</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{areaData?.BOD}</p>
              <p className="text-xs text-gray-500 mt-1">Biochemical Oxygen Demand</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-cyan-100 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">COD (mg/L)</p>
              <p className="text-3xl font-bold text-cyan-600 mt-2">{areaData?.COD}</p>
              <p className="text-xs text-gray-500 mt-1">Chemical Oxygen Demand</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-teal-100 shadow-sm">
              <p className="text-sm text-gray-600 font-medium">TOC (mg/L)</p>
              <p className="text-3xl font-bold text-teal-600 mt-2">{areaData?.TOC}</p>
              <p className="text-xs text-gray-500 mt-1">Total Organic Carbon</p>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Water Quality Trend - {selectedArea}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="BOD" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="COD" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="TOC" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Area Comparison */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Area Comparison - Current BOD Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={WATER_QUALITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="BOD" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
