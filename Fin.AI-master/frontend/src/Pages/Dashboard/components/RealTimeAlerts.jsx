import React, { useState } from 'react';
import { Bell, Plus, X, Settings } from 'lucide-react';

const RealTimeAlerts = ({ alerts, onAddAlert, onDeleteAlert }) => {
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    type: 'PRICE',  // PRICE, VOLUME, NEWS
    condition: 'ABOVE', // ABOVE, BELOW
    value: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAlert(newAlert);
    setNewAlert({ symbol: '', type: 'PRICE', condition: 'ABOVE', value: '' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[rgb(88,28,135)]">Real-Time Alerts</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-full hover:opacity-90"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Alert Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[rgb(88,28,135)]">Add New Alert</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Symbol</label>
                <input
                  type="text"
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alert Type</label>
                <select
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="PRICE">Price Alert</option>
                  <option value="VOLUME">Volume Alert</option>
                  <option value="NEWS">News Alert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Condition</label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="ABOVE">Above</option>
                  <option value="BELOW">Below</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Value</label>
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90"
              >
                Add Alert
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Bell className={`mr-3 ${alert.active ? 'text-green-500' : 'text-gray-400'}`} size={20} />
              <div>
                <p className="font-semibold text-[rgb(88,28,135)]">{alert.symbol}</p>
                <p className="text-sm text-gray-600">
                  {alert.type} {alert.condition} {alert.value}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onDeleteAlert(alert.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeAlerts; 