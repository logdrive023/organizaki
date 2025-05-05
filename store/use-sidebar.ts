import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  isCollapsed: boolean
  onExpand: () => void
  onCollapse: () => void
  toggle: () => void
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: true, // Começa colapsado no mobile
      onExpand: () => set({ isCollapsed: false }),
      onCollapse: () => set({ isCollapsed: true }),
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-state",
    },
  ),
)
