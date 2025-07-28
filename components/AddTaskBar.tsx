// src/components/AddTaskBar.tsx
import { useTheme } from "@/hooks/useTheme";
import clsx from "clsx";
import { Plus } from "lucide-react";
import "../app/global.css";
import { ButtonDotlists } from "./ui/button";

interface AddTaskBarProps {
  handleAddItem: () => void;
}

export function AddTaskBar({ handleAddItem }: AddTaskBarProps) {
  const { theme } = useTheme();

  return (
    <div className="px-4 py-2">
      <ButtonDotlists
        onClick={handleAddItem}
        variant="outline"
        className={clsx(
          "w-full justify-start",
          theme === "blue" && "bg-blue-500 text-white hover:bg-blue-600"
        )}
      >
        <Plus className="h-4 w-4 mr-2" />
        add new task
      </ButtonDotlists>
    </div>
  );
}
