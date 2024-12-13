import React from 'react';
import { Bell } from 'lucide-react';

const AlertsWidget = ({ alerts }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[rgb(88,28,135)]">Alerts</h3>
      <div className="space-y-4">
        {alerts?.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Bell className="text-[rgb(88,28,135)] mt-1 mr-3 flex-shrink-0" size={16} />
              <div>
                <p className="font-semibold text-[rgb(88,28,135)]">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-gray-50 p-6 rounded-lg">
            <Bell className="mx-auto text-[rgb(88,28,135)] mb-2" size={24} />
            <p className="text-gray-500">No alerts at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsWidget; 