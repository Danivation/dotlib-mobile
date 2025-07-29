import React, { useState, createContext, useContext } from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { cn } from "@/lib/utils"

const DropdownMenuContext = createContext({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
});

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useContext(DropdownMenuContext);
  const child = React.Children.only(children)
  return React.cloneElement(child as React.ReactElement, {
    onPress: () => setIsOpen(true),
  });
}

function DropdownMenuContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  return (
    <Modal
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
      animationType="fade"
    >
      <TouchableOpacity className="flex-1" onPress={() => setIsOpen(false)} activeOpacity={1}>
        <View className={cn("bg-popover text-popover-foreground rounded-md border p-1 shadow-md m-4", className)}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function DropdownMenuItem({ children, onSelect, className, ...props }: { children: React.ReactNode, onSelect?: (event: any) => void, className?: string, [key: string]: any }) {
    const { setIsOpen } = useContext(DropdownMenuContext);
    return (
        <TouchableOpacity onPress={(e) => { if(onSelect) onSelect(e); setIsOpen(false); }} className={cn("flex-row items-center p-2", className)} {...props}>
            {children}
        </TouchableOpacity>
    )
}

const DropdownMenuSeparator = () => <View className="bg-border h-px my-1" />;
const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;
const DropdownMenuSubTrigger = ({ children }: { children: React.ReactNode }) => <View className="flex-row items-center justify-between p-2">{children}</View>;
const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => <View className="pl-4">{children}</View>;
const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <View>{children}</View>;
const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => <Text className={cn("p-2 font-semibold", className)}>{children}</Text>;
const DropdownMenuShortcut = ({ children, className }: { children: React.ReactNode, className?: string }) => <Text className={cn("text-muted-foreground ml-auto", className)}>{children}</Text>;

// Dummy components for compatibility
const DropdownMenuCheckboxItem = (props: any) => <DropdownMenuItem {...props} />;
const DropdownMenuRadioGroup = ({ children }: any) => <View>{children}</View>;
const DropdownMenuRadioItem = (props: any) => <DropdownMenuItem {...props} />;


export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};
