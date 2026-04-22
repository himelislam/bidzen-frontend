import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  min?: Date;
  max?: Date;
  label?: string;
  required?: boolean;
  error?: string;
}

export function DateTimePicker({
  value,
  onChange,
  min,
  max,
  label,
  required = false,
  error
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    value ? value.split('T')[0] : ""
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    value ? value.split('T')[1] : "12:00"
  );

  useEffect(() => {
    if (value) {
      const [datePart, timePart] = value.split('T');
      setSelectedDate(datePart);
      setSelectedTime(timePart);
    }
  }, [value]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const dateTimeString = `${date}T${selectedTime}`;
      onChange(dateTimeString);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const dateTimeString = `${selectedDate}T${time}`;
      onChange(dateTimeString);
    }
  };

  const getMinDate = () => {
    if (min) return min.toISOString().split('T')[0];
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    if (max) return max.toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return thirtyDaysFromNow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-muted-foreground mb-2"></Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className="w-full bg-slate-950 border-white/10 text-white"
          />
        </div>

        <div>
          <Label className="text-sm text-muted-foreground mb-2 text-white">Time</Label>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full bg-slate-950 border-white/10 text-white"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Auction must end between 1 hour and 30 days from now
      </p>
    </div>
  );
}
