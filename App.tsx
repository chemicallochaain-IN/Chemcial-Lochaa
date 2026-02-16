import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import MenuSection from './components/MenuSection';
import OrderOnline from './components/OrderOnline';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Franchise from './components/Franchise';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundDoodles from './components/BackgroundDoodles';
import LoginPage from './components/LoginPage';
import MyLab from './components/MyLab';
import AdminDashboard from './components/AdminDashboard';
import { User } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'mylab' | 'admin' | 'adminLogin'>('home');
  const [user, setUser] = useState<User | null>(null);

  // Initialize Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      }
    });

    // Listen for changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setCurrentView('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Effect to redirect based on user role after profile is fetched
  useEffect(() => {
    if (user) {
      if (currentView === 'login' || currentView === 'adminLogin') {
        if (user.isAdmin) {
          setCurrentView('admin');
        } else {
          setCurrentView('mylab');
        }
      }
    }
  }, [user]);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const userData: User = {
          id: userId,
          name: data.name || 'Lab Partner',
          email: email,
          loyaltyPoints: data.loyalty_points || 0,
          phone: data.phone,
          address: data.address,
          avatar: data.avatar_url,
          isAdmin: data.is_admin
        };
        setUser(userData);
      } else {
        // Fallback if profile doesn't exist yet
        setUser({
          id: userId,
          name: 'Lab Partner',
          email: email,
          loyaltyPoints: 0,
          isAdmin: false
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-graph-paper font-sans text-brand-teal relative selection:bg-brand-yellow selection:text-brand-teal">
      <BackgroundDoodles />
      
      {/* Order Overlay */}
      <OrderOnline isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      <div className="relative z-10">
        <Navbar 
          onOpenOrder={() => setIsOrderOpen(true)} 
          onNavigate={setCurrentView}
          currentView={currentView}
          user={user}
        />
        
        {currentView === 'home' && (
          <>
            <Hero />
            <About />
            <Services />
            <MenuSection />
            <Gallery />
            <Franchise />
            <Blog />
            <Contact />
          </>
        )}

        {currentView === 'login' && (
          <LoginPage onLogin={() => {}} />
        )}

        {currentView === 'adminLogin' && (
          <LoginPage onLogin={() => {}} isAdminLogin={true} />
        )}

        {currentView === 'mylab' && user && (
          <MyLab 
            user={user} 
            onLogout={handleLogout} 
            onOpenOrder={() => setIsOrderOpen(true)}
          />
        )}

        {currentView === 'admin' && user && user.isAdmin && (
          <AdminDashboard user={user} />
        )}

        {/* Hide footer on Admin Dashboard for max screen real estate, show elsewhere */}
        {currentView !== 'admin' && (
          <Footer onNavigate={setCurrentView} />
        )}
      </div>
    </div>
  );
}

export default App;