import { useSettings } from "@/contexts/SettingsContext";
import { useTheme } from "@/hooks/useTheme";
import { X } from "lucide-react-native";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const THEMES = ["light", "dark", "gruvbox", "blue", "monochrome"];

interface SettingsProps {
  onClose: () => void;
  isOpen: boolean;
}

export function Settings({ onClose, isOpen }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const { isSimpleMode, setIsSimpleMode } = useSettings();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-background p-8 rounded-lg shadow-lg w-full max-w-md relative">
          <Text className="text-2xl font-bold mb-4">settings</Text>
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-1 rounded-full"
            aria-label="Close settings"
          >
            <X className="h-6 w-6 text-foreground" />
          </TouchableOpacity>
          <View className="space-y-6">
            <View>
              <Text className="text-lg font-medium">theme</Text>
              <Text className="text-sm text-muted-foreground">
                select a color theme for the application.
              </Text>
              <View className="flex flex-row flex-wrap gap-2 mt-2">
                {THEMES.map((themeName) => (
                  <ButtonDotlists
                    key={themeName}
                    variant={theme === themeName ? "secondary" : "outline"}
                    onPress={() => setTheme(themeName as "light" | "dark" | "gruvbox" | "blue" | "monochrome")}
                    className="capitalize"
                  >
                    <Text>{themeName}</Text>
                  </ButtonDotlists>
                ))}
              </View>
            </View>
            <View>
              <Text className="text-lg font-medium">simple mode</Text>
              <Text className="text-sm text-muted-foreground">
                hide advanced features for a cleaner interface.
              </Text>
              <View className="flex flex-row items-center space-x-2 mt-2">
                <Switch
                  value={isSimpleMode}
                  onValueChange={setIsSimpleMode}
                />
                <Label>enable simple mode</Label>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
