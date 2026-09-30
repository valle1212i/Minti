import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import WellnessExperience from './pages/WellnessExperience';
import Bastu from './pages/Bastu';
import Book from './pages/Book';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Categories from './pages/Categories';
import News from './pages/News';
import Subscriptions from './pages/Subscriptions';
import GiftCards from './pages/GiftCards';
import Thanks from './pages/Thanks';
import { PageViewTracker } from './lib/analytics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <PageViewTracker />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wellness-experience" element={<WellnessExperience />} />
          <Route path="/bastu" element={<Bastu />} />
          {/* Ytor kopplade till kundportalen. Sökvägarna är portalens förhandsvisningsvägar. */}
          <Route path="/book" element={<Book />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<Categories />} />
          <Route path="/news" element={<News />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/tack" element={<Thanks />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
