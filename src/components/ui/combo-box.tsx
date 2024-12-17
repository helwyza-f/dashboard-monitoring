"use client";

import * as React from "react";
import { Check, ChevronsUpDown, List, Search } from "lucide-react";
import ListItem from "./list-item";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  heading: string;
  className?: string;
}

export default function ComboBox({
  options,
  value,
  onChange,
  heading,
  className,
}: ComboBoxProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered, setFiltered] = React.useState<
    { label: string; value: string }[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const handleSearchTerm = (e: any) => {
    setSearchTerm(e.target.value);
    setFiltered(
      options.filter((item) =>
        item.label.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      )
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn("")}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between "
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[400px]", className)}>
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md">
            <Search className="h-4 w-4 mr-2 min-w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 w-full outline-none text-sm py-1"
              onChange={handleSearchTerm}
            />
          </div>
          <CommandList>
            <CommandGroup heading={heading}>
              {searchTerm === "" ? (
                options.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option?.value === value}
                  />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option?.value === value}
                  />
                ))
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
