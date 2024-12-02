"use client"

import React, { useState } from 'react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="settings-page bg-white shadow rounded-lg p-4 max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="tabs flex justify-between mb-8">
        <button className={`tab ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>Account</button>
        <button className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
        <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Security</button>
      </div>
      <div className="tab-content">
        {activeTab === 'account' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                <input type="text" id="username" name="username" placeholder="Your new username" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input type="email" id="email" name="email" placeholder="Your new email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
            </form>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="darkMode" className="block text-sm font-medium text-gray-700">Dark Mode:</label>
                <input type="checkbox" id="darkMode" name="darkMode" className="mt-1 block w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">Notifications:</label>
                <input type="checkbox" id="notifications" name="notifications" className="mt-1 block w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
            </form>
          </div>
        )}
        {activeTab === 'security' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                <input type="password" id="password" name="password" placeholder="Your new password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your new password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings