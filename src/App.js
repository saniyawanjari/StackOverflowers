import React, { useState, useRef, useEffect } from 'react';

/* ─────────────────────────── DATA ─────────────────────────── */
const PRODUCTS = [
  { id:1, emoji:'🤓', brand:'LENSORA AIR',   name:'Slim Titanium Frame', style:'Rectangle • Matte Black',  price:2499, old:4999, off:'50%', badge:'BESTSELLER', colors:['#1a1a1a','#8B4513','#C0C0C0'] },
  { id:2, emoji:'😎', brand:'VINCENT & CO',  name:'Retro Round Classic',  style:'Round • Tortoise',         price:1899, old:3499, off:'46%', badge:'NEW',        colors:['#6B3A2A','#2d2d2d','#B8860B'] },
  { id:3, emoji:'🕶️', brand:'LENSORA PRO',   name:'Aviator Gold Frame',   style:'Aviator • Gold Brown',     price:3199, old:5999, off:'47%', badge:'SALE',       colors:['#B8860B','#8B4513','#1a1a1a'] },
  { id:4, emoji:'👓', brand:'STUDIO BLUE',   name:'Cat-Eye Chic',          style:'Cat-Eye • Crystal Pink',   price:2299, old:3999, off:'43%', badge:'TRENDING',   colors:['#FFB6C1','#9333ea','#1a1a1a'] },
  { id:5, emoji:'🔭', brand:'LENSORA BLU',   name:'Anti-Blue Light Pro',  style:'Rectangle • Transparent',  price:1699, old:2999, off:'43%', badge:'TECH',       colors:['#d1d5db','#1a1a1a','#3b82f6'] },
  { id:6, emoji:'🤿', brand:'SPORTZ VISION', name:'Wrap Sport Shield',    style:'Shield • Matte Navy',      price:3499, old:6499, off:'46%', badge:'SPORT',      colors:['#1e3a5f','#e63946','#1a1a1a'] },
  { id:7, emoji:'👑', brand:'ROYALE OPTIC',  name:'Gold Hexagonal',       style:'Hexagonal • Champagne',    price:4299, old:7999, off:'46%', badge:'LUXURY',     colors:['#F5DEB3','#B8860B','#C0C0C0'] },
  { id:8, emoji:'🌸', brand:'BLOOM FRAMES',  name:'Floral Wayfarer',      style:'Wayfarer • Rose Fade',     price:1499, old:2799, off:'46%', badge:'NEW',        colors:['#FFB6C1','#ff69b4','#f8bbd9'] },
];

const CATEGORIES = [
  ['👓','Eyeglasses'], ['🕶️','Sunglasses'], ['💻','Computer'],
  ['⚡','Power Sun'],  ['👦','Kids'],        ['📖','Reading'],
  ['🧪','Contact'],   ['🎨','Collections'],
];

const SHAPES = [
  ['▭','Rectangle'], ['◯','Round'],     ['🔷','Wayfarer'],
  ['🔺','Cat-Eye'],  ['⬡','Hexagonal'], ['✈️','Aviator'],
];

const BRANDS = ['Ray-Ban','Oakley','Vogue','Titan','Tommy H.','V. Chase','Fastrack','John Jacobs'];

const TESTIMONIALS = [
  { quote:'Lensora completely changed my eyewear game. The try-on feature is super accurate and delivery was fast!', name:'Priya S.', loc:'Mumbai',    init:'P' },
  { quote:'Amazing quality at unbeatable prices. Got two pairs for the cost of one elsewhere. Love the anti-blue lenses.', name:'Rahul M.', loc:'Bangalore', init:'R' },
  { quote:'Great frame selection. Customer service is top notch and glasses arrived perfectly packaged. Very happy!', name:'Aarti K.', loc:'Delhi',     init:'A' },
];

const INSTA_POSTS = ['🤓','😎','🕶️','👓','🔭','🤿','👑','🌸','✨','🎯'];
const NAV_LINKS   = ['New Arrivals','Eyeglasses','Computer Glasses','Sunglasses','Kids','Contact Lens'];
const FILTER_TABS = ['All','Eyeglasses','Sunglasses','Computer','Kids','Trending'];
const FEATURES    = [
  ['🔬','3D Virtual Try-On',  'AI-powered face detection for perfect fit'],
  ['🚚','Free Fast Delivery', 'Express delivery in 24-48 hours across India'],
  ['💯','Quality Guaranteed', 'Certified lenses with 1-year warranty'],
  ['🔄','30-Day Returns',     'Return hassle-free within 30 days'],
];

