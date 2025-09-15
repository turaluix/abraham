import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  defaultCollapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, defaultCollapsed = false, ...props }, ref) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

    return (
      <div
        ref={ref}
        className={cn(
          "h-full min-h-screen border-r border-neutral-200 bg-white transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950",
          collapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
          {children}
        </SidebarContext.Provider>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar()
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between p-4 h-[64px]",
        collapsed ? "justify-center px-2" : "justify-between",
        className
      )}
      {...props}
    >
      {collapsed ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      ) : (
        <>
          {children}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col border-t border-neutral-200 dark:border-neutral-800 justify-between py-4 h-[calc(100vh-4rem)]",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t border-neutral-200 pt-4 dark:border-neutral-800", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav ref={ref} className={cn("space-y-1 px-4", className)} {...props} />
))
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
    icon?: React.ReactNode
  }
>(({ className, active, children, icon, ...props }, ref) => {
  const { collapsed } = useSidebar()
  
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        active && "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      {icon}
      {!collapsed && children}
    </a>
  )
})
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}>({
  collapsed: false,
  setCollapsed: () => null,
})

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar")
  }
  return context
}

const SubnavHeader = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { collapsed } = useSidebar()
  
  if (collapsed) return null

  return (
    <h4
      ref={ref}
      className={cn(
        "mb-2 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500",
        className
      )}
      {...props}
    />
  )
})
SubnavHeader.displayName = "SubnavHeader"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SubnavHeader,
  useSidebar,
} 