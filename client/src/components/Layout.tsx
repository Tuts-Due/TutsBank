import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Send,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutModal } from "@/components/LogoutModal";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Transferências e Pix",
      href: "/transfer",
      icon: <Send className="w-5 h-5" />,
    },
    {
      label: "Histórico",
      href: "/history",
      icon: <History className="w-5 h-5" />,
    },
    {
      label: "Perfil",
      href: "/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-40 h-screen bg-card border-r border-border flex flex-col
          transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-primary">TutsBank</h1>
              <p className="text-xs text-muted-foreground">Seu banco moderno</p>
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg transition
                  ${active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-3">
          {!collapsed && (
            <div className="px-3 py-2 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground">Usuário</p>
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs truncate text-muted-foreground">
                {user?.email}
              </p>
            </div>
          )}

          <Button
            onClick={() => setLogoutModalOpen(true)}
            variant="outline"
            className={`w-full ${collapsed ? "justify-center" : "justify-start"} gap-2`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Bem-vindo,</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <ThemeToggle />
          </div>
        </header>


        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

   
      <LogoutModal
        open={logoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
        isLoading={isLoggingOut}
      />
    </div>
  );
}