/* ─────────────────────────── PRODUCT CARD ─────────────────── */
function ProductCard({ product, onAdd }) {
  const [wished, setWished] = useState(false);

  const badgeClass =
    product.badge === 'SALE'                          ? 'red'  :
    ['NEW','TRENDING','TECH'].includes(product.badge) ? 'teal' : '';

  return (
    <div className="product-card">
      <div className="product-img">
        <span className={`product-badge ${badgeClass}`}>{product.badge}</span>
        <button className="wish-btn" onClick={() => setWished(!wished)}>
          {wished ? '❤️' : '🤍'}
        </button>
        <span>{product.emoji}</span>
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-style">{product.style}</div>
        <div className="color-dots">
          {product.colors.map((c, i) => (
            <div key={i} className="color-dot" style={{ background: c }} />
          ))}
        </div>
        <div className="product-footer">
          <div className="price-group">
            <span className="price-now">Rs.{product.price.toLocaleString()}</span>
            <span className="price-old">Rs.{product.old.toLocaleString()}</span>
            <span className="price-off">{product.off} off</span>
          </div>
          <button className="add-btn" onClick={() => onAdd(product)}>Add +</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── CHATBOT ─────────────────────── */
const BOT_RESPONSES = {
  default: ["I'm here to help you find the perfect eyewear! 😊 Ask me about frames, lenses, or prices.", "Great question! Let me help you explore our collection.", "I'd love to help! Could you tell me more about what you're looking for?"],
  price:   ["We have frames starting from Rs.999! Our bestsellers range from Rs.1499 to Rs.4299. All come with free delivery 🚚", "Great news — we have options for every budget! Frames from Rs.999 to Rs.7999."],
  frame:   ["We carry Rectangle, Round, Aviator, Cat-Eye, Wayfarer and Hexagonal styles. Which shape suits your face? 😎", "Our most popular are Rectangle and Round frames. Want me to suggest based on your face shape?"],
  lens:    ["We offer Single Vision, Bifocal, Progressive and Blue-Cut lenses. All certified with 1-year warranty! 💯", "Our anti-blue light lenses are a bestseller for screen users. Would you like to know more?"],
  offer:   ["Use code LENSORA20 for 20% off! Also, Buy 1 Get 1 FREE on all eyeglasses right now! 🎉", "We have amazing deals — B1G1 FREE + free delivery above Rs.999. Use LENSORA20 for extra 20% off!"],
  tryon:   ["Our 3D Virtual Try-On lets you see how any frame looks on your face in real time! Click '3D Try-On' in the navbar 🔬", "Yes! Just click '3D Try-On' and your camera will let you virtually try any frame. Super accurate AI!"],
  delivery:["We deliver in 24–48 hours across India! Free delivery on orders above Rs.999 🚚", "Express delivery in 24-48 hrs. Free shipping above Rs.999!"],
  brand:   ["We carry Ray-Ban, Oakley, Vogue, Titan, Tommy Hilfiger, Vincent Chase and more! 👑", "Top brands like Ray-Ban, Oakley, Fastrack and our own premium Lensora Air collection!"],
};

const SUGGESTIONS = ['Best sellers', 'Frame shapes', 'Current offers', 'Blue light lenses', 'Try-On feature', 'Delivery info'];

function getResponse(text) {
  const t = text.toLowerCase();
  if (t.match(/price|cost|cheap|budget|afford|rs\.|rupee/))    return BOT_RESPONSES.price;
  if (t.match(/frame|shape|style|rect|round|aviator|cat|way/)) return BOT_RESPONSES.frame;
  if (t.match(/lens|bifocal|progressive|blue|light|power/))    return BOT_RESPONSES.lens;
  if (t.match(/offer|deal|discount|coupon|sale|free|promo/))   return BOT_RESPONSES.offer;
  if (t.match(/try|virtual|3d|camera|ar/))                     return BOT_RESPONSES.tryon;
  if (t.match(/deliver|ship|fast|quick|courier/))              return BOT_RESPONSES.delivery;
  if (t.match(/brand|rayban|oakley|titan|vogue|fastrack/))     return BOT_RESPONSES.brand;
  return BOT_RESPONSES.default;
}

function Chatbot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { role:'bot', text:'👋 Hi! I\'m Lensora\'s AI stylist. Ask me anything about frames, lenses, offers or delivery!', time: nowTime() },
  ]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const [showDot,  setShowDot]  = useState(true);
  const messagesEndRef = useRef(null);

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setShowDot(false);
    setMessages(prev => [...prev, { role:'user', text: msg, time: nowTime() }]);
    setTyping(true);
    setTimeout(() => {
      const pool = getResponse(msg);
      const reply = pool[Math.floor(Math.random() * pool.length)];
      setTyping(false);
      setMessages(prev => [...prev, { role:'bot', text: reply, time: nowTime() }]);
    }, 1000 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button className={`chat-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Chat with us">
        {!open ? (
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        )}
        {showDot && !open && <span className="chat-dot" />}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${open ? 'open' : ''}`}>

        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar">👓</div>
          <div className="chat-header-info">
            <div className="chat-bot-name">Lensora AI Stylist</div>
            <div className="chat-bot-status">
              <span className="status-dot" />
              Online — here to help
            </div>
          </div>
          <button className="chat-header-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Quick suggestions */}
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'bot' && <div className="msg-avatar">👓</div>}
              <div>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="msg bot">
              <div className="msg-avatar">👓</div>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <button className="chat-mic" title="Voice input">🎤</button>
          <input
            className="chat-input"
            placeholder="Ask about frames, lenses, offers..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="chat-send" onClick={() => sendMessage()}>
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── MAIN APP ─────────────────────── */
export default function App() {
  const [cart,       setCart]       = useState([]);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [toast,      setToast]      = useState({ show: false, msg: '' });
  const [activeNav,  setActiveNav]  = useState('Eyeglasses');
  const [activeTab,  setActiveTab]  = useState('All');
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shopRef = useRef(null);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2400);
  };

  const addToCart     = (p) => { setCart(prev => [...prev, p]); showToast(`${p.name} added to cart!`); };
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const cartTotal      = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <>
      {/* ANNOUNCEMENT */}
      <div className="ann">
        FREE Delivery above Rs.999 &nbsp;|&nbsp;
        <span>Buy 1 Get 1 FREE</span> on all eyeglasses &nbsp;|&nbsp;
        Code: <span>LENSORA20</span> for 20% off
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-top">
          <a className="logo" href="#">Lens<span>ora</span></a>

          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Search frames, brands, shapes..." />
          </div>

          <div className="nav-actions">
            <button className="nav-btn">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Sign In
            </button>
            <button className="nav-btn">
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Wishlist
            </button>
            <button className="nav-btn" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              Cart
            </button>
          </div>
        </div>

        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <button key={l} className={`nav-link ${activeNav === l ? 'active' : ''}`} onClick={() => setActiveNav(l)}>
              {l}
            </button>
          ))}
          <button className="nav-link special">🔬 3D Try-On</button>
          <button className="nav-link special">👑 Gold Member</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">New Collection 2025</div>
          <h1 className="hero-title">See the World<br />in <em>Perfect</em> Style</h1>
          <p className="hero-sub">Premium eyewear crafted for every face. Try virtually, buy confidently — delivered in 24 hours.</p>
          <div className="hero-btns">
            <button className="btn btn-teal" onClick={() => shopRef.current?.scrollIntoView({ behavior:'smooth' })}>Shop Now</button>
            <button className="btn btn-ghost">Try on Virtually</button>
          </div>
        </div>
        <div className="hero-bg-icon">👓</div>
      </section>

      {/* CATEGORIES */}
      <div className="cats-section">
        <div className="cats-row">
          {CATEGORIES.map(([emoji, label], i) => (
            <div key={i} className="cat-item">
              <div className="cat-icon">{emoji}</div>
              <span className="cat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section gray-bg" ref={shopRef}>
        <div className="sec-header">
          <div className="sec-tag">Featured Products</div>
          <h2 className="sec-title">Handpicked for You</h2>
          <p className="sec-sub">Premium frames from top designers, at prices you'll love</p>
        </div>
        <div className="filter-tabs">
          {FILTER_TABS.map(t => (
            <button key={t} className={`filter-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
        <div className="products-grid">
          {PRODUCTS.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
        </div>
        <div style={{ textAlign:'center', marginTop:'32px' }}>
          <button className="btn btn-teal">View All Products</button>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="section">
        <div className="promo-grid">
          <div className="promo-card" style={{ background:'linear-gradient(135deg,#0a1628,#1a2a4a)' }}>
            <div className="promo-body">
              <div className="promo-tag" style={{ color:'#00b4b4' }}>Limited Offer</div>
              <div className="promo-title" style={{ color:'#fff' }}>Buy 1 Get 1<br />Absolutely Free</div>
              <button className="promo-btn" style={{ background:'#00b4b4', color:'#fff' }}>Shop Now</button>
            </div>
            <span className="promo-emoji">👓</span>
          </div>
          <div className="promo-card" style={{ background:'linear-gradient(135deg,#e6fafa,#ccf5f5)' }}>
            <div className="promo-body">
              <div className="promo-tag" style={{ color:'#00b4b4' }}>Exclusive</div>
              <div className="promo-title" style={{ color:'#0a1628' }}>Gold Member<br />Special Deals</div>
              <button className="promo-btn" style={{ background:'#0a1628', color:'#fff' }}>Join Gold</button>
            </div>
            <span className="promo-emoji">👑</span>
          </div>
        </div>
      </section>

      {/* SHAPES */}
      <section className="section cream-bg">
        <div className="sec-header">
          <div className="sec-tag">Browse by Style</div>
          <h2 className="sec-title">Choose Your Frame Shape</h2>
          <p className="sec-sub">Find the perfect silhouette for your face</p>
        </div>
        <div className="shapes-row">
          {SHAPES.map(([emoji, label], i) => (
            <div key={i} className="shape-item">
              <div className="shape-box">{emoji}</div>
              <span className="shape-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <div className="features-strip">
        <div className="features-grid">
          {FEATURES.map(([icon, name, desc], i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{icon}</div>
              <div className="feature-name">{name}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRY ON */}
      <section className="tryon-section">
        <div className="tryon-text">
          <div className="tryon-tag">Lensora 3D Try-On</div>
          <h2 className="tryon-title">See Yourself in<br />Your Perfect Frames</h2>
          <p className="tryon-sub">Our AI maps your face in 3D and overlays glasses in real-time. Shop with 100% confidence.</p>
          <button className="btn btn-teal">Try On Virtually</button>
        </div>
        <div className="tryon-visual">🔬</div>
      </section>

      {/* BRANDS */}
      <section className="section">
        <div className="sec-header">
          <div className="sec-tag">Top Brands</div>
          <h2 className="sec-title">Shop by Brand</h2>
        </div>
        <div className="brands-row">
          {BRANDS.map((b, i) => <div key={i} className="brand-pill">{b}</div>)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section gray-bg">
        <div className="sec-header">
          <div className="sec-tag">Customer Love</div>
          <h2 className="sec-title">What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-author">
                <div className="test-avatar">{t.init}</div>
                <div>
                  <div className="test-name">{t.name}</div>
                  <div className="test-loc">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section">
        <div className="sec-header">
          <div className="sec-tag">@LensoraOfficial</div>
          <h2 className="sec-title">Stay Social and See It First</h2>
        </div>
        <div className="insta-grid">
          {INSTA_POSTS.map((emoji, i) => (
            <div key={i} className="insta-post" style={{ background:`hsl(${i*36},30%,93%)` }}>
              <div className="insta-inner">{emoji}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="newsletter">
        <h2 className="nl-title">Get Rs.500 Off Your First Order</h2>
        <p className="nl-sub">Subscribe for exclusive deals, style tips and early access</p>
        {!subscribed ? (
          <div className="nl-form">
            <input className="nl-input" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && email && setSubscribed(true)} />
            <button className="nl-btn" onClick={() => email && setSubscribed(true)}>Get Offer</button>
          </div>
        ) : (
          <p className="nl-success">Rs.500 coupon sent to {email}!</p>
        )}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <a className="logo" href="#">Lens<span>ora</span></a>
            <p className="footer-desc">India's leading online eyewear destination. Premium frames, certified lenses, and free delivery to your door.</p>
            <div className="footer-socials">
              {['📘','📸','🐦','▶️'].map((s, i) => <div key={i} className="social-icon">{s}</div>)}
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            {['Eyeglasses','Sunglasses','Computer','Kids','Contact Lens','Reading'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            {['About Us','Blog','Careers','Press','Store Locator'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            {['Track Order','Lens Guide','Returns','Warranty','Contact Us'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">2025 Lensora. All rights reserved.</span>
          <div className="pay-methods">
            {['VISA','MC','UPI','PayTM','GPay'].map(p => <span key={p} className="pay-badge">{p}</span>)}
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">My Cart ({cart.length})</span>
          <button className="cart-close" onClick={() => setCartOpen(false)}>X</button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p style={{ fontWeight:700, fontSize:15, color:'#0a1628', marginBottom:6 }}>Your cart is empty</p>
            <p>Add some stylish frames to get started!</p>
          </div>
        ) : (
          <>
            {cart.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item-img">{item.emoji}</div>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">Rs.{item.price.toLocaleString()}</div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(i)}>🗑️</button>
              </div>
            ))}
            <div className="cart-total-row">
              <span>Total</span>
              <span>Rs.{cartTotal.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </>
        )}
      </div>

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.msg}
      </div>

      {/* CHATBOT */}
      <Chatbot />
    </>
  );
}
