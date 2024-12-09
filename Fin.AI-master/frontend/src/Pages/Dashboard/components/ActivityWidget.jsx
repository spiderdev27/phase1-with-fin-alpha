import React from 'react';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ActivityWidget = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'PURCHASE':
        return <ArrowUpRight className="text-green-500" size={16} />;
      case 'SALE':
        return <ArrowDownRight className="text-red-500" size={16} />;
      default:
        return <Activity className="text-[rgb(88,28,135)]" size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'PURCHASE':
        return 'text-green-500';
      case 'SALE':
        return 'text-red-500';
      default:
        return 'text-[rgb(88,28,135)]';
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[rgb(88,28,135)]">Recent Activity</h3>
      <div className="space-y-4">
        {activities?.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="mt-1 mr-3 flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center bg-gray-50 p-6 rounded-lg">
            <Activity className="mx-auto text-[rgb(88,28,135)] mb-2" size={24} />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityWidget; 