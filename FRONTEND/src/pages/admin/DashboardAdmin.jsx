import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import DashboardHeader from '../../components/dashboard/admin/DashboardHeader';
import StatsGrid from '../../components/dashboard/admin/StatsGrid';
import QuickActions from '../../components/dashboard/admin/QuickActions';
import PendingLoans from '../../components/dashboard/admin/PendingLoans';
import OverdueAlerts from '../../components/dashboard/admin/OverdueAlerts';
import BorrowChart from '../../components/dashboard/admin/BorrowChart';
import ActivityTimeline from '../../components/dashboard/admin/ActivityTimeline';
import AddBookModal from '../../components/dashboard/admin/AddBookModal';
import '../../styles/dashboardAdmin.css';

function DashboardAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-wrapper">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <DashboardHeader
          onAddBook={() => setShowModal(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <StatsGrid />
        <QuickActions onAddBook={() => setShowModal(true)} />

        <div className="dashboard-grid">
          <PendingLoans />
          <OverdueAlerts />
          <BorrowChart />
          <ActivityTimeline />
        </div>
      </main>

      <AddBookModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default DashboardAdmin;