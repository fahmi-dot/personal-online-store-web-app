import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navLinks = [
  { to: '/admin', label: 'DASHBOARD', icon: '📊' },
  { to: '/admin/products', label: 'PRODUCTS', icon: '📦' },
  { to: '/admin/categories', label: 'CATEGORIES', icon: '🏷️' },
  { to: '/admin/orders', label: 'ORDERS', icon: '🛒' },
  { to: '/admin/users', label: 'USERS', icon: '👥' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen bg-retro-cream text-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r-2 border-black flex flex-col shrink-0 sticky top-0 h-screen z-20">
        {/* Brand Header */}
        <div className="p-6 border-b-2 border-black bg-retro-amber">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-black hover:underline mb-4"
          >
            <span>&larr;</span> STOREFRONT
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center font-extrabold text-xl shadow-[2px_2px_0px_#000]">
              P
            </div>
            <div>
              <h1 className="font-extrabold text-lg uppercase tracking-tight leading-none text-black">
                PAHMI.CO
              </h1>
              <span className="inline-block mt-1 bg-black text-white font-mono text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-1">
            // MAIN MENU
          </div>
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-2 transition-all ${
                  active
                    ? 'bg-black text-white border-black shadow-[3px_3px_0px_#ffde59]'
                    : 'bg-white text-black border-transparent hover:border-black hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Badge */}
        <div className="p-4 border-t-2 border-black bg-retro-cream">
          <div className="flex items-center gap-3 border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#000]">
            <div className="w-8 h-8 border-2 border-black bg-retro-amber flex items-center justify-center font-mono font-bold text-sm text-black">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="font-mono text-xs font-bold text-black truncate uppercase">
                {user?.username || 'ADMIN'}
              </div>
              <div className="font-mono text-[9px] font-bold text-retro-coral uppercase tracking-widest">
                ROOT_ADMIN
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
