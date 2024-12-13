import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import axios from 'axios';

const ReportGenerator = ({ portfolio, watchlist, activities }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('portfolio'); // portfolio, watchlist, complete

  const generatePDF = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/dashboard/report/generate?type=${reportType}`,
        {
          headers: { 
            Authorization: token,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-[rgb(88,28,135)] mb-6">Generate Reports</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="portfolio">Portfolio Report</option>
            <option value="watchlist">Watchlist Report</option>
            <option value="complete">Complete Analysis</option>
          </select>
          
          <button
            onClick={generatePDF}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={20} />
            ) : (
              <Download className="mr-2" size={20} />
            )}
            Generate Report
          </button>
        </div>

        {/* Report Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-[rgb(88,28,135)] mb-2">Report will include:</h4>
          {reportType === 'portfolio' && (
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Portfolio Performance Analysis
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Holdings Breakdown
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Risk Assessment
              </li>
            </ul>
          )}
          {reportType === 'watchlist' && (
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Watchlist Items Analysis
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Price Movements
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Technical Indicators
              </li>
            </ul>
          )}
          {reportType === 'complete' && (
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Complete Portfolio Analysis
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Watchlist Performance
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Market Analysis
              </li>
              <li className="flex items-center">
                <FileText className="mr-2" size={16} />
                Investment Recommendations
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator; 