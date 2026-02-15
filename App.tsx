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

function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <div className="min-h-screen bg-graph-paper font-sans text-brand-teal relative selection:bg-brand-yellow selection:text-brand-teal">
      <BackgroundDoodles />
      
      {/* Order Overlay */}
      <OrderOnline isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      <div className="relative z-10">
        <Navbar onOpenOrder={() => setIsOrderOpen(true)} />
        <Hero />
        <About />
        <Services />
        <MenuSection />
        <Gallery />
        <Franchise />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;