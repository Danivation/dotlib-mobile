// src/contexts/SettingsProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { SettingsContext } from './SettingsContextDef';

function SettingsProvider({ children }: { children: ReactNode }) {
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      let storedSimpleMode: string | null = null;
      try {
        if (Platform.OS === 'web') {
          storedSimpleMode = localStorage.getItem('simpleMode');
        } else {
          storedSimpleMode = await AsyncStorage.getItem('simpleMode');
        }
        if (storedSimpleMode !== null) {
          setIsSimpleMode(storedSimpleMode === 'true');
        }
      } catch (e) {
        console.error("Failed to load simple mode setting.", e);
      }
    };
    loadSettings();
  }, []);

  const handleSetIsSimpleMode = (isSimple: boolean) => {
    setIsSimpleMode(isSimple);
    const value = String(isSimple);
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('simpleMode', value);
      } else {
        AsyncStorage.setItem('simpleMode', value);
      }
    } catch (e) {
      console.error("Failed to save simple mode setting.", e);
    }
  };

  return (
    <SettingsContext.Provider value={{ isSimpleMode, setIsSimpleMode: handleSetIsSimpleMode }}>
      {children}
    </SettingsContext.Provider>
  );
}
export default SettingsProvider;


