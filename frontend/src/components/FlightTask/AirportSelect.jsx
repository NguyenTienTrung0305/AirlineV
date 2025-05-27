import React from "react";
import airportsData from "@/data/airport_data.json";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

export default function AirportSelect({ placeholder, value, onChange }) {
  return (
    // value={value} => Đây là giá trị hiện tại được chọn
      // Nếu value là undefined hoặc "", thì SelectValue sẽ hiện placeholder
    // khi click 1 item => value của item sẽ có giá trị => value của SelectItem được ánh xạ đến value của Select
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="text-sm font-bold w-full border-none shadow-none outline-none">
        <SelectValue placeholder={placeholder || "Chọn điểm"} />
      </SelectTrigger>
      <SelectContent>
        {airportsData.map((region) => (
          <SelectGroup key={region.region}>
            <SelectLabel>{region.region}</SelectLabel>
            {region.airports.map((airport) => (
              <SelectItem key={airport.code} value={airport.code + " " + airport.city}>
                {airport.city} ({airport.code})
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}