import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IndustryWaste {
  name: string;
  percentage: number;
  tons: number;
}

const SOLID_WASTE_INDUSTRIES: IndustryWaste[] = [
  { name: 'Construction', percentage: 35, tons: 1500 },
  { name: 'Mining', percentage: 25, tons: 1200 },
  { name: 'Manufacturing', percentage: 20, tons: 950 },
  { name: 'Food Processing', percentage: 12, tons: 580 },
  { name: 'Others', percentage: 8, tons: 380 },
];

const LIQUID_WASTE_INDUSTRIES: IndustryWaste[] = [
  { name: 'Chemical Plants', percentage: 40, tons: 8000 },
  { name: 'Textile Mills', percentage: 28, tons: 5600 },
  { name: 'Paper Mills', percentage: 18, tons: 3600 },
  { name: 'Food Industries', percentage: 10, tons: 2000 },
  { name: 'Others', percentage: 4, tons: 800 },
];

const AIR_WASTE_INDUSTRIES: IndustryWaste[] = [
  { name: 'Power Plants', percentage: 45, tons: 4500 },
  { name: 'Steel Industry', percentage: 30, tons: 3000 },
  { name: 'Cement Plants', percentage: 18, tons: 1800 },
  { name: 'Chemical Plants', percentage: 5, tons: 500 },
  { name: 'Others', percentage: 2, tons: 200 },
];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface WasteMetricsProps {
  data: IndustryWaste[];
  title: string;
  unit: string;
  color: string;
}

const WasteMetrics: React.FC<WasteMetricsProps> = ({ data, title, unit, color }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Industry Breakdown</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={80}
              fill={color}
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Tonnage Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="tons" fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Detailed Table */}
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-4">Detailed Breakdown</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Industry</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Percentage</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Tonnage ({unit})</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-right text-gray-700">{item.percentage}%</td>
                <td className="px-4 py-3 text-right text-gray-700">{item.tons.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.percentage > 30 ? 'bg-red-100 text-red-800' :
                    item.percentage > 15 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.percentage > 30 ? 'High' : item.percentage > 15 ? 'Medium' : 'Low'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const IndustrialWasteMonitoring: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-900">Industrial Waste Management</CardTitle>
        <CardDescription className="text-orange-700">Monitoring solid, liquid, and air emissions by industry</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="solid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger value="solid" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                Solid Waste
              </span>
            </TabsTrigger>
            <TabsTrigger value="liquid" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Liquid Waste
              </span>
            </TabsTrigger>
            <TabsTrigger value="air" className="data-[state=active]:bg-white">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                Air Emissions
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solid" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-gray-600 font-medium">Total Solid Waste</p>
                <p className="text-3xl font-bold text-amber-700 mt-2">4,610</p>
                <p className="text-xs text-gray-600 mt-1">Metric Tons/Month</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600 font-medium">High Risk Industries</p>
                <p className="text-3xl font-bold text-red-700 mt-2">2</p>
                <p className="text-xs text-gray-600 mt-1">Requiring intervention</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 font-medium">Compliance Rate</p>
                <p className="text-3xl font-bold text-green-700 mt-2">68%</p>
                <p className="text-xs text-gray-600 mt-1">Industries compliant</p>
              </div>
            </div>
            <WasteMetrics data={SOLID_WASTE_INDUSTRIES} title="Solid Waste" unit="MT" color="#f59e0b" />
          </TabsContent>

          <TabsContent value="liquid" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 font-medium">Total Liquid Waste</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">19,800</p>
                <p className="text-xs text-gray-600 mt-1">Cubic Meters/Month</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600 font-medium">Critical Pollutants</p>
                <p className="text-3xl font-bold text-red-700 mt-2">5</p>
                <p className="text-xs text-gray-600 mt-1">Detected substances</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-gray-600 font-medium">Treatment Rate</p>
                <p className="text-3xl font-bold text-yellow-700 mt-2">72%</p>
                <p className="text-xs text-gray-600 mt-1">Treated before discharge</p>
              </div>
            </div>
            <WasteMetrics data={LIQUID_WASTE_INDUSTRIES} title="Liquid Waste" unit="M³" color="#3b82f6" />
          </TabsContent>

          <TabsContent value="air" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Total Air Emissions</p>
                <p className="text-3xl font-bold text-gray-700 mt-2">10,000</p>
                <p className="text-xs text-gray-600 mt-1">Metric Tons CO₂ Eq./Month</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-600 font-medium">Hazardous Emissions</p>
                <p className="text-3xl font-bold text-red-700 mt-2">8</p>
                <p className="text-xs text-gray-600 mt-1">Sources detected</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 font-medium">Reduction Target</p>
                <p className="text-3xl font-bold text-green-700 mt-2">15%</p>
                <p className="text-xs text-gray-600 mt-1">Year-on-year goal</p>
              </div>
            </div>
            <WasteMetrics data={AIR_WASTE_INDUSTRIES} title="Air Emissions" unit="MT CO₂" color="#6b7280" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
