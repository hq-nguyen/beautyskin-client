import { useState, useEffect } from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { getDashboardSummary, getRevenueByMonth } from '../../../apis/dashboard';
import { formatCurrency } from '../../../utils/format';
import YearlyRevenueChart from './YearlyRevenueChart'; 

const DashboardMain = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard summary data
        const summaryResponse = await getDashboardSummary();
        setSummary(summaryResponse.data);
        
        // Fetch monthly revenue data
        const revenueResponse = await getRevenueByMonth();
        setMonthlyRevenue(revenueResponse.data);
        
        console.log("Dashboard data:", summaryResponse.data.topProductsThisMonth);
        console.log("Revenue data:", revenueResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const shortenProductName = (name) => {
    if (name.length > 25) {
      return name.substring(0, 25) + '...';
    }
    return name;
  };

  const getMonthName = (monthNum) => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    return months[monthNum - 1];
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  // Prepare data for the products chart
  const productChartData = summary?.topProductsThisMonth.map(product => ({
    name: shortenProductName(product.productName),
    sales: product.totalSold
  }));

  // Format monthly revenue data for chart
  const monthlyRevenueData = monthlyRevenue.map(item => ({
    month: getMonthName(item.month),
    year: item.year,
    revenue: item.totalRevenue
  })).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const monthIndex1 = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'].indexOf(a.month);
    const monthIndex2 = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'].indexOf(b.month);
    return monthIndex1 - monthIndex2;
  });

  // Calculate growth rate between months
  const calculateGrowthRate = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng doanh thu</p>
                <p className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(summary?.revenue)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng số sản phẩm</p>
                <p className="text-2xl font-bold mt-2 text-gray-800">{summary?.products}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold mt-2 text-gray-800">{summary?.completedOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Số khách hàng đã mua</p>
                <p className="text-2xl font-bold mt-2 text-gray-800">{summary.customersWithOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Doanh thu theo tháng</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    labelFormatter={(label) => `${label}`}
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
          </div>
          
          {/* Top Products */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 5 sản phẩm bán chạy trong tháng {new Date().getMonth() + 1}</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} sản phẩm`, "Số lượng"]}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#8b5cf6" 
                    radius={[0, 4, 4, 0]}
                    name="Số lượng bán ra" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chi tiết sản phẩm bán chạy trong tháng {new Date().getMonth() + 1}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Thứ hạng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Số lượng</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary?.topProductsThisMonth.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                            index === 1 ? 'bg-gray-100 text-gray-600' : 
                            index === 2 ? 'bg-amber-100 text-amber-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.totalSold} sản phẩm</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Top Customers Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top khách hàng trong tháng {new Date().getMonth() + 1}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Thứ hạng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary?.topCustomers.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                            index === 1 ? 'bg-gray-100 text-gray-600' : 
                            index === 2 ? 'bg-amber-100 text-amber-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <YearlyRevenueChart />

      </div>
    </div>
  );
};

export default DashboardMain;