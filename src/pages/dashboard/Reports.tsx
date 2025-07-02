import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, Users, ShoppingBag, CreditCard, BarChart3, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, SelectOption } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency, formatDate } from '../../lib/utils';

interface SalesReport {
  id: string;
  report_type: 'daily' | 'weekly' | 'monthly';
  start_date: string;
  end_date: string;
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  popular_materials: any[];
  payment_methods_breakdown: Record<string, number>;
  top_templates: any[];
  created_at: string;
}

export const Reports: React.FC = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypeOptions: SelectOption[] = [
    { value: 'daily', label: 'Daily Report' },
    { value: 'weekly', label: 'Weekly Report' },
    { value: 'monthly', label: 'Monthly Report' }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    setIsGenerating(true);
    try {
      // Fetch orders data for the date range
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users(*),
          material:materials(*),
          payments(*)
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate + 'T23:59:59');

      if (ordersError) throw ordersError;

      // Calculate report metrics
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_price, 0) || 0;
      const uniqueCustomers = new Set(orders?.map(order => order.customer_id)).size;

      // Popular materials
      const materialCounts: Record<string, number> = {};
      orders?.forEach(order => {
        const materialName = order.material?.name || 'Unknown';
        materialCounts[materialName] = (materialCounts[materialName] || 0) + 1;
      });

      const popularMaterials = Object.entries(materialCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Payment methods breakdown
      const paymentBreakdown: Record<string, number> = {};
      orders?.forEach(order => {
        const method = order.payment_method || 'Not Specified';
        paymentBreakdown[method] = (paymentBreakdown[method] || 0) + 1;
      });

      // Save report to database
      const { data: newReport, error: reportError } = await supabase
        .from('sales_reports')
        .insert([
          {
            report_type: reportType,
            start_date: startDate,
            end_date: endDate,
            total_orders: totalOrders,
            total_revenue: totalRevenue,
            total_customers: uniqueCustomers,
            popular_materials: popularMaterials,
            payment_methods_breakdown: paymentBreakdown,
            generated_by: user?.id
          }
        ])
        .select()
        .single();

      if (reportError) throw reportError;

      // Refresh reports list
      await fetchReports();
      
      // Reset form
      setStartDate('');
      setEndDate('');
      
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (report: SalesReport) => {
    const reportData = {
      'Report Type': report.report_type.toUpperCase(),
      'Period': `${formatDate(report.start_date)} - ${formatDate(report.end_date)}`,
      'Total Orders': report.total_orders,
      'Total Revenue': formatCurrency(report.total_revenue),
      'Total Customers': report.total_customers,
      'Popular Materials': report.popular_materials,
      'Payment Methods': report.payment_methods_breakdown,
      'Generated': formatDate(report.created_at)
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-report-${report.report_type}-${report.start_date}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
      </div>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Report Type"
              options={reportTypeOptions}
              value={reportType}
              onChange={(value) => setReportType(value as 'daily' | 'weekly' | 'monthly')}
              fullWidth
            />
            
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
            
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
            
            <div className="flex items-end">
              <Button
                onClick={generateReport}
                isLoading={isGenerating}
                leftIcon={<TrendingUp size={18} />}
                fullWidth
              >
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reports...</p>
              </div>
            </CardContent>
          </Card>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} Report
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download size={16} />}
                    onClick={() => downloadReport(report)}
                  >
                    Download
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(report.start_date)} - {formatDate(report.end_date)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <h3 className="text-2xl font-bold text-gray-900">{report.total_orders}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(report.total_revenue)}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-700 mr-4">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customers</p>
                      <h3 className="text-2xl font-bold text-gray-900">{report.total_customers}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-orange-100 text-orange-700 mr-4">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {report.total_orders > 0 ? formatCurrency(report.total_revenue / report.total_orders) : '₱0'}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Popular Materials */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Popular Materials</h4>
                    <div className="space-y-2">
                      {report.popular_materials.slice(0, 5).map((material: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{material.name}</span>
                          <span className="text-sm font-medium text-gray-900">{material.count} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
                    <div className="space-y-2">
                      {Object.entries(report.payment_methods_breakdown).map(([method, count]) => (
                        <div key={method} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{method}</span>
                          <span className="text-sm font-medium text-gray-900">{count} orders</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Generated</h3>
                <p className="text-gray-500">Generate your first sales report to see analytics here.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};