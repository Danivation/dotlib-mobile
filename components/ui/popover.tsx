import React, { useState, createContext, useContext } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';

const PopoverContext = createContext({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
});

function Popover({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useContext(PopoverContext);
  return <TouchableOpacity onPress={() => setIsOpen(true)}>{children}</TouchableOpacity>;
}

function PopoverContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const { isOpen, setIsOpen } = useContext(PopoverContext);
  return (
    <Modal
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsOpen(false)} activeOpacity={1}>
        <View className={`bg-popover text-popover-foreground rounded-md border p-4 shadow-md ${className}`}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export { Popover, PopoverTrigger, PopoverContent };