'use client'

import { useState } from 'react'
import DashboardClient from './DashboardClient'
import RoleManager from './RoleManager'
import ScheduleManager from './ScheduleManager'

const tabs = [
  { id: 'users', label: 'Pengguna' },
  { id: 'imams', label: 'Imam' },
  { id: 'schedules', label: 'Jadwal' },
]

export default function AdminDashboard({ users, imams, schedules, scheduleError, query }) {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="admin-tabs" style={{
        background: '#f3f4f6',
        borderRadius: '999px',
        padding: '0.3rem',
        display: 'flex',
        gap: '0.3rem',
        marginBottom: '1.25rem',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '999px',
              padding: '0.5rem 0.9rem',
              cursor: 'pointer',
              background: activeTab === tab.id ? '#059669' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#374151',
              fontWeight: '700',
              fontSize: '0.85rem',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && <RoleManager users={users} />}
      {activeTab === 'imams' && <DashboardClient imams={imams} query={query} />}
      {activeTab === 'schedules' && (
        <ScheduleManager
          imams={imams}
          schedules={schedules}
          scheduleError={scheduleError}
        />
      )}
    </div>
  )
}