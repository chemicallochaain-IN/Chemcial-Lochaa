import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
// import MenuSection from './components/MenuSection'; // [DISABLED] Replaced by Offerings
import OurOfferings from './components/OurOfferings';
// import OrderOnline from './components/OrderOnline'; // [DISABLED] Online ordering turned off
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Franchise from './components/Franchise';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundDoodles from './components/BackgroundDoodles';
import LoginPage from './components/LoginPage';
import MyLab from './components/MyLab';
// import RegisterPage from './components/RegisterPage'; // [DISABLED] Self-registration turned off
import AdminDashboard from './components/AdminDashboard';
import FeedbackSection from './components/FeedbackSection';
import { User } from './types';
import { supabase } from './lib/supabase';
import { useSiteImage } from './hooks/useSiteImage';

function App() {
  // const [isOrderOpen, setIsOrderOpen] = useState(false); // [DISABLED] Online ordering turned off
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'mylab' | 'admin' | 'adminLogin'>('home');
  const [user, setUser] = useState<User | null>(null);

  // Dynamic Favicon Injection
  const { imageUrl: faviconUrl } = useSiteImage('favicon');

  useEffect(() => {
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [faviconUrl]);

  // Initialize Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      }
    });

    // Listen for changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
      
      {/* Order Overlay - DISABLED: online ordering turned off */}
      {/* <OrderOnline isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} /> */}

      <div className="relative z-10">
        <Navbar 
          onOpenOrder={() => {}} 
          onNavigate={setCurrentView}
          currentView={currentView}
          user={user}
        />
        
        {currentView === 'home' && (
          <>
            <Hero />
            <About />
            <Services />
            {/* <MenuSection /> [DISABLED] Replaced by Our Offerings */}
            <OurOfferings />
            <Gallery />
            <Franchise />
            <Blog />
            <FeedbackSection user={user} />
            <Contact />
          </>
        )}

        {currentView === 'login' && (
          <LoginPage onLogin={() => {}} onNavigate={setCurrentView} />
        )}

        {/* Registration route DISABLED - self-registration turned off */}
        {/* {currentView === 'register' && (
          <RegisterPage 
            onSuccess={() => setCurrentView('login')} 
            onBackToLogin={() => setCurrentView('login')} 
          />
        )} */}

        {currentView === 'adminLogin' && (
          <LoginPage onLogin={() => {}} isAdminLogin={true} onNavigate={setCurrentView} />
        )}

        {currentView === 'mylab' && user && (
          <MyLab 
            user={user} 
            onLogout={handleLogout} 
            onOpenOrder={() => {}} // [DISABLED] Online ordering turned off
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