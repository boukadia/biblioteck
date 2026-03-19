import React, { useEffect, useState } from 'react';
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
import { getAdminStats } from '../../services/stats.api';


function DashboardAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats,setStats]=useState({})
  useEffect(()=> {
    async function getStats(){
      const stats=await getAdminStats();
      setStats(stats)
    
    }

   getStats()
   

  },
    [])
     console.log('====================================');
      console.log('statsds',stats);
      console.log('====================================');

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
        <StatsGrid stats={stats} />
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