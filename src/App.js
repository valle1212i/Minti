import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import NewsArticle from './pages/NewsArticle';
import Subscriptions from './pages/Subscriptions';
import GiftCards from './pages/GiftCards';
import Checkout from './pages/Checkout';
import Thanks from './pages/Thanks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import './styles/site.css';
import './App.css';

// Börja överst vid sidbyte, eller vid ankaret om adressen har ett (#zen-tradgard).
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'auto' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollManager />
        <a className="m-skip" href="#innehall">Hoppa till innehållet</a>
        <Navbar />
        <main id="innehall" className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wellness-experience" element={<WellnessExperience />} />
            <Route path="/bastu" element={<Bastu />} />
            <Route path="/book" element={<Book />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<Categories />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/kassa" element={<Checkout />} />
            <Route path="/tack" element={<Thanks />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
