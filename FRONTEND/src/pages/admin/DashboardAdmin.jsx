import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import DashboardHeader from '../../components/dashboard/admin/DashboardHeader';
import StatsGrid from '../../components/dashboard/admin/StatsGrid';
import QuickActions from '../../components/dashboard/admin/QuickActions';
import PendingLoans from '../../components/dashboard/admin/PendingLoans';
import OverdueAlerts from '../../components/dashboard/admin/OverdueAlerts';
import AddBookModal from '../../components/dashboard/admin/AddBookModal';
import '../../styles/dashboardAdmin.css';
import { getAdminStats } from '../../services/stats.api';
import { getCategories } from '../../services/category.api';
import { getEmpruntsEnAttente, getEmpruntsEnRetard, getMesEmprunts } from '../../services/emprunts.api';


function DashboardAdmin() {
  const [isLoading,setIsLoading]=useState(true)
  const [showModal, setShowModal] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats,setStats]=useState({})
  const [categories,setCategories]=useState([])
  const [books,setBooks]=useState([])
  const [empruntsEnRetard,setEmpruntsEnRetard]=useState([])
  const [empruntsEnAttente,setEmpruntsEnAttente]=useState([])
  const [users,setUsers]=useState([])
  
  useEffect(()=> {
    async function getStats(){

      const stats=await getAdminStats();
      setStats(stats)
      setIsLoading(false)
    }
   getStats();

   async function loadCategories(){
    const categories=await getCategories();
    setCategories(categories)
    setIsLoading(false)
   }
   loadCategories();

   async function loadEmprunts(){
    const empruntsEnRetard=await getEmpruntsEnRetard();
    setEmpruntsEnRetard(empruntsEnRetard);
    const empruntsEnAttente=await getEmpruntsEnAttente();
    setEmpruntsEnAttente(empruntsEnAttente);
    setIsLoading(false)
   }
   loadEmprunts();
   

   
   
   

  },
    [])
    console.log("empruntsEnRetard",stats);
    console.log("empruntsEnAttente",empruntsEnAttente);
    

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
          {/* <BorrowChart /> */}
          {/* <ActivityTimeline /> */}
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