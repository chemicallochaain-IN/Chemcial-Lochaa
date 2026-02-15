import React, { useState } from 'react';
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
import { User } from './types';

function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'mylab'>('home');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('mylab');
  };

  const handleLogout = () => {
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
          <LoginPage onLogin={handleLogin} />
        )}

        {currentView === 'mylab' && user && (
          <MyLab 
            user={user} 
            onLogout={handleLogout} 
            onOpenOrder={() => setIsOrderOpen(true)}
          />
        )}

        {/* Show footer on all pages */}
        <Footer />
      </div>
    </div>
  );
}

export default App;