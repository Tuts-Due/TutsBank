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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Transferência",
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

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      setLogoutModalOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden ${
          sidebarOpen ? "block animate-fadeInUp" : "hidden"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-card border-r border-border transition-transform duration-300 ease-out flex flex-col overflow-hidden z-40 animate-slideInLeft`}
      >
        <div className="p-6 border-b border-border animate-fadeInDown">
          <h1 className="text-2xl font-bold text-primary">TutsBank</h1>
          <p className="text-sm text-muted-foreground mt-1">Seu banco moderno</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href);
                closeSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-secondary"
              }`}
              style={{
                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4 animate-fadeInUp">
          <div className="px-4 py-3 bg-secondary rounded-lg hover:shadow-md transition-shadow">
            <p className="text-xs text-muted-foreground">Usuário</p>
            <p className="font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>

          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive border-destructive/20 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between animate-fadeInDown">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden lg:block flex-1" />

          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs md:text-sm text-muted-foreground">Bem-vindo,</p>
              <p className="text-sm md:text-base font-semibold text-foreground truncate max-w-[150px]">
                {user?.name}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto animate-fadeInUp">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <LogoutModal
        open={logoutModalOpen}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}