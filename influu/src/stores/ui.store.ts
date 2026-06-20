import { create } from "zustand";

interface UIState {
  sidebarOpen:     boolean;
  notifPanelOpen:  boolean;
  activeModal:     string | null;

  toggleSidebar:      () => void;
  toggleNotifPanel:   () => void;
  openModal:  (id: string) => void;
  closeModal: ()           => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen:    true,
  notifPanelOpen: false,
  activeModal:    null,

  toggleSidebar:     () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleNotifPanel:  () => set((s) => ({ notifPanelOpen: !s.notifPanelOpen })),
  openModal:  (id)   => set({ activeModal: id }),
  closeModal: ()     => set({ activeModal: null }),
}));
