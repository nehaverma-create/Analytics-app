import React from "react";
import { ChevronDown, Check } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";

const CustomSelect = ({ label, value, onValueChange, options }) => {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>

      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger className="radix-select-trigger">
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <ChevronDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="radix-select-content"
            position="popper"
            side="bottom"
            align="center"
            sideOffset={5}
          >
            <SelectPrimitive.Viewport>
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  className="radix-select-item"
                >
                  <div className="radix-select-item-content">
                    <SelectPrimitive.ItemText>
                      {opt.label}
                    </SelectPrimitive.ItemText>

                    <SelectPrimitive.ItemIndicator>
                      <Check />
                    </SelectPrimitive.ItemIndicator>
                  </div>
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










// when user select value: onvalueChange
//viewport:scrollable area jha option dikhte hai
//portal:dropdown ko body ke bhr render krta hai