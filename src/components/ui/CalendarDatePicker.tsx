import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface CalendarDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  min?: Date;
  max?: Date;
  label?: string;
  required?: boolean;
  error?: string;
  showTimeSelect?: boolean;
  placeholder?: string;
}

export function CalendarDatePicker({
  value,
  onChange,
  min,
  max,
  label,
  required = false,
  error,
  showTimeSelect = true,
  placeholder = "Select date and time"
}: CalendarDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // Convert to ISO string
      const isoString = date.toISOString();
      onChange(isoString);
    } else {
      onChange("");
    }
  };

  const getMinDate = () => {
    if (min) return min;
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  };

  const getMaxDate = () => {
    if (max) return max;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return thirtyDaysFromNow;
  };

  // Custom input component
  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
    <div className="relative">
      <Input
        value={value ? format(new Date(value), showTimeSelect ? "MMM dd, yyyy h:mm aa" : "MMM dd, yyyy") : ""}
        onClick={onClick}
        readOnly
        placeholder={placeholder}
        className="bg-slate-950 border-white/10 text-white cursor-pointer pr-10"
      />
      <CalendarIcon
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
        size={16}
      />
    </div>
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
      )}

      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={getMinDate()}
        maxDate={getMaxDate()}
        showTimeSelect={showTimeSelect}
        timeFormat="h:mm aa"
        timeIntervals={15}
        dateFormat="MMM dd, yyyy h:mm aa"
        customInput={<CustomInput />}
        className="w-full"
        popperClassName="dark-datepicker"
        calendarClassName="dark-calendar"
        wrapperClassName="w-full"
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <p className="text-xs text-slate-400">
        {showTimeSelect
          ? "Select date and time. Auction must end between 1 hour and 30 days from now"
          : "Select date. Auction must be between 1 hour and 30 days from now"
        }
      </p>

      <style>{`
        .react-datepicker {
          background-color: rgb(30 41 59);
          border: 1px solid rgb(71 85 105);
          border-radius: 0.5rem;
          font-family: inherit;
          color: white;
        }

        .react-datepicker__header {
          background-color: rgb(51 65 85);
          border-bottom: 1px solid rgb(71 85 105);
          padding: 8px 0;
        }

        .react-datepicker__current-month {
          color: white;
          font-weight: 600;
        }

        .react-datepicker__day-name {
          color: rgb(148 163 184);
          font-weight: 500;
        }

        .react-datepicker__day {
          color: rgb(226 232 240);
          background-color: transparent;
          border-radius: 0.375rem;
          border: none;
        }

        .react-datepicker__day:hover {
          background-color: rgb(71 85 105);
          color: white;
        }

        .react-datepicker__day--selected {
          background-color: rgb(99 102 241);
          color: white;
          font-weight: 600;
        }

        .react-datepicker__day--selected:hover {
          background-color: rgb(79 70 229);
        }

        .react-datepicker__day--keyboard-selected {
          background-color: rgb(79 70 229);
          color: white;
        }

        .react-datepicker__day--outside-month {
          color: rgb(100 116 139);
        }

        .react-datepicker__day--disabled {
          color: rgb(71 85 105);
          cursor: not-allowed;
        }

        .react-datepicker__day--today {
          background-color: rgb(71 85 105);
          color: white;
          font-weight: 500;
        }

        .react-datepicker__day--today:hover {
          background-color: rgb(100 116 139);
        }

        .react-datepicker__time-container {
          background-color: rgb(30 41 59);
          border-left: 1px solid rgb(71 85 105);
        }

        .react-datepicker__time-container .react-datepicker__header {
          background-color: rgb(51 65 85);
          border-bottom: 1px solid rgb(71 85 105);
        }

        .react-datepicker__time-container .react-datepicker__header .react-datepicker__time-header {
          color: white;
          font-weight: 500;
        }

        .react-datepicker__time {
          background-color: rgb(30 41 59);
          border: none;
        }

        .react-datepicker__time-list {
          background-color: rgb(30 41 59);
          scrollbar-width: thin;
          scrollbar-color: rgb(71 85 105) transparent;
        }

        .react-datepicker__time-list::-webkit-scrollbar {
          width: 6px;
        }

        .react-datepicker__time-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb {
          background-color: rgb(71 85 105);
          border-radius: 3px;
        }

        .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
          background-color: rgb(100 116 139);
        }

        .react-datepicker__time-list-item {
          color: white;
          padding: 6px 12px;
        }

        .react-datepicker__time-list-item:hover {
          background-color: rgb(71 85 105);
          color: white;
        }

        .react-datepicker__time-list-item--selected {
          background-color: rgb(99 102 241);
          color: white;
        }

        .react-datepicker__navigation {
          color: white;
          border-top-color: white;
          border-right-color: white;
          cursor: pointer;
        }

        .react-datepicker__navigation:hover {
          background-color: rgb(71 85 105);
          border-radius: 0.25rem;
        }

        .react-datepicker__navigation--previous {
          left: 8px;
        }

        .react-datepicker__navigation--next {
          right: 8px;
        }

        .react-datepicker__triangle {
          border-bottom-color: rgb(30 41 59);
        }

        .react-datepicker__triangle::before {
          border-bottom-color: rgb(71 85 105);
        }

        .react-datepicker__month-read-view,
        .react-datepicker__year-read-view,
        .react-datepicker__month-year-read-view {
          color: white;
          background-color: rgb(51 65 85);
        }

        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__month-year-read-view--down-arrow {
          border-top-color: white;
        }

        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background-color: rgb(30 41 59);
          border: 1px solid rgb(71 85 105);
        }

        .react-datepicker__month-option,
        .react-datepicker__year-option {
          color: rgb(226 232 240);
        }

        .react-datepicker__month-option:hover,
        .react-datepicker__year-option:hover {
          background-color: rgb(71 85 105);
          color: white;
        }

        .react-datepicker__month-option--selected,
        .react-datepicker__year-option--selected {
          background-color: rgb(99 102 241);
          color: white;
        }
      `}</style>
    </div>
  );
}
