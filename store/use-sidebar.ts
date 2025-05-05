import { create } from "zustand"

interface SidebarState {
  isCollapsed: boolean
  onExpand: () => void
  onCollapse: () => void
}

export const useSidebar = create<SidebarState>((set) => ({
  isCollapsed: false,
  onExpand: () => set({ isCollapsed: false }),
  onCollapse: () => set({ isCollapsed: true }),
}))
