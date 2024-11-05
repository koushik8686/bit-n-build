import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios'; // Import axios

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdAnalyticsDashboard() {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [adData, setAdData] = useState(null); // State to store ad data
  const { id } = useParams(); // Get the ID from the URL

  // Fetch ad data from API
  useEffect(() => {
    const fetchAdData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/ads/${id}`);
        setAdData(response.data);
      } catch (error) {
        console.error("Error fetching ad data:", error);
      }
    };

    fetchAdData();
  }, [id]);

  if (!adData) return <div>Loading...</div>; // Show loading state while fetching data

  const clicksByUser = adData.clicks.reduce((acc, click) => {
    acc[click.clickedby] = (acc[click.clickedby] || 0) + 1;
    return acc;
  }, {});

  const clicksByUserData = Object.entries(clicksByUser).map(([name, count]) => ({ name, count }));

  // Assuming adData.clicks is an array of click objects with a `timestamp` property
const clickTimeline = adData.clicks.reduce((acc, click) => {
  const date = new Date(click.timestamp).toLocaleDateString();

  // Find if the date already exists in the accumulator
  const existingDate = acc.find(item => item.date === date);

  if (existingDate) {
    // If date exists, increment the clicks count
    existingDate.clicks += 1;
  } else {
    // Otherwise, add a new entry with 1 click
    acc.push({ date, clicks: 1 });
  }

  return acc;
}, []);

console.log(clickTimeline);
  const ctr = ((adData.noOfClicks / adData.impreessions) * 100).toFixed(2);

  const handleDownload = async () => {
    if (!dashboardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(dashboardRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = 'ad-analytics-report.png';
      link.click();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4" ref={dashboardRef}>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8 transform transition duration-500">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight border-b-4 border-blue-500 pb-2">{adData.adverCompanyName} Ad Analytics</h1>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300"
            aria-label="Download report"
          >
            {isDownloading ? 'Generating...' : 'Download Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[ 
            { label: 'Impressions', value: adData.impreessions, color: 'text-blue-600' },
            { label: 'Clicks', value: adData.noOfClicks, color: 'text-green-600' },
            { label: 'CTR', value: `${ctr}%`, color: 'text-purple-600' }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-blue-50 border-l-4 border-blue-400"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-700">{item.label}</h2>
              <p className={`text-5xl font-extrabold ${item.color}`}>{item.value}</p>
            </div>
          ))} 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-purple-50 transition transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Clicks by User</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clicksByUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Click Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clicksByUserData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {clicksByUserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-green-50 transition transform hover:scale-105 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Click Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clickTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:bg-yellow-50 transition transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ad Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Company', value: adData.adverCompanyName },
              { label: 'Contact', value: adData.email },
              { label: 'Phone', value: adData.phone },
              {
                label: 'Website',
                value: (
                  <a href={adData.companyLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {adData.companyLink}
                  </a>
                )
              }
            ].map((detail, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-600">{detail.label}:</p>
                <p>{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
