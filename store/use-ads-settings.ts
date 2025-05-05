import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdsSettingsState {
  showAds: boolean
  isPremium: boolean
  toggleAds: () => void
  setPremium: (value: boolean) => void
}

export const useAdsSettings = create<AdsSettingsState>()(
  persist(
    (set) => ({
      showAds: true,
      isPremium: false,
      toggleAds: () => set((state) => ({ showAds: !state.showAds })),
      setPremium: (value: boolean) => set({ isPremium: value, showAds: value ? false : true }),
    }),
    {
      name: "ads-settings",
    },
  ),
)
