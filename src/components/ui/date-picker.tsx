"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ selected, onChange, className }: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    selected
  );
  const [open, setOpen] = React.useState(false);

  // Sync internal state with the prop
  React.useEffect(() => {
    setInternalDate(selected);
  }, [selected]);

  const handleDateSelect = (date: Date | undefined) => {
    setInternalDate(date);
    setOpen(false);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !internalDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? (
            format(internalDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-2", className)}>
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
