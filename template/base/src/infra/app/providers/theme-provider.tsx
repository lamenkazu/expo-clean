import { preferencesStorage } from '@infra/data/local/storage/preferences.storage';
import {
  type AppThemeMode,
  type AppThemeName,
  DEFAULT_THEME_NAME,
  isAppThemeName,
} from '@infra/shared/theme/theme';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

const MODE_KEY = 'theme-mode';
const THEME_KEY = 'theme-name';

// "system" segue o aparelho. As variantes dark: do NativeWind leem o mesmo Appearance.
export type ThemeModePreference = AppThemeMode | 'system';

const isModePreference = (value: string | null): value is ThemeModePreference =>
  value === 'light' || value === 'dark' || value === 'system';

const applyAppearance = (preference: ThemeModePreference) => {
  Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
};

type ThemeContextValue = {
  mode: AppThemeMode;
  modePreference: ThemeModePreference;
  themeName: AppThemeName;
  isHydrated: boolean;
  setModePreference: (preference: ThemeModePreference) => Promise<void>;
  setThemeName: (themeName: AppThemeName) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [modePreference, setModePreferenceState] = useState<ThemeModePreference>('system');
  const [themeName, setThemeNameState] = useState<AppThemeName>(DEFAULT_THEME_NAME);
  const [isHydrated, setIsHydrated] = useState(false);

  const mode: AppThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const [storedMode, storedTheme] = await Promise.all([
        preferencesStorage.get(MODE_KEY),
        preferencesStorage.get(THEME_KEY),
      ]);

      if (!isMounted) {
        return;
      }

      if (isModePreference(storedMode)) {
        setModePreferenceState(storedMode);
        applyAppearance(storedMode);
      }

      if (isAppThemeName(storedTheme)) {
        setThemeNameState(storedTheme);
      }

      setIsHydrated(true);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const setModePreference = useCallback(async (preference: ThemeModePreference) => {
    setModePreferenceState(preference);
    applyAppearance(preference);
    await preferencesStorage.set(MODE_KEY, preference);
  }, []);

  const setThemeName = useCallback(async (nextTheme: AppThemeName) => {
    setThemeNameState(nextTheme);
    await preferencesStorage.set(THEME_KEY, nextTheme);
  }, []);

  const value = useMemo(
    () => ({ mode, modePreference, themeName, isHydrated, setModePreference, setThemeName }),
    [isHydrated, mode, modePreference, setModePreference, setThemeName, themeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider.');
  }

  return context;
};
