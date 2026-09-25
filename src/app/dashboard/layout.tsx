'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: string;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/clients', label: 'Clientes & Agenda', icon: 'cake', badge: 'IA' },
  { href: '/dashboard/media', label: 'Biblioteca de Mídia', icon: 'photo_library' },
  { href: '/dashboard/posts', label: 'Editor de Post', icon: 'auto_awesome', badge: 'PRO' },
  { href: '/dashboard/calendar', label: 'Calendário Editorial', icon: 'calendar_today' },
  { href: '/dashboard/ai', label: 'BelezaIA Assist', icon: 'psychology', pulse: true },
  { href: '/dashboard/metrics', label: 'Métricas & Relatórios', icon: 'insights' },
  { href: '/dashboard/guia', label: 'Guia de Uso', icon: 'menu_book', badge: 'NOVO' },
  { href: '/dashboard/settings', label: 'Configurações', icon: 'settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [activeBranch, setActiveBranch] = useState('Barão Geraldo • Campinas');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          // Fallback user matching Stitch specs
          setUser({
            userId: '1',
            name: 'Camila Rocha',
            email: 'camila@belezapura.com.br',
            role: 'Gestora',
          });
        }
      })
      .catch(() => {
        setUser({
          userId: '1',
          name: 'Camila Rocha',
          email: 'camila@belezapura.com.br',
          role: 'Gestora',
        });
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/dashboard/metrics') return pathname === '/dashboard/metrics';
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Luxury Sidebar Desktop & Mobile */}
      <aside
        className={`fixed left-0 top-0 h-full w-80 bg-surface-container-lowest/95 backdrop-blur-xl z-50 flex flex-col justify-between py-space-lg px-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-5">
          {/* Brand Header: Logo ampliado em 20% para excelente legibilidade */}
          <div className="relative flex items-center justify-center w-full px-1 pt-2 pb-2">
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <img
                src="/logo.png"
                alt="Pura Vitrine - Marketing para Salões"
                className="w-full max-w-[312px] h-auto max-h-[175px] object-contain transition-transform hover:scale-105"
              />
            </Link>
            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-0 top-1 lg:hidden text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
              aria-label="Fechar menu"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_4px_14px_rgba(200,138,133,0.2)]'
                      : 'text-on-surface-variant text-[15px] font-medium hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        item.icon === 'auto_awesome' ? 'text-secondary' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[15px] font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.pulse && (
                    <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col gap-space-sm pt-space-md border-t border-outline-variant/20">
          {/* Instagram Status */}
          <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                  Instagram Conectado
                </span>
              </div>
              <span className="material-symbols-outlined text-xs text-primary">verified</span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-bold text-primary truncate">salaobelezapuracampinas</span>
              <span className="text-on-surface-variant font-medium text-[11px]">14.2k</span>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0yoGKbmCkm6wxKj1WT4tg2VNqXAolR3dMNsBkNSWEZy9X2PFYIO3ZdoE2W8suuSCvn2vggZbRajYNG_lVwGkAjvXecd8cLFNZRfMrLUTxYTjBRv4OgW7bI1uHc5G_6-u_91sVQoJ940u5AV9UG4K21q9ax_Nzskr-bKfeAga9zjg_Ws0Abo_RTGNvzyOPBZezf_JdGkyyen8hMNPb0TT8Zyl8KzCJB-MDoE6RQORU9skIQeGFED0aRQ"
                alt="Profile Camila Rocha"
                className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-primary/20"
              />
              <div className="flex flex-col text-left">
                <span className="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">
                  {user?.name || 'Camila Rocha'}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  {user?.role || 'Gestora'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sair"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-80 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-80 right-0 h-20 bg-surface/85 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-20 w-full px-space-md lg:px-space-lg flex items-center justify-between gap-space-md">
            {/* Left Header info */}
            <div className="flex items-center gap-space-md">
              {/* Mobile Menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container-high transition-colors"
                aria-label="Abrir Menu"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>

              <div className="lg:hidden flex items-center gap-space-xs">
                <Link href="/dashboard">
                  <img
                    src="/logo.png"
                    alt="Pura Vitrine"
                    className="h-[53px] w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Instagram handle pill */}
              <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  @salaobelezapuracampinas
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold ml-1">
                  14.2k seguidores
                </span>
              </div>

              {/* Branch unit badge */}
              <div className="hidden xl:flex items-center gap-1.5 text-on-surface-variant bg-surface-container-lowest px-space-sm py-1.5 rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <span className="material-symbols-outlined text-sm text-primary">storefront</span>
                <span className="font-label-md text-label-md">Unidade Barão Geraldo • Campinas</span>
              </div>
            </div>

            {/* Right Header action tools */}
            <div className="flex items-center gap-space-sm">
              <Link
                href="/dashboard/posts"
                className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-full bg-primary-container text-on-primary-container font-title-md text-title-md shadow-[0_4px_14px_rgba(200,138,133,0.3)] hover:opacity-95 transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-lg text-secondary-container">
                  edit_square
                </span>
                <span className="hidden sm:inline font-semibold">Criar Novo Post</span>
              </Link>

              <button
                aria-label="Notificações"
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></span>
              </button>

              <div className="flex items-center gap-space-xs pl-space-xs">
                <img
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0yoGKbmCkm6wxKj1WT4tg2VNqXAolR3dMNsBkNSWEZy9X2PFYIO3ZdoE2W8suuSCvn2vggZbRajYNG_lVwGkAjvXecd8cLFNZRfMrLUTxYTjBRv4OgW7bI1uHc5G_6-u_91sVQoJ940u5AV9UG4K21q9ax_Nzskr-bKfeAga9zjg_Ws0Abo_RTGNvzyOPBZezf_JdGkyyen8hMNPb0TT8Zyl8KzCJB-MDoE6RQORU9skIQeGFED0aRQ"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-label-lg text-label-lg text-on-surface leading-tight font-semibold">
                    {user?.name || 'Camila Rocha'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    {user?.role || 'Gestora'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Routed Page Content (pt-28 guarantees no overlap from the 80px fixed header) */}
        <main className="w-full pt-28 pb-16 bg-surface flex-1 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>

      {/* Floating Action Button on Mobile */}
      <Link
        href="/dashboard/posts"
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_12px_32px_-4px_rgba(36,33,36,0.18)] z-50 hover:scale-105 active:scale-95 transition-all"
        aria-label="Criar Novo Post"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </div>
  );
}
