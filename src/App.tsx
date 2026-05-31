/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Category, Product, Order, Seller, Buyer, Meeting, SupportedLanguage, ShipmentStatus } from './types';
import { translations } from './translations';
import {
  initialProducts,
  initialOrders,
  initialSellers,
  initialBuyers,
  initialMeetings,
} from './initialData';

// Subcomponents
import { ToastContainer, ToastMessage, createToast } from './components/Toast';
import { StatsCard } from './components/StatsCard';
import { ProductCard } from './components/ProductCard';
import { RegistrationForms } from './components/RegistrationForms';
import { ShipmentTracker } from './components/ShipmentTracker';
import { GoogleMeetScheduler } from './components/GoogleMeetScheduler';
import { AdminPanel } from './components/AdminPanel';

// Icons
import {
  ShoppingBag,
  Heart,
  Globe2,
  Phone,
  Settings,
  ChevronDown,
  Calendar,
  AlertCircle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // --- STATE LAYER ---
  const [lang, setLang] = useState<SupportedLanguage>('English');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tailor_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tailor_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('tailor_sellers');
    return saved ? JSON.parse(saved) : initialSellers;
  });

  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    const saved = localStorage.getItem('tailor_buyers');
    return saved ? JSON.parse(saved) : initialBuyers;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('tailor_meetings');
    return saved ? JSON.parse(saved) : initialMeetings;
  });

  const [activeAd, setActiveAd] = useState<string>(() => {
    return localStorage.getItem('tailor_active_ad') || '🎉 SUMMER DESIGNER GALA: Up to 35% discount on custom wedding stitched gowns this week!';
  });

  // Flow State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [orderTarget, setOrderTarget] = useState<Product | null>(null);

  // New Order Form state
  const [orderName, setOrderName] = useState('');
  const [orderCountry, setOrderCountry] = useState('');
  const [orderDetails, setOrderDetails] = useState('');

  // DOM Refs for smooth navigating scrolling
  const productsRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);
  const meetingsRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem('tailor_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tailor_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tailor_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('tailor_buyers', JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem('tailor_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('tailor_active_ad', activeAd);
  }, [activeAd]);

  // --- TRANSLATION HELPER ---
  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['English']?.[key] || key;
  };

  // --- TOAST SYSTEM ---
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast = createToast(text, type);
    setToasts((prev) => [...prev, newToast]);
    // Auto remove
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // --- CORE CALLBACK ACTIONS ---

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedDiscount = p.originalPrice > newPrice
            ? Math.round(((p.originalPrice - newPrice) / p.originalPrice) * 100)
            : 0;
          return { ...p, price: newPrice, discount: updatedDiscount };
        }
        return p;
      })
    );
    const prod = products.find((p) => p.id === id);
    addToast(`Successfully updated price of "${prod?.name || 'Item'}" to $${newPrice.toFixed(2)}`, 'success');
  };

  const handleTriggerOrderNow = (product: Product) => {
    setOrderTarget(product);
    setOrderDetails(`Selected: ${product.name} (Price: $${product.price.toFixed(2)}) - Size: M`);

    // Fetch buyer registered details if they exist to pre-fill
    if (buyers.length > 0) {
      const topBuyer = buyers[buyers.length - 1];
      setOrderName(topBuyer.fullName);
      setOrderCountry(topBuyer.country);
    }

    addToast(t('addedToCart'), 'info');

    // Scroll smoothly to checkout card
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderCountry) {
      addToast('Please enter your full name and shipping country to clear logistics.', 'error');
      return;
    }

    const priceAmt = orderTarget ? orderTarget.price : 35.00;
    const prodTitle = orderTarget ? orderTarget.name : "Custom Curated Apparel";

    // Track generation code
    const codes = ['X', 'F', 'W', 'Z', 'M'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 8999);
    const generatedTracking = `TRK-${randomNum}-${randomCode}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingNumber: generatedTracking,
      buyerName: orderName,
      country: orderCountry,
      details: orderDetails,
      productName: prodTitle,
      price: priceAmt,
      status: 'Pending',
      orderedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    addToast(`Order placed successfully! Tracking Code: ${generatedTracking}`, 'success');

    // Reset checkout form state
    setOrderName('');
    setOrderCountry('');
    setOrderDetails('');
    setOrderTarget(null);

    // Prompt user with scroll
    setTimeout(() => {
      trackingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  };

  const handleRegisterSeller = (company: string, country: string, email: string, logo?: string) => {
    const newSeller: Seller = {
      id: `sel-${Date.now()}`,
      companyName: company,
      country,
      email,
      logoUrl: logo,
      isApproved: false, // requires admin approval
      registeredAt: new Date().toISOString(),
    };
    setSellers((prev) => [...prev, newSeller]);
    addToast(`Company "${company}" registered. Awaiting Admin License verification!`, 'success');
  };

  const handleRegisterBuyer = (name: string, country: string, email: string) => {
    const newBuyer: Buyer = {
      id: `buy-${Date.now()}`,
      fullName: name,
      country,
      email,
      registeredAt: new Date().toISOString(),
    };
    setBuyers((prev) => [...prev, newBuyer]);
    addToast(`Buyer profile created for "${name}" successfully. Checkout active!`, 'success');

    // Auto-fill checkout fields if user wants to order next
    setOrderName(name);
    setOrderCountry(country);
  };

  const handleUploadProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'discount'>) => {
    const productItem: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      discount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [productItem, ...prev]);
    addToast(`Global listing published: "${newProd.name}"`, 'success');

    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // --- ADMIN FUNCTIONALITY PATHS ---

  const handleAdminAddProduct = (prod: Omit<Product, 'id' | 'createdAt' | 'discount'>) => {
    handleUploadProduct(prod);
  };

  const handleAdminEditProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    addToast('Product details updated successfully in database.', 'success');
  };

  const handleAdminDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product successfully removed from global catalog.', 'info');
  };

  const handleAdminUpdateOrderStatus = (id: string, newStatus: ShipmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    addToast(`Order shipment status modified to "${newStatus}"`, 'success');
  };

  const handleAdminApproveSeller = (id: string, approved: boolean) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isApproved: approved } : s))
    );
    addToast(approved ? 'Seller authorized with verified checkmark!' : 'Seller license revoked.', 'info');
  };

  const handleAdminPublishAd = (text: string) => {
    setActiveAd(text);
    addToast(text ? 'New public promo ticker broadcasted live!' : 'Broadcast banner deactivated.', 'success');
  };

  // --- NAVIGATION ACTION ROUTER ---
  const handleNavClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (section === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'Men') {
      setSelectedCategory('Men');
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'Women') {
      setSelectedCategory('Women');
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'Kids') {
      setSelectedCategory('Kids');
      productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'Orders') {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (section === 'Meetings') {
      meetingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'Admin') {
      adminRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-indigo-600/10 selection:text-indigo-900">
      {/* 1. TOP ACCESS BAR */}
      <div className="bg-slate-950 border-b border-slate-900 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧵</span>
            <span className="font-bold text-white tracking-tight text-sm sm:text-base">
              {t('brandName')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-400">
              <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value as SupportedLanguage);
                  addToast(`Language updated to ${e.target.value}`, 'info');
                }}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-slate-300 pr-1 py-0.5"
              >
                <option value="English">English</option>
                <option value="Bengali">বাংলা</option>
                <option value="Arabic">العربية</option>
                <option value="French">Français</option>
                <option value="Chinese">中文</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMO ANNOUNCEMENT BAR (FLASH AD) */}
      {activeAd && (
        <div className="bg-amber-500 text-slate-950 font-bold text-xs py-2 tracking-wide text-center border-b border-amber-600 shadow-sm overflow-hidden whitespace-nowrap">
          <div className="marquee-container">
            <div className="marquee-content flex gap-12 font-semibold">
              <span>{activeAd}</span>
              <span>•</span>
              <span>TAILOR READY MADE DRESS EXCLUSIVE WORLDWIDE</span>
              <span>•</span>
              <span>{activeAd}</span>
              <span>•</span>
              <span>TAILOR READY MADE DRESS EXCLUSIVE WORLDWIDE</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. HERO GRAND HEADER */}
      <header className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-24 px-4 text-center border-b border-slate-950 overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full py-1.5 px-4 text-xs font-extrabold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Global Fashion Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            {t('brandName')}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('All');
                productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-950/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => {
                registerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-white/10 border border-white/5 hover:border-white/25 text-white font-bold text-sm px-6 py-2.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
            >
              Join Marketplace
            </button>
          </div>
        </div>
      </header>

      {/* 4. SEAMLESS ATELIER NAVIGATION TRACKER */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-[61px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-center py-1 sm:py-0 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
          {[
            { name: t('home'), dest: 'Home' },
            { name: t('men'), dest: 'Men' },
            { name: t('women'), dest: 'Women' },
            { name: t('kids'), dest: 'Kids' },
            { name: t('orders'), dest: 'Orders' },
            { name: t('meetings'), dest: 'Meetings' },
            { name: t('admin'), dest: 'Admin' },
          ].map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => handleNavClick(item.dest, e)}
              className="px-4 py-4 text-xs font-bold text-slate-400 hover:text-white border-b-2 border-transparent hover:border-indigo-400 transition-all cursor-pointer tracking-wider uppercase shrink-0"
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* 5. STATISTICS METRICS */}
        <StatsCard
          buyersCount={10000 + buyers.length}
          sellersCount={2000 + sellers.length}
          countriesCount={50}
          productsCount={100000 + products.length}
          t={t}
        />

        {/* 6. PRODUCTS INTERMEDIARY SECTION */}
        <div ref={productsRef} className="mb-12 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="text-indigo-600">🛍</span>
                {t('featuredProducts')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore hand-crafted premium apparel with customizable stitch designs tailored globally.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start sm:self-center">
              {(['All', 'Men', 'Women', 'Kids'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat === 'All' ? t('allCategories') : t(cat.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-medium shadow-sm">
              No tailored garments posted under this catalog section currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onUpdatePrice={handleUpdatePrice}
                  onOrderNow={handleTriggerOrderNow}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>

        {/* 7. COMBINED PORTAL REGISTRATIONS */}
        <div ref={registerRef} className="scroll-mt-28">
          <RegistrationForms
            onRegisterSeller={handleRegisterSeller}
            onRegisterBuyer={handleRegisterBuyer}
            onUploadProduct={handleUploadProduct}
            t={t}
          />
        </div>

        {/* 8. PLACE ORDER CHECKOUT MODULE */}
        <div ref={checkoutRef} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 scroll-mt-28">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <span className="text-indigo-600">🛒</span>
            {t('placeOrder')}
          </h2>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            Review custom measurements and stitch compositions. Enter localized shipping details to finalize.
          </p>

          <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder={t('fullName') + " (e.g. Alexander Wright)"}
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block font-semibold">Destination Country</label>
                <input
                  type="text"
                  required
                  placeholder={t('country') + " (e.g. United Kingdom)"}
                  value={orderCountry}
                  onChange={(e) => setOrderCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold">
                Tailoring & Order Specific Details
              </label>
              <textarea
                required
                placeholder="Write specific sizing (chest/sleeves), custom button selections, monograms, fabrics, stitch patterns, or special courier packaging requests..."
                value={orderDetails}
                onChange={(e) => setOrderDetails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors h-28 resize-none leading-relaxed"
              />
            </div>

            {orderTarget && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={orderTarget.image}
                    alt={orderTarget.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200"
                  />
                  <div>
                    <span className="text-xs text-slate-500 block font-bold leading-normal">
                      Preselected Apparel Target
                    </span>
                    <span className="text-sm text-slate-800 font-bold">{orderTarget.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block uppercase font-bold">Transaction Price</span>
                  <span className="text-lg font-black text-indigo-600">${orderTarget.price.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-sm py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10"
            >
              {t('submitOrder')}
            </button>
          </form>
        </div>

        {/* 9. CARGO SHIPMENT TRACKING STACK */}
        <div ref={trackingRef} className="scroll-mt-28">
          <ShipmentTracker orders={orders} t={t} />
        </div>

        {/* 10. MEET & WHATSAPP SUPPORT CHANNELS */}
        <div ref={meetingsRef} className="scroll-mt-28">
          <GoogleMeetScheduler
            meetings={meetings}
            onScheduleMeeting={(to, l, d) => {
              setMeetings((prev) => [
                {
                  id: `meet-${Date.now()}`,
                  topic: to,
                  meetLink: l,
                  date: d,
                  createdAt: new Date().toISOString(),
                },
                ...prev,
              ]);
              addToast(`Private tailor consultation scheduled for ${d}`, 'success');
            }}
            t={t}
          />
        </div>

        {/* 11. CENTRALIZED SECURITY ADMINISTRATIVE panel */}
        <div ref={adminRef} className="scroll-mt-28">
          <AdminPanel
            products={products}
            orders={orders}
            sellers={sellers}
            buyers={buyers}
            onAddProduct={handleAdminAddProduct}
            onEditProduct={handleAdminEditProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            onApproveSeller={handleAdminApproveSeller}
            onPublishAd={handleAdminPublishAd}
            activeAd={activeAd}
            t={t}
          />
        </div>
      </main>

      {/* 12. BOTTOM FOOTER */}
      <footer className="bg-[#0b101b] border-t border-slate-850/80 py-8 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 {t('brandName')}. All Rights Reserved.</p>
          <p className="text-[10px] text-slate-600">
            Certified global bespoke apparel clearance & logistics protocol. Operated from Cloud Interactive Node.
          </p>
        </div>
      </footer>

      {/* 13. GLOBAL FLOATING TOASTS */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
