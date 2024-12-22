"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ListItemProps {
  category: { label: string; value: string };
  onSelect: (category: { label: string; value: string }) => void;
  isChecked: boolean;
}

export default function ListItem({
  category,
  onSelect,
  isChecked,
}: ListItemProps) {
  return (
    <div
      className="flex items-center px-2 py-2 cursor-pointer hover:bg-emerald-300"
      onClick={() => onSelect(category)}
    >
      <Check
        className={cn(
          "ml-auto mr-2 h-4 w-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
      <p className="w-full truncate text-sm whitespace-normal">
        {category.label}
      </p>
    </div>
  );
}
