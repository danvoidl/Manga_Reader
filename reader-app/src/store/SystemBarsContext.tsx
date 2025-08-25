import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarHidden } from "expo-status-bar";

interface CtxProps {
  isSystemBarsVisible: boolean;
  toggleBars: () => void;
}

interface ProvProps {
  children: React.ReactNode;
}

export const SystemBarsContext = createContext<CtxProps>({
  isSystemBarsVisible: false,
  toggleBars: () => null,
});

export function useSystemBars() {
  const context = useContext(SystemBarsContext);

  if (!context) {
    throw new Error(
      "useSystemBars deve ser usado dentro de um SystemBarsProvider"
    );
  }

  return context;
}

export function SystemBarsProvider({ children }: ProvProps) {
  const [isSystemBarsVisible, setIsSystemBarsVisible] = useState(false);

  useEffect(() => {
    console.log("SYSTEMBARVISIBLE PROVIDER", isSystemBarsVisible);

    setStatusBarHidden(true);
    NavigationBar.setVisibilityAsync("hidden");

    return () => {
      setStatusBarHidden(false, "fade");
      NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  const toggleBars = useCallback(async () => {
    const navVisibility = await NavigationBar.getVisibilityAsync();
    const isNavVisible = navVisibility === "visible";

    if (isNavVisible) {
      setStatusBarHidden(true, "fade");
      await NavigationBar.setVisibilityAsync("hidden");
      setIsSystemBarsVisible(false);
    } else {
      setStatusBarHidden(false, "fade");
      await NavigationBar.setVisibilityAsync("visible");
      setIsSystemBarsVisible(true);
    }
  }, []);

  return (
    <SystemBarsContext value={{ isSystemBarsVisible, toggleBars }}>
      {children}
    </SystemBarsContext>
  );
}
