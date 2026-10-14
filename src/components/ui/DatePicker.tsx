'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/styles';

export interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showTime?: boolean;
  timeIntervals?: number;
  minDate?: Date;
  maxDate?: Date;
  showMonthYearDropdowns?: boolean;
  className?: string;
  inputClassName?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const baseInputClasses =
  'w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 pl-10 text-sm text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export function DatePicker({
  value = '',
  onChange,
  placeholder = 'Select date...',
  showTime = false,
  minDate,
  maxDate,
  className,
  inputClassName,
  label,
  required,
  disabled,
}: DatePickerProps) {
  const minString = minDate
    ? showTime
      ? minDate.toISOString().slice(0, 16)
      : minDate.toISOString().slice(0, 10)
    : undefined;

  const maxString = maxDate
    ? showTime
      ? maxDate.toISOString().slice(0, 16)
      : maxDate.toISOString().slice(0, 10)
    : undefined;

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="mb-2 block text-xs font-medium text-zinc-400">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none z-10" />
        <input
          type={showTime ? 'datetime-local' : 'date'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={minString}
          max={maxString}
          required={required}
          disabled={disabled}
          className={cn(baseInputClasses, inputClassName)}
        />
      </div>
    </div>
  );
}
