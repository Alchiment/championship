import { Link, useLocation } from "react-router";

interface BottomNavProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function BottomNav({ isAuthenticated, isAdmin }: BottomNavProps) {
  const location = useLocation();

  const tabs = [
    { to: "/standings", label: "Tabla", icon: "📊" },
    { to: "/schedule", label: "Calendario", icon: "📅" },
    { to: "/teams", label: "Equipos", icon: "👥" },
  ];

  if (isAuthenticated && !isAdmin) {
    return (
      <nav className="fixed bottom-0 left-0 right-1 z-50 block border-t border-default bg-surface md:hidden">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.to);
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-accent" : "text-secondary hover:text-primary"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  const fourthTab = isAuthenticated && isAdmin
    ? { to: "/admin", label: "Admin", icon: "🛡️" }
    : { to: "/login", label: "Ingresar", icon: "🔑" };

  const allTabs = [...tabs, fourthTab];

  return (
    <nav className="fixed bottom-0 left-0 right-1 z-50 block border-t border-default bg-surface md:hidden">
      <div className="flex items-center justify-around">
        {allTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors ${
                isActive ? "text-accent" : "text-secondary hover:text-primary"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
