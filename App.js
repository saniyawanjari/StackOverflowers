import React, { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════ CONFIG ═══════════════════════════ */

const API = 'http://localhost:8000';

// ⚠️ Move to a backend proxy before production!
const CLAUDE_API_KEY = 'YOUR_CLAUDE_API_KEY_HERE';

/* ═══════════════════════════ DATA ═══════════════════════════ */

const PRODUCTS = [
  { id:1, image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", brand:"LENSORA AIR", name:"Slim Titanium Frame", style:"Rectangle • Matte Black", price:2499, old:4999, off:"50%", badge:"BESTSELLER", colors:["#1a1a1a","#8B4513","#C0C0C0"], category:"Eyeglasses" },
  { id:2, image:"https://media.istockphoto.com/id/1221442384/photo/medicated-glasses.webp?a=1&b=1&s=612x612&w=0&k=20&c=RmH2-fwPtJvchZAhgC9oic1ya5jUk7SOXtVZcsia7ig=", brand:"VINCENT & CO", name:"Retro Round Classic", style:"Round • Tortoise", price:1899, old:3499, off:"46%", badge:"NEW", colors:["#6B3A2A","#2d2d2d","#B8860B"], category:"Eyeglasses" },
  { id:3, image:"https://media.istockphoto.com/id/1133030612/photo/gold-glasses-metal-in-round-frame-transparent-for-reading-or-good-eye-sight-top-view-isolated.webp?a=1&b=1&s=612x612&w=0&k=20&c=L3BhXYWnYnBnZUune4wX65Eht3IkNSEk9-8ImZSZaKs=", brand:"LENSORA PRO", name:"Aviator Gold Frame", style:"Aviator • Gold Brown", price:3199, old:5999, off:"47%", badge:"SALE", colors:["#B8860B","#8B4513","#1a1a1a"], category:"Sunglasses" },
  { id:4, image:"https://media.istockphoto.com/id/1399784271/photo/fashionable-optical-glasses-on-a-white-background.jpg?s=612x612&w=0&k=20&c=VQuoBt5wOnflkg8OtmcYRCHRAFqLDQ-bQmfOcI-AxII=", brand:"STUDIO BLUE", name:"Cat-Eye Chic", style:"Cat-Eye • Crystal Pink", price:2299, old:3999, off:"43%", badge:"TRENDING", colors:["#FFB6C1","#9333ea","#1a1a1a"], category:"Eyeglasses" },
  { id:5, image:"https://media.istockphoto.com/id/1319309368/photo/eyeglasses-isolated-on-white-background-plastic-eyewear.jpg?s=612x612&w=0&k=20&c=I5oSOVZM-VwYuBtsFdYkPYRmGbwaAqH2fm7cLd0j1fY=", brand:"LENSORA BLU", name:"Anti-Blue Light Pro", style:"Rectangle • Transparent", price:1699, old:2999, off:"43%", badge:"TECH", colors:["#d1d5db","#1a1a1a","#3b82f6"], category:"Computer" },
  { id:6, image:"https://media.istockphoto.com/id/465134021/photo/sport-sunglasses.jpg?s=612x612&w=0&k=20&c=eWOGV7zUbd6CNrR5rDUg_IIpusDtoJo5ho40GgfU3lM=", brand:"SPORTZ VISION", name:"Wrap Sport Shield", style:"Shield • Matte Navy", price:3499, old:6499, off:"46%", badge:"SPORT", colors:["#1e3a5f","#e63946","#1a1a1a"], category:"Sunglasses" },
  { id:7, image:"https://media.istockphoto.com/id/952852728/photo/retro-yellow-sunglasses-on-the-white-background.jpg?s=612x612&w=0&k=20&c=GioHpTz_3TJYsV2vtiRGdNNsvs3QvoAQvCp1Vq3hFgs=", brand:"ROYALE OPTIC", name:"Gold Hexagonal", style:"Hexagonal • Champagne", price:4299, old:7999, off:"46%", badge:"LUXURY", colors:["#F5DEB3","#B8860B","#C0C0C0"], category:"Eyeglasses" },
  { id:8, image:"https://media.istockphoto.com/id/488238873/photo/glasses.jpg?s=612x612&w=0&k=20&c=EEbLLeA9shiiiuXgf0UuTINl0jduK1W_Gi3ziiaAca4=", brand:"BLOOM FRAMES", name:"Floral Wayfarer", style:"Wayfarer • Rose Fade", price:1499, old:2799, off:"46%", badge:"NEW", colors:["#FFB6C1","#ff69b4","#f8bbd9"], category:"Kids" },
];

const CATEGORIES = [
  ['👓','Eyeglasses'],['🕶️','Sunglasses'],['💻','Computer'],
  ['⚡','Power Sun'],['👦','Kids'],['📖','Reading'],
  ['🧪','Contact'],['🎨','Collections'],
];
const SHAPES = [['▭','Rectangle'],['◯','Round'],['🔷','Wayfarer'],['🔺','Cat-Eye'],['⬡','Hexagonal'],['👓','Aviator']];
const BRANDS = ['Ray-Ban','Oakley','Vogue','Titan','Tommy H.','V. Chase','Fastrack','John Jacobs'];
const TESTIMONIALS = [
  { quote:'Lensora completely changed my eyewear game. The try-on feature is super accurate and delivery was fast!', name:'Priya S.', loc:'Mumbai', init:'P' },
  { quote:'Amazing quality at unbeatable prices. Got two pairs for the cost of one elsewhere. Love the anti-blue lenses.', name:'Rahul M.', loc:'Bangalore', init:'R' },
  { quote:'Great frame selection. Customer service is top notch and glasses arrived perfectly packaged. Very happy!', name:'Aarti K.', loc:'Delhi', init:'A' },
];
const NAV_LINKS   = ['New Arrivals','Eyeglasses','Computer Glasses','Sunglasses','Kids','Contact Lens'];
const FILTER_TABS = ['All','Eyeglasses','Sunglasses','Computer','Kids','Trending'];
const FEATURES    = [
  ['🔬','3D Virtual Try-On','AI-powered face detection for perfect fit'],
  ['🚚','Free Fast Delivery','Express delivery in 24-48 hours across India'],
  ['💯','Quality Guaranteed','Certified lenses with 1-year warranty'],
  ['🔄','30-Day Returns','Return hassle-free within 30 days'],
];

/* ═══════════════════ CLAUDE AI ════════════════════════════════ */

const SYSTEM_PROMPT = `You are Lensora's friendly and knowledgeable AI eyewear stylist assistant. Lensora is a premium online eyewear store in India.
Your job is to help customers with frame shapes, product recommendations, lens types, offers (B1G1 FREE, LENSORA20 for 20% off, free delivery above Rs.999), delivery info (24-48 hrs), returns & warranty (30-day returns, 1-year warranty).
Products: Slim Titanium Rs.2499, Retro Round Rs.1899, Aviator Gold Rs.3199, Cat-Eye Rs.2299, Anti-Blue Rs.1699, Sport Shield Rs.3499, Gold Hexagonal Rs.4299, Floral Wayfarer Rs.1499.
Keep replies 2-4 sentences, friendly, with emojis. Redirect off-topic questions back to eyewear.`;

async function askClaude(history) {
  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'YOUR_CLAUDE_API_KEY_HERE') throw new Error('Please add your Claude API key in App.js!');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': CLAUDE_API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 300, system: SYSTEM_PROMPT, messages: history }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || 'Claude error');
  if (data.content?.[0]?.text) return data.content[0].text;
  throw new Error('Empty response');
}

/* ═══════════════════ AUTH MODAL ════════════════════════════════
   Connects to: POST /api/auth/register  and  POST /api/auth/login
   ─────────────────────────────────────────────────────────────── */

function AuthModal({ onClose, onLogin }) {
  const [mode, setMode]       = useState('login');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // ── Password strength checker ──
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8)               score++;
    if (/[A-Z]/.test(pass))             score++;
    if (/[a-z]/.test(pass))             score++;
    if (/[0-9]/.test(pass))             score++;
    if (/[^A-Za-z0-9]/.test(pass))      score++;
    const levels = [
      { label: '',         color: '' },
      { label: 'Weak',     color: '#ef4444' },
      { label: 'Fair',     color: '#f97316' },
      { label: 'Good',     color: '#eab308' },
      { label: 'Strong',   color: '#22c55e' },
      { label: 'Very Strong', color: '#16a34a' },
    ];
    return { score, ...levels[score] };
  };

  const strength = getPasswordStrength(password);

  // ── Validate before submit ──
  const validate = () => {
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill in all fields.'); return false;
    }
    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g. name@gmail.com)'); return false;
    }
    if (mode === 'register') {
      // Name: at least 2 chars
      if (name.trim().length < 2) {
        setError('Name must be at least 2 characters.'); return false;
      }
      // Password length
      if (password.length < 8) {
        setError('Password must be at least 8 characters.'); return false;
      }
      // Must have uppercase
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter (A-Z).'); return false;
      }
      // Must have number
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number (0-9).'); return false;
      }
      // Must have special character
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('Password must contain at least one special character (!@#$...).'); return false;
      }
    }
    return true;
  };

  const submit = async () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body     = mode === 'login' ? { email, password } : { name, email, password };
      const res      = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || data.message || 'Something went wrong'); return; }

      if (mode === 'login') {
        localStorage.setItem('lensora_token', data.token);
        localStorage.setItem('lensora_user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
        onClose();
      } else {
        setMode('login');
        setName(''); setPass('');
        setError('✅ Account created! Please sign in.');
      }
    } catch {
      setError('Cannot reach server. Make sure backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Lens<span>ora</span></div>
        <p className="modal-subtitle">{mode === 'login' ? 'Welcome back! Sign in to your account.' : 'Create your Lensora account.'}</p>

        <div className="modal-tabs">
          <button className={`modal-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
          <button className={`modal-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>Register</button>
        </div>

        {mode === 'register' && (
          <input className="modal-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        )}

        <input className="modal-input" type="email" placeholder="Email Address (e.g. name@gmail.com)"
          value={email} onChange={e => setEmail(e.target.value)} />

        {/* Password field with show/hide toggle */}
        <div style={{ position: 'relative' }}>
          <input
            className="modal-input"
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ paddingRight: '44px' }}
          />
          <button
            onClick={() => setShowPass(!showPass)}
            style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer', fontSize:'16px', color:'#666' }}
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Password strength bar — only on register */}
        {mode === 'register' && password.length > 0 && (
          <div style={{ marginTop: '-8px', marginBottom: '8px' }}>
            <div style={{ display:'flex', gap:'4px', marginBottom:'4px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  flex: 1, height: '4px', borderRadius: '2px',
                  background: i <= strength.score ? strength.color : '#e5e7eb',
                  transition: 'background 0.3s'
                }} />
              ))}
            </div>
            <div style={{ fontSize:'11px', color: strength.color, fontWeight: 600 }}>
              {strength.label && `Password strength: ${strength.label}`}
            </div>
            {/* Hints */}
            <div style={{ fontSize:'11px', color:'#888', marginTop:'4px', lineHeight:'1.6' }}>
              {password.length < 8     && '• At least 8 characters'}
              {!/[A-Z]/.test(password) && '• One uppercase letter (A-Z) '}
              {!/[0-9]/.test(password) && '• One number (0-9) '}
              {!/[^A-Za-z0-9]/.test(password) && '• One special character (!@#$)'}
            </div>
          </div>
        )}

        {error && <div className={`modal-error ${error.startsWith('✅') ? 'modal-success' : ''}`}>{error}</div>}

        <button className="modal-submit" onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? '🔐 Sign In' : '✨ Create Account'}
        </button>

        {/* Password requirements hint for register */}
        {mode === 'register' && (
          <p style={{ fontSize:'11px', color:'#aaa', textAlign:'center', marginTop:'8px' }}>
            Password needs: 8+ chars, uppercase, number & special character
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════ USER DRAWER ═══════════════════════════════
   Shows: user name/email, My Orders from GET /orders/
   ─────────────────────────────────────────────────────────────── */

function UserDrawer({ open, onClose, user, token, onLogout, initialTab }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState('profile');

  useEffect(() => {
    if (open) setTab(initialTab || 'profile');
  }, [open, initialTab]);

  useEffect(() => {
    if (open && tab === 'orders' && token) fetchOrders();
  }, [open, tab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/orders/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Orders response:', res.status, data);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchOrders error:', err.message);
      setOrders([]);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">👤 My Account</span>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {/* Profile card */}
        <div className="user-profile-card">
          <div className="user-avatar-big">{user.name?.[0]?.toUpperCase() || '?'}</div>
          <div>
            <div className="user-name-big">{user.name}</div>
            <div className="user-email-big">{user.email}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="user-drawer-tabs">
          <button className={`user-drawer-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
          <button className={`user-drawer-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>My Orders</button>
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="user-profile-info">
            <div className="profile-row"><span>Name</span><strong>{user.name}</strong></div>
            <div className="profile-row"><span>Email</span><strong>{user.email}</strong></div>
            <div className="profile-row"><span>Member Since</span><strong>2025</strong></div>
            <button className="logout-btn" onClick={() => { onLogout(); onClose(); }}>🚪 Sign Out</button>
          </div>
        )}

        {tab === 'orders' && (
          <div style={{ padding:'0 16px' }}>
            {loading ? (
              <p style={{ textAlign:'center', color:'var(--muted)', padding:'30px' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">📦</div>
                <p style={{ fontWeight:700, fontSize:15, color:'#0a1628', marginBottom:6 }}>No orders yet</p>
                <p>Your placed orders will appear here!</p>
              </div>
            ) : (
              orders.map((order, i) => {
                const STATUS_STEPS = ["Confirmed","Processing","Shipped","Out for Delivery","Delivered"];
                const currentStep  = STATUS_STEPS.indexOf(order.status);
                const isCancelled  = order.status === "Cancelled";
                return (
                  <div key={i} className="order-card">
                    <div className="order-header">
                      <span className="order-id">#{order._id?.slice(-6).toUpperCase()}</span>
                      <span className={`order-status-badge ${isCancelled ? 'cancelled' : ''}`}>
                        {isCancelled ? '❌' : currentStep >= 4 ? '✅' : '🚚'} {order.status}
                      </span>
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </div>

                    {/* Items */}
                    <div className="order-items-list">
                      {order.items?.map((item, j) => (
                        <div key={j} className="order-item-row">
                          <span>👓 {item.name}</span>
                          <span>x{item.quantity} · Rs.{item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">Total: Rs.{order.totalAmount?.toLocaleString()} · 💵 COD</div>

                    {/* Delivery address */}
                    {order.deliveryDetails && (
                      <div className="order-address">
                        📍 {order.deliveryDetails.address}, {order.deliveryDetails.city} - {order.deliveryDetails.pincode}
                        <br/>📞 {order.deliveryDetails.phone}
                      </div>
                    )}

                    {/* Status tracker */}
                    {!isCancelled && (
                      <div className="status-tracker">
                        {STATUS_STEPS.map((step, idx) => (
                          <div key={idx} className={`tracker-step ${idx <= currentStep ? 'done' : ''} ${idx === currentStep ? 'active' : ''}`}>
                            <div className="tracker-dot">
                              {idx < currentStep ? '✓' : idx === currentStep ? '●' : '○'}
                            </div>
                            <div className="tracker-label">{step}</div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`tracker-line ${idx < currentStep ? 'done' : ''}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════ PRODUCT CARD ══════════════════════ */

function ProductCard({ product, onAdd, onWishlist, isWished }) {
  const badgeClass =
    product.badge === 'SALE' ? 'red' :
    ['NEW','TRENDING','TECH'].includes(product.badge) ? 'teal' : '';

  return (
    <div className="product-card">
      <div className="product-img">
        <span className={`product-badge ${badgeClass}`}>{product.badge}</span>
        <button className="wish-btn" onClick={() => onWishlist(product)}>{isWished ? '❤️' : '🤍'}</button>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-style">{product.style}</div>
        <div className="color-dots">
          {product.colors.map((c, i) => <div key={i} className="color-dot" style={{ background: c }} />)}
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

/* ═══════════════════════ VOICE UI ═══════════════════════════ */

const VOICE_CHIPS = [
  { icon:'👓', label:'Find my frame' },
  { icon:'💡', label:'Give me ideas' },
  { icon:'🏷️', label:'Best offers' },
  { icon:'💻', label:'Best lenses for screens' },
];

function VoiceUI({ open, onClose, onResult }) {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus]         = useState('Tap the orb to speak');
  const recRef        = useRef(null);
  const transcriptRef = useRef(''); // ✅ ref always has latest value — no stale state bug

  useEffect(() => {
    if (open)  { setTranscript(''); transcriptRef.current = ''; setStatus('Tap the orb to speak'); setListening(false); }
    if (!open && recRef.current) { recRef.current.stop(); setListening(false); }
  }, [open]);

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setStatus('Voice not supported in this browser'); return; }
    if (listening) { recRef.current?.stop(); setListening(false); setStatus('Tap the orb to speak'); return; }
    const r = new SR();
    recRef.current = r;
    r.lang = 'en-IN'; r.interimResults = true; r.continuous = false;
    r.onstart  = () => { setListening(true); setStatus('Listening...'); setTranscript(''); transcriptRef.current = ''; };
    r.onresult = (e) => {
      // ✅ Update BOTH state (for display) and ref (for onend)
      const text = Array.from(e.results).map(x => x[0].transcript).join('');
      setTranscript(text);
      transcriptRef.current = text;
    };
    r.onend = () => {
      setListening(false);
      setStatus('Tap the orb to speak');
      // ✅ Use ref value — always current, never stale
      const finalText = transcriptRef.current.trim();
      if (finalText) {
        onResult(finalText); // send immediately
        onClose();
      }
    };
    r.onerror  = () => { setListening(false); setStatus('Could not hear you. Try again!'); };
    r.start();
  };

  return (
    <div className={`voice-overlay ${open ? 'active' : ''}`}>
      <div className="voice-bg" />
      <button className="voice-close" onClick={onClose}>✕</button>
      <div className="voice-greeting">
        <div className="voice-hello">Hello, Shopper!</div>
        <div className="voice-subtitle">How can I help you today?</div>
      </div>
      <div className="voice-orb-center">
        <div className="voice-orb-wrap">
          {listening && (<><div className="orb-ring"/><div className="orb-ring"/><div className="orb-ring"/></>)}
          <div className={`voice-orb ${listening ? 'listening' : ''}`} onClick={toggleListening}>
            <span className="orb-icon">{listening ? '🎙️' : '👓'}</span>
          </div>
        </div>
        <div className={`voice-waves ${listening ? 'active' : ''}`}>
          {[...Array(9)].map((_, i) => <div key={i} className="wave-bar" />)}
        </div>
        <div className={`voice-status ${listening ? 'listening-text' : ''}`}>{status}</div>
      </div>
      <div className="voice-transcript">{transcript || (listening ? '...' : '')}</div>
      <div className="voice-chips">
        {VOICE_CHIPS.map((c, i) => (
          <button key={i} className="voice-chip" onClick={() => { setTranscript(c.label); setTimeout(() => { onResult(c.label); onClose(); }, 400); }}>
            <span className="voice-chip-icon">{c.icon}</span>{c.label}
          </button>
        ))}
      </div>
      <div className="voice-hint">{listening ? 'Tap orb again to stop' : 'Tap the orb or choose a suggestion'}</div>
    </div>
  );
}

/* ═══════════════════════ AI CHATBOT ═════════════════════════ */

const SUGGESTIONS = ['Best sellers 🔥','Offers & deals 🏷️','Frame for my face 👤','Blue light lenses 💻','3D Try-On 🔬','Delivery info 🚚'];
const nowTime = () => new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

function Chatbot() {
  const [open,       setOpen]       = useState(false);
  const [voiceOpen,  setVoice]      = useState(false);
  const [messages,   setMessages]   = useState([
    { role:'bot', text:"👋 Hi! I'm Lensora's AI assistant. Ask me about frames, offers, or track your order!", time: nowTime() },
  ]);
  const [flaskToken, setFlaskToken] = useState(null);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [showDot,    setShowDot]    = useState(true);
  const endRef = useRef(null);

  // Auto-login to Flask (friend's Ollama backend)
  useEffect(() => {
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'guest_user' }),
    })
      .then(r => r.json())
      .then(d => setFlaskToken(d.access_token))
      .catch(e => console.error('Flask login failed:', e));
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Stop speech when chat closes
  useEffect(() => {
    if (!open) window.speechSynthesis?.cancel();
  }, [open]);

  // Text-to-speech — Hindi or English auto detect
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = /[ऀ-ॿ]/.test(text) ? 'hi-IN' : 'en-IN';
    u.rate  = 1; u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  // Send to Flask → Ollama → real MongoDB orders
  const sendMessage = async (text) => {
    window.speechSynthesis?.cancel();
    const msg = (text || input).trim();
    if (!msg || loading || !flaskToken) return;
    setInput(''); setShowDot(false);
    setMessages(prev => [...prev, { role:'user', text: msg, time: nowTime() }]);
    setLoading(true);
    try {
      const lensoraToken = localStorage.getItem('lensora_token') || '';
      const res  = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${flaskToken}`,
        },
        body: JSON.stringify({ message: msg, lensora_token: lensoraToken }),
      });
      const data  = await res.json();
      const reply = data.response || '⚠️ No response received.';
      setMessages(prev => [...prev, { role:'bot', text: reply, time: nowTime() }]);
      speakResponse(reply);
    } catch (err) {
      setMessages(prev => [...prev, { role:'bot', text: '⚠️ Could not reach assistant. Is voice bot server running?', time: nowTime() }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button className={`chat-fab ${open ? 'open' : ''}`} onClick={() => {
        if (open) window.speechSynthesis?.cancel();
        setOpen(!open);
      }}>
        {!open ? <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               : <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
        {showDot && !open && <span className="chat-dot" />}
      </button>

      <div className={`chat-window ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-info">
            <div className="chat-bot-name">Lensora AI Assistant</div>
            <div className="chat-bot-status">
              <span className="status-dot" />
              {flaskToken ? 'Online • Powered by Ollama' : 'Connecting...'}
            </div>
          </div>
          <button className="chat-header-close" onClick={() => { window.speechSynthesis?.cancel(); setOpen(false); }}>✕</button>
        </div>
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s, i) => <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>)}
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'bot' && <div className="msg-avatar">🤖</div>}
              <div><div className="msg-bubble">{m.text}</div><div className="msg-time">{m.time}</div></div>
            </div>
          ))}
          {loading && (
            <div className="msg bot">
              <div className="msg-avatar">🤖</div>
              <div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="chat-input-area">
          <button className="chat-mic" onClick={() => setVoice(true)}>🎤</button>
          <input className="chat-input" placeholder={loading ? 'AI is thinking...' : 'Ask about frames, orders, offers...'}
            value={input} disabled={loading}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()} />
          <button className="chat-send" onClick={() => sendMessage()} disabled={loading} style={{ opacity: loading ? 0.5 : 1 }}>
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <VoiceUI open={voiceOpen} onClose={() => { window.speechSynthesis?.cancel(); setVoice(false); }}
        onResult={(text) => { setVoice(false); setTimeout(() => sendMessage(text), 300); }} />
    </>
  );
}

/* ═══════════════════ ORDER DETAILS MODAL ═══════════════════════
   Simple delivery form — no payment, just name/phone/address
   ─────────────────────────────────────────────────────────────── */

function OrderModal({ onClose, onConfirm, cart, total, user, onViewOrders }) {
  const [fullName,      setFullName]      = useState(user?.name || '');
  const [phone,         setPhone]         = useState('');
  const [address,       setAddress]       = useState('');
  const [city,          setCity]          = useState('');
  const [pincode,       setPincode]       = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [placed,        setPlaced]        = useState(false);
  // Snapshot cart+total at submit time so success screen always shows correct data
  // even after parent clears the cart
  const [snapCart,      setSnapCart]      = useState([]);
  const [snapTotal,     setSnapTotal]     = useState(0);

  const submit = async () => {
    setError('');
    if (!fullName || !phone || !address || !city || !pincode) { setError('Please fill in all delivery details.'); return; }
    if (phone.length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    // Snapshot BEFORE calling onConfirm (which clears the cart in parent)
    setSnapCart([...cart]);
    setSnapTotal(total);
    setLoading(true);
    await onConfirm({ fullName, phone, address, city, pincode });
    setPlaced(true);
    setLoading(false);
  };

  // ── SUCCESS SCREEN ──
  if (placed) {
    return (
      <div className="modal-overlay">
        <div className="modal-box order-modal-box order-success-box" onClick={e => e.stopPropagation()}>
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Order Placed!</h2>
          <p className="success-sub">Thank you, <strong>{fullName}</strong>! Your order is confirmed.</p>

          <div className="success-details">
            {snapCart.map((item, i) => (
              <div key={i} className="success-row">
                <span>👓 {item.name}</span>
                <span>Rs.{item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="success-row" style={{ borderTop: '1.5px solid var(--border)', marginTop: 4, paddingTop: 8, fontWeight: 700 }}>
              <span>💰 Total</span><span>Rs.{snapTotal.toLocaleString()}</span>
            </div>
            <div className="success-row"><span>📍 Deliver to</span><span>{address}, {city} - {pincode}</span></div>
            <div className="success-row"><span>📞 Contact</span><span>{phone}</span></div>
            <div className="success-row"><span>🚚 Delivery</span><span>24-48 hours</span></div>
            <div className="success-row"><span>💵 Payment</span><span>Cash on Delivery</span></div>
          </div>

          <div className="success-badge">Your glasses are on their way! 👓✨</div>

          <button className="modal-submit" style={{ marginBottom: 10 }} onClick={() => { onClose(); onViewOrders(); }}>
            📦 Track My Order
          </button>
          <button className="modal-submit-ghost" onClick={onClose}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  // ── FORM SCREEN ──
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box order-modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">Lens<span>ora</span></div>
        <p className="modal-subtitle">Enter delivery details to place your order</p>

        {/* Order summary */}
        <div className="order-summary-box">
          {cart.map((item, i) => (
            <div key={i} className="order-summary-row">
              <span>{item.name}</span>
              <span>Rs.{item.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="order-summary-total">
            <span>Total</span>
            <span>Rs.{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="order-form-grid">
          <input className="modal-input" placeholder="Full Name *" value={fullName} onChange={e => setFullName(e.target.value)} />
          <input className="modal-input" placeholder="Phone Number *" type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
        </div>
        <input className="modal-input" placeholder="Full Address (House No, Street, Area) *" value={address} onChange={e => setAddress(e.target.value)} />
        <div className="order-form-grid">
          <input className="modal-input" placeholder="City *" value={city} onChange={e => setCity(e.target.value)} />
          <input className="modal-input" placeholder="PIN Code *" maxLength={6} value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ''))} />
        </div>

        <div className="payment-badge">
          💵 Cash on Delivery &nbsp;·&nbsp; Free delivery above Rs.999 &nbsp;·&nbsp; 24-48 hrs
        </div>

        {error && <div className="modal-error">{error}</div>}

        <button className="modal-submit" onClick={submit} disabled={loading}>
          {loading ? 'Placing Order...' : `🎉 Place Order — Rs.${total.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════ MAIN APP ═══════════════════════════ */

export default function App() {

  /* ── Auth state — persisted in localStorage ── */
  const [user,       setUser]       = useState(() => { try { return JSON.parse(localStorage.getItem('lensora_user')); } catch { return null; } });
  const [token,      setToken]      = useState(() => localStorage.getItem('lensora_token') || '');
  const [authOpen,   setAuthOpen]   = useState(false);
  const [userDrawer, setUserDrawer] = useState(false);
  const [userDrawerTab, setUserDrawerTab] = useState('profile');

  /* ── Cart ── */
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* ── Wishlist ── */
  const [wishlist, setWishlist] = useState([]);
  const [wishOpen, setWishOpen] = useState(false);

  /* ── Order Details Modal ── */
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  /* ── UI ── */
  const [toast,      setToast]      = useState({ show:false, msg:'' });
  const [activeNav,  setActiveNav]  = useState('Eyeglasses');
  const [activeTab,  setActiveTab]  = useState('All');
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const shopRef = useRef(null);

  /* ── Toast ── */
  const showToast = (msg) => { setToast({ show:true, msg }); setTimeout(() => setToast({ show:false, msg:'' }), 2400); };

  /* ── Auth ── */
  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    showToast(`Welcome back, ${userData.name}! 👋`);
  };
  const handleLogout = () => {
    localStorage.removeItem('lensora_token');
    localStorage.removeItem('lensora_user');
    setUser(null);
    setToken('');
    showToast('Signed out successfully.');
  };

  /* ── Cart ── */
  // Auto-removes item from wishlist when added to cart
  const addToCart = (p) => {
    setCart(prev => [...prev, p]);
    setWishlist(prev => prev.filter(w => w.id !== p.id)); // ← auto-remove from wishlist
    showToast(`${p.name} added to cart!`);
  };
  const removeFromCart = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const cartTotal      = cart.reduce((sum, p) => sum + p.price, 0);

  /* ── Checkout — open order details modal ── */
  const handleCheckoutClick = () => {
    if (!user || !token) { showToast('Please sign in to place an order!'); setCartOpen(false); setAuthOpen(true); return; }
    if (cart.length === 0) return;
    setCartOpen(false);
    setOrderModalOpen(true);
  };

  /* ── Called by OrderModal after user fills details ── */
  const placeOrder = async (deliveryDetails) => {
    // Snapshot cart NOW before any state changes
    const cartSnapshot  = cart.map(p => ({ productId: String(p.id), name: p.name, price: p.price, quantity: 1 }));
    const totalSnapshot = cartTotal;

    try {
      const res = await fetch(`${API}/orders/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartSnapshot,
          totalAmount: totalSnapshot,
          deliveryDetails
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Order save failed:', res.status, err);
      } else {
        console.log('✅ Order saved to DB');
      }
    } catch (err) {
      console.error('Order network error:', err.message);
    }
    // Clear cart regardless — user already sees success screen
    setCart([]);
  };

  /* ── Wishlist ── */
  const toggleWishlist = (p) => {
    const exists = wishlist.find(w => w.id === p.id);
    if (exists) { setWishlist(prev => prev.filter(w => w.id !== p.id)); showToast('Removed from Wishlist'); }
    else        { setWishlist(prev => [...prev, p]); showToast(`${p.name} added to Wishlist! ❤️`); }
  };

  /* ── Filter products ── */
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.style.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === 'All'      ? true :
      activeTab === 'Trending' ? ['BESTSELLER','TRENDING','NEW'].includes(p.badge) :
      p.category === activeTab;
    return matchesSearch && matchesTab;
  });

  /* ─────────────────────────── RENDER ─────────────────────────── */
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
            <input placeholder="Search frames, brands, shapes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="nav-actions">

            {/* Sign In / User button */}
            {user ? (
              <button className="nav-btn user-logged-in" onClick={() => setUserDrawer(true)}>
                <div className="nav-user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button className="nav-btn" onClick={() => setAuthOpen(true)}>
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Sign In
              </button>
            )}

            {/* Wishlist */}
            <button className="nav-btn" onClick={() => setWishOpen(true)} style={{ position:'relative' }}>
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
              Wishlist
            </button>

            {/* Cart */}
            <button className="nav-btn" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              Cart
            </button>
          </div>
        </div>
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <button key={l} className={`nav-link ${activeNav === l ? 'active' : ''}`} onClick={() => setActiveNav(l)}>{l}</button>
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
            <div key={i} className="cat-item"><div className="cat-icon">{emoji}</div><span className="cat-label">{label}</span></div>
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
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} onWishlist={toggleWishlist} isWished={!!wishlist.find(w => w.id === p.id)} />
          ))}
          {filteredProducts.length === 0 && (
            <p style={{ textAlign:'center', color:'var(--muted)', gridColumn:'1/-1', padding:'30px' }}>No products found for "{searchTerm}"</p>
          )}
        </div>
        <div style={{ textAlign:'center', marginTop:'32px' }}>
          <button className="btn btn-teal">View All Products</button>
        </div>
      </section>

      {/* PROMO */}
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
            <div key={i} className="shape-item"><div className="shape-box">{emoji}</div><span className="shape-label">{label}</span></div>
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
        <div className="sec-header"><div className="sec-tag">Top Brands</div><h2 className="sec-title">Shop by Brand</h2></div>
        <div className="brands-row">{BRANDS.map((b, i) => <div key={i} className="brand-pill">{b}</div>)}</div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section gray-bg">
        <div className="sec-header"><div className="sec-tag">Customer Love</div><h2 className="sec-title">What Our Customers Say</h2></div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="test-quote">"{t.quote}"</p>
              <div className="test-author">
                <div className="test-avatar">{t.init}</div>
                <div><div className="test-name">{t.name}</div><div className="test-loc">{t.loc}</div></div>
              </div>
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
        ) : <p className="nl-success">Rs.500 coupon sent to {email}!</p>}
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <a className="logo" href="#">Lens<span>ora</span></a>
            <p className="footer-desc">India's leading online eyewear destination. Premium frames, certified lenses, and free delivery to your door.</p>
            <div className="footer-socials">{['📘','📸','🐦','▶️'].map((s, i) => <div key={i} className="social-icon">{s}</div>)}</div>
          </div>
          <div className="footer-col"><h4>Shop</h4>{['Eyeglasses','Sunglasses','Computer','Kids','Contact Lens','Reading'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}</div>
          <div className="footer-col"><h4>Company</h4>{['About Us','Blog','Careers','Press','Store Locator'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}</div>
          <div className="footer-col"><h4>Support</h4>{['Track Order','Lens Guide','Returns','Warranty','Contact Us'].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}</div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">2025 Lensora. All rights reserved.</span>
          <div className="pay-methods">{['VISA','MC','UPI','PayTM','GPay'].map(p => <span key={p} className="pay-badge">{p}</span>)}</div>
        </div>
      </footer>

      {/* ═══ WISHLIST DRAWER ═══ */}
      <div className={`cart-overlay ${wishOpen ? 'open' : ''}`} onClick={() => setWishOpen(false)} />
      <div className={`cart-drawer ${wishOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">❤️ My Wishlist ({wishlist.length})</span>
          <button className="cart-close" onClick={() => setWishOpen(false)}>✕</button>
        </div>
        {wishlist.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🤍</div>
            <p style={{ fontWeight:700, fontSize:15, color:'#0a1628', marginBottom:6 }}>Your wishlist is empty</p>
            <p>Tap the heart on any product to save it!</p>
          </div>
        ) : (
          <>
            {wishlist.map((item, i) => (
              <div key={i} className="cart-item">
                <div className="cart-item-img"><img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} /></div>
                <div style={{ flex:1 }}>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">Rs.{item.price.toLocaleString()}</div>
                  <button onClick={() => { addToCart(item); setWishOpen(false); }}
                    style={{ marginTop:6, background:'var(--teal)', color:'#fff', border:'none', padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    Add to Cart
                  </button>
                </div>
                <button className="cart-item-remove" onClick={() => toggleWishlist(item)}>🗑️</button>
              </div>
            ))}
            <div style={{ marginTop:16 }}>
              <button className="checkout-btn" onClick={() => { wishlist.forEach(p => addToCart(p)); setWishlist([]); setWishOpen(false); }}>
                Add All to Cart 🛒
              </button>
            </div>
          </>
        )}
      </div>

      {/* ═══ CART DRAWER ═══ */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">My Cart ({cart.length})</span>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
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
                <div className="cart-item-img"><img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} /></div>
                <div><div className="cart-item-name">{item.name}</div><div className="cart-item-price">Rs.{item.price.toLocaleString()}</div></div>
                <button className="cart-item-remove" onClick={() => removeFromCart(i)}>🗑️</button>
              </div>
            ))}
            <div className="cart-total-row"><span>Total</span><span>Rs.{cartTotal.toLocaleString()}</span></div>
            {!user && <p style={{ fontSize:12, color:'#e63946', textAlign:'center', margin:'8px 0' }}>⚠️ Sign in to place your order</p>}
            <button className="checkout-btn" onClick={handleCheckoutClick}>
              {user ? '✅ Proceed to Checkout' : '🔐 Sign In & Checkout'}
            </button>
          </>
        )}
      </div>

      {/* ═══ AUTH MODAL ═══ */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onLogin={handleLogin} />}

      {/* ═══ ORDER DETAILS MODAL ═══ */}
      {orderModalOpen && (
        <OrderModal
          onClose={() => { setOrderModalOpen(false); }}
          onConfirm={placeOrder}
          cart={cart}
          total={cartTotal}
          user={user}
          onViewOrders={() => { setOrderModalOpen(false); setUserDrawerTab('orders'); setUserDrawer(true); }}
        />
      )}

      {/* ═══ USER ACCOUNT DRAWER ═══ */}
      <UserDrawer open={userDrawer} onClose={() => setUserDrawer(false)} user={user} token={token} onLogout={handleLogout} initialTab={userDrawerTab} />

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>

      {/* AI CHATBOT */}
      <Chatbot />
    </>
  );
}