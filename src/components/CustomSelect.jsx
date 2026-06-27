import { ChevronDown, Check } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";

const CustomSelect = ({ label, value, onValueChange, options }) => {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>

      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger className="radix-select-trigger">
          <SelectPrimitive.Value placeholder={`All ${label.toLowerCase()}`} />
          <SelectPrimitive.Icon className="radix-select-icon">
            <ChevronDown size={16} strokeWidth={2} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="radix-select-content"
            position="popper"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="radix-select-viewport">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="radix-select-item"
                >
                  <SelectPrimitive.ItemText className="radix-select-item-text">
                    {opt.label}
                  </SelectPrimitive.ItemText>

                  <SelectPrimitive.ItemIndicator className="radix-select-item-indicator">
                    <Check size={14} strokeWidth={2.5} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};

export default CustomSelect;
