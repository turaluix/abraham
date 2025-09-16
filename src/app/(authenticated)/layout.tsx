"use client";

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar, SidebarContent, SidebarHeader, SidebarNav, SidebarNavItem } from '@/components/ui/sidebar';
import { 
  User, 
  Search, 
  Upload, 
  FileText,
  BookOpen
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Documents & Search",
      href: "/search",
      icon: <Search className="h-4 w-4" />,
    },
    {
      title: "Upload",
      href: "/upload",
      icon: <Upload className="h-4 w-4" />,
    },
    {
      title: "Documentation",
      href: "/documentation",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="font-semibold">Intelligent AI</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav>
              {navItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  active={pathname === item.href}
                  icon={item.icon}
                >
                  {item.title}
                </SidebarNavItem>
              ))}
            </SidebarNav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
