import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import BackgroundDoodles from './components/BackgroundDoodles';

function App() {
  return (
    <div className="min-h-screen bg-graph-paper font-sans text-brand-teal relative selection:bg-brand-yellow selection:text-brand-teal">
      <BackgroundDoodles />
      
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <MenuSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;