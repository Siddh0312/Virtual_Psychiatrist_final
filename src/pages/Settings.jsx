import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    fontSize: 'medium',
    automaticSave: true,
    azureConnectionString: '',
    azureContainerName: 'psychiatrist-conversations'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    // Simulate saving with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after a delay
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <FiArrowLeft className="mr-2" /> Back to conversations
          </Link>
          
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <form onSubmit={handleSave}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Interface Settings</h2>
              
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Enable notifications</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Dark mode</span>
                </label>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <select
                  name="fontSize"
                  value={settings.fontSize}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Azure Storage Settings</h2>
              
              <Input
                label="Azure Storage Connection String"
                id="azureConnectionString"
                name="azureConnectionString"
                type="password"
                value={settings.azureConnectionString}
                onChange={handleChange}
                placeholder="Enter your Azure Storage connection string"
                fullWidth
              />
              
              <Input
                label="Azure Container Name"
                id="azureContainerName"
                name="azureContainerName"
                value={settings.azureContainerName}
                onChange={handleChange}
                placeholder="Enter your Azure container name"
                fullWidth
              />
              
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="automaticSave"
                    checked={settings.automaticSave}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Automatically save conversations</span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
              
              {saveSuccess && (
                <span className="ml-4 text-green-600">Settings saved successfully!</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;