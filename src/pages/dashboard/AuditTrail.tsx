import React, { useState, useEffect } from 'react';
import {
  Shield, Search, Filter, Eye, Calendar, User, Activity, Database
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select, SelectOption } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { phpApi, type AuditLog } from '../../lib/phpApi';
import { formatDateTime } from '../../lib/utils';

export const AuditTrail: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    user_name: '',
    action: '',
    table_name: '',
    start_date: '',
    end_date: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const actionOptions: SelectOption[] = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' }
  ];

  const tableOptions: SelectOption[] = [
    { value: '', label: 'All Tables' },
    { value: 'users', label: 'Users' },
    { value: 'orders', label: 'Orders' },
    { value: 'materials', label: 'Materials' },
    { value: 'payments', label: 'Payments' }
  ];

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const response = await phpApi.getAuditLogs(filters);
      if (response.success) {
        setAuditLogs(response.logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchAuditLogs();
  };

  const clearFilters = () => {
    setFilters({
      user_name: '',
      action: '',
      table_name: '',
      start_date: '',
      end_date: ''
    });
    setTimeout(() => fetchAuditLogs(), 100);
  };

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'warning';
      case 'DELETE':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return '➕';
      case 'UPDATE':
        return '✏️';
      case 'DELETE':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const formatJsonData = (data: any) => {
    if (!data) return 'N/A';
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">System Activity Monitor</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                placeholder="Search by user name..."
                className="pl-10"
                value={filters.user_name}
                onChange={(e) => handleFilterChange('user_name', e.target.value)}
                fullWidth
              />
            </div>

            <Select
              options={actionOptions}
              value={filters.action}
              onChange={(value) => handleFilterChange('action', value)}
              placeholder="Filter by action"
              fullWidth
            />

            <Select
              options={tableOptions}
              value={filters.table_name}
              onChange={(value) => handleFilterChange('table_name', value)}
              placeholder="Filter by table"
              fullWidth
            />

            <Input
              label="Start Date"
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              fullWidth
            />

            <Input
              label="End Date"
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSearch}
              leftIcon={<Search size={16} />}
              isLoading={isLoading}
            >
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center">
        <Activity className="h-5 w-5 mr-2" />
        System Activity Log
      </div>
      <Badge variant="outline">{auditLogs.length} records</Badge>
    </CardTitle>
  </CardHeader>

  <CardContent>
    {isLoading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading audit logs...</p>
      </div>
    ) : auditLogs.length > 0 ? (
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedLog(log)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
              {/* Left Section: Icon + Action Info */}
              <div className="flex items-start md:items-center space-x-3">
                <span className="text-lg mt-0.5">{getActionIcon(log.action)}</span>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={getActionVariant(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      {log.table_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {log.user_name} ({log.user_email})
                  </p>
                </div>
              </div>

              {/* Right Section: Date + IP */}
              <div className="text-right md:text-left">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateTime(log.created_at)}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  IP: {log.ip_address}
                </p>
              </div>
            </div>

            {/* Footer Section: Record ID + User Agent */}
            <div className="text-sm text-gray-600 mt-2">
              <p>
                Record ID:{' '}
                <span className="font-mono">
                  {log.record_id || 'N/A'}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                User Agent: {log.user_agent}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Audit Logs Found
        </h3>
        <p className="text-gray-500">
          {Object.values(filters).some(f => f)
            ? 'Try adjusting your search or filter criteria.'
            : 'System activity will appear here as users interact with the system.'}
        </p>
      </div>
    )}
  </CardContent>
</Card>

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Audit Log Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Action Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge variant={getActionVariant(selectedLog.action)} className="mr-2">
                        {selectedLog.action}
                      </Badge>
                      <span className="text-sm text-gray-600">on table</span>
                      <Badge variant="outline" className="ml-2">
                        {selectedLog.table_name}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Record ID: <span className="font-mono">{selectedLog.record_id || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedLog.user_name}</p>
                    <p><strong>Email:</strong> {selectedLog.user_email}</p>
                    <p><strong>Timestamp:</strong> {formatDateTime(selectedLog.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">System Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>IP Address:</strong> {selectedLog.ip_address}</p>
                    <p><strong>User Agent:</strong></p>
                    <p className="text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">
                      {selectedLog.user_agent}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Data Changes</h4>
                  {selectedLog.old_values && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Old Values:</p>
                      <pre className="bg-red-50 border border-red-200 p-3 rounded text-xs overflow-x-auto">
                        {formatJsonData(selectedLog.old_values)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.new_values && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">New Values:</p>
                      <pre className="bg-green-50 border border-green-200 p-3 rounded text-xs overflow-x-auto">
                        {formatJsonData(selectedLog.new_values)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
