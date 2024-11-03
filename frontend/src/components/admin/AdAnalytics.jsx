import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import { TrendingUp, Award, Target } from 'lucide-react';
import Loader from '../Loader';  // Assuming loader.jsx exports Loader as default
import NavBar from './Adnavbar';  // The NavBar component created separately
import SingleAdAnalytics from './SingleAdAnalytics';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

const AllAdsAnalytics = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [view, setView] = useState('allAds'); // Track which view to show

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4000/ads/getads')
      .then(response => setAds(response.data))
      .catch(error => console.error("Error fetching ads:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;  // Display loader while data is loading
  }

  const totalClicks = ads.reduce((sum, ad) => sum + ad.noOfClicks, 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impreessions, 0);
  const averageCTR = (totalClicks / (totalImpressions || 1)) * 100;

  const performanceData = ads.map(ad => ({
    name: ad.adverCompanyName,
    impressions: ad.impreessions,
    clicks: ad.noOfClicks,
    ctr: ((ad.noOfClicks / (ad.impreessions || 1)) * 100).toFixed(1),
  }));

  const marketShareData = ads.map(ad => ({
    name: ad.adverCompanyName,
    value: ad.noOfClicks,
  }));

  return (
    <div>
      <NavBar onSelect={setView} />
      {view === 'allAds' && (

     <div className="glass-effect rounded-xl shadow-lg p-6 space-y-8 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Overall Advertising Performance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <TrendingUp className="text-blue-600" />, label: 'Total Clicks', value: totalClicks, color: 'blue' },
          { icon: <Target className="text-purple-600" />, label: 'Total Impressions', value: totalImpressions, color: 'purple' },
          { icon: <Award className="text-pink-600" />, label: 'Average CTR', value: `${averageCTR.toFixed(1)}%`, color: 'pink' }
        ].map((metric) => (
          <div 
            key={metric.label}
            className={`bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center gap-3">
              {metric.icon}
              <span className={`text-${metric.color}-600 font-semibold`}>{metric.label}</span>
            </div>
            <p className="text-3xl font-bold mt-2">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">CTR Performance (Line Chart)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ctr" 
                stroke="#3B82F6" 
                name="CTR (%)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Market Share (by Clicks)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                dataKey="value"
              >
                {marketShareData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Detailed Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Clicks</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Impressions</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CTR (%)</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((ad) => (
                <tr key={ad.name} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-sm text-gray-700">{ad.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ad.clicks}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ad.impressions}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{ad.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
)}
 {view === 'singleAd' && (
          <div className='m-4'>
           <SingleAdAnalytics/>
          </div>
        )}
    </div>
  );
};

export default AllAdsAnalytics;
