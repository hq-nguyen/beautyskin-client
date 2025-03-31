import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import { getRevenueOfMonthByYear } from '../../../apis/dashboard';

const YearlyRevenueChart = () => {
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([2023, 2024, 2025]);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchYearlyRevenue = async () => {
      setLoading(true);
      try {
        const response = await getRevenueOfMonthByYear(selectedYear);
        if (response && response.data && response.data.length > 0) {
          setYearlyRevenue(response.data);
          setHasData(true);
        } else {
          setYearlyRevenue([]);
          setHasData(false);
        }
      } catch (error) {
        console.error("Error fetching yearly revenue:", error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyRevenue();
  }, [selectedYear]);

  const getMonthName = (monthNum) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1];
  };

  // Format monthly revenue data for chart
  const formattedRevenueData = yearlyRevenue.map(item => ({
    month: getMonthName(item.month),
    monthNum: item.month,
    revenue: item.totalRevenue
  })).sort((a, b) => a.monthNum - b.monthNum);

  // Calculate growth rate between months
  const calculateGrowthRate = (current, previous) => {
    if (!previous || previous === 0) return null;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Doanh thu theo tháng - Năm {selectedYear}</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="yearSelect" className="text-sm font-medium text-gray-600">Chọn năm:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <div className="text-lg font-medium text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : !hasData ? (
        <div className="h-72 flex items-center justify-center">
          <div className="text-lg font-medium text-gray-500">Không có dữ liệu về năm này</div>
        </div>
      ) : (
        <>
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                  labelFormatter={(label) => `Tháng ${label}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  name="Doanh thu"
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Tháng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">% Tăng trưởng</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formattedRevenueData.map((item, index, array) => {
                  const prevMonth = index > 0 ? array[index - 1].revenue : null;
                  const growthRate = calculateGrowthRate(item.revenue, prevMonth);
                  
                  return (
                    <tr key={`${item.month}-${selectedYear}`} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Tháng {item.monthNum}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {growthRate !== null ? (
                          <div className="flex items-center">
                            {parseFloat(growthRate) > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : parseFloat(growthRate) < 0 ? (
                              <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                            ) : null}
                            <span className={`text-sm font-medium ${
                              parseFloat(growthRate) > 0 ? 'text-green-500' : 
                              parseFloat(growthRate) < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {parseFloat(growthRate) > 0 ? '+' : ''}{growthRate}%
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">-</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default YearlyRevenueChart;