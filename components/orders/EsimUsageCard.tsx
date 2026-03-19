'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { Wifi, Clock, AlertTriangle, RefreshCw, Zap } from 'lucide-react';

interface EsimUsage {
  iccid: string;
  totalMB: number;
  usedMB: number;
  remainingMB: number;
  usedPercent: number;
  expiryDate: string;
  daysLeft: number;
  lowData: boolean;
  expiringSoon: boolean;
}

interface EsimUsageCardProps {
  iccid: string;
  onTopup?: () => void;
}

export default function EsimUsageCard({ iccid, onTopup }: EsimUsageCardProps) {
  const { t } = useI18n();
  const [usage, setUsage] = useState<EsimUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/esim/usage?iccid=${iccid}`);
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || '获取失败');
      }
      
      setUsage(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [iccid]);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">{t('usage.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">流量数据暂不可用</p>
        <button
          onClick={fetchUsage}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          点击刷新
        </button>
      </div>
    );
  }

  const formatData = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb} MB`;
  };

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{t('usage.title')}</h3>
        <button
          onClick={fetchUsage}
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
          title={t('usage.refresh')}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">{t('usage.percent').replace('{percent}', usage.usedPercent.toFixed(1))}</span>
          {usage.lowData && (
            <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              {t('usage.low_data')}
            </span>
          )}
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              usage.usedPercent > 90 ? 'bg-red-500' :
              usage.usedPercent > 70 ? 'bg-orange-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${usage.usedPercent}%` }}
          />
        </div>
      </div>

      {/* 流量详情 */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 bg-white rounded-lg">
          <Wifi className="w-4 h-4 mx-auto mb-1 text-blue-600" />
          <p className="text-xs text-gray-500">{t('usage.total')}</p>
          <p className="text-sm font-semibold text-gray-900">{formatData(usage.totalMB)}</p>
        </div>
        <div className="text-center p-2 bg-white rounded-lg">
          <Zap className="w-4 h-4 mx-auto mb-1 text-orange-600" />
          <p className="text-xs text-gray-500">{t('usage.used')}</p>
          <p className="text-sm font-semibold text-gray-900">{formatData(usage.usedMB)}</p>
        </div>
        <div className="text-center p-2 bg-white rounded-lg">
          <Wifi className="w-4 h-4 mx-auto mb-1 text-green-600" />
          <p className="text-xs text-gray-500">{t('usage.remaining')}</p>
          <p className="text-sm font-semibold text-gray-900">{formatData(usage.remainingMB)}</p>
        </div>
      </div>

      {/* 有效期 */}
      <div className="flex items-center justify-between text-sm p-2 bg-white rounded-lg">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{t('usage.days_left').replace('{days}', usage.daysLeft.toString())}</span>
        </div>
        {usage.expiringSoon && (
          <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
            <AlertTriangle className="w-3 h-3" />
            {t('usage.expiring_soon')}
          </span>
        )}
      </div>

      {/* 续费按钮 */}
      {onTopup && (
        <button
          onClick={onTopup}
          className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('usage.topup')}
        </button>
      )}
    </div>
  );
}
