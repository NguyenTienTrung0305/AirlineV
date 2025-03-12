import { useState } from "react";
import { MdSearch, MdOutlineDateRange, MdLocationOn } from "react-icons/md";
import {
  FaLocationArrow,
  FaCalendarCheck,
  FaExchangeAlt,
} from "react-icons/fa";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import AirportSelect from "./AirportSelect";
import useFlightSearch from "@/hooks/useFlightSearch";

import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";
import { CustomCalendar } from "../ui/calender";
import { RadioGroup, RadioGroupItem } from "../ui/radio";
const SearchFlightForm = ({ onSearch }) => {
  // data hook
  const {
    fromAirport, setFromAirport,
    toAirport, setToAirport,
    departureDate, setDepartureDate,
    returnDate, setReturnDate,
    tripType, setTripType,
    swapAirports,
    isValid,
  } = useFlightSearch();

  // handle click search
  const handleSearch = () => {
    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // dữ liệu được mặc định đóng gói vào object data => rồi truyền qua onSearch bên FlightBookingTabs, onSeach này chính là handleSearch bên FlightBookingTabs
    onSearch({
      fromAirport,
      toAirport,
      departureDate: departureDate?.toISOString(),
      returnDate: tripType === 'roundTrip' ? returnDate?.toISOString() : null,
      tripType,
      passengerCount
    })
  }



  const gridTemplate =
    tripType === "roundTrip"
      ? "lg:grid-cols-[1fr,auto,1fr,1fr,1fr,0.7fr]" // Vé khứ hồi có 6 cột
      : "lg:grid-cols-[1fr,0.7fr,1fr,1fr,0.7fr]"; // Vé một chiều có 5 cột


  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const passengerCount = adultCount + childCount;


  return (
    <>
      <div className="bg-white relative z-40 w-full rounded-lg">
        <div className={`grid ${gridTemplate} grid-cols-1 items-center gap-2`}>

          {/* Start from */}
          <div className="flex items-center relative pl-4 py-7">
            <MdLocationOn className="text-orange text-4xl" />
            <span className="flex-col items-center ml-4 w-full lg:w-auto">
              <p className="flex px-3 font-semibold text-gray">Departure</p>
              {/*Chọn khu vực */}
              <AirportSelect
                placeholder="Choose a location"
                value={fromAirport}
                onChange={setFromAirport}
              />
            </span>
          </div>

          {/* swap */}
          <div className="flex items-center justify-center py-7 relative">
            <button
              type="button"
              onClick={swapAirports}
              className="text-orange hover:text-black"
            >
              <FaExchangeAlt size={25} />
            </button>
          </div>

          {/* Trường "To" */}
          <div className="flex items-center relative ml-4 pl-4 py-7">
            <FaLocationArrow className="text-orange text-4xl" />
            <span className="flex-col items-center ml-4 w-full lg:w-auto">
              <p className="flex px-3 font-semibold text-gray">Destination</p>
              <AirportSelect
                placeholder="Choose destination"
                value={toAirport}
                onChange={setToAirport}
              />
            </span>
          </div>

          {/* Trường "Ngày đi" */}
          <div className="flex items-center relative pl-4 py-7 border-l-green-950 border-l">
            <MdOutlineDateRange className="text-orange text-4xl" />
            <span className="flex flex-col justify-center h-full absolute left-16 right-2">
              <p className="text-gray font-semibold">
                Select travels date
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-sm font-bold w-full justify-start text-left border-none">
                    {departureDate ? format(departureDate, "dd/MM/yyyy") : "Select travels date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-lg">
                  <CustomCalendar
                    markerPreDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                    markerNextDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    className="border-none shadow-none"
                  />
                </PopoverContent>
              </Popover>
            </span>
          </div>

          {/* Trường "Ngày về" (nếu là khứ hồi) */}
          {tripType === "roundTrip" && (
            <div className="flex items-center relative pl-4 py-7">
              <FaCalendarCheck className="text-orange text-4xl" />
              <span className="flex flex-col justify-center h-full absolute left-16 right-2">
                <p className="text-gray font-semibold">
                  Select your return date
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm font-bold w-full justify-start text-left border-none">
                      {returnDate ? format(returnDate, "dd/MM/yyyy") : "Select your return date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-lg">
                    <CustomCalendar
                      markerPreDate={departureDate}
                      markerNextDate={
                        departureDate
                          ? (() => {
                            const nextDate = new Date(departureDate)
                            nextDate.setMonth(nextDate.getMonth() + 2)
                            return nextDate
                          })() // Thêm () để gọi hàm ngay lập tức
                          : new Date()
                      }
                      selected={returnDate}
                      onSelect={setReturnDate}
                      className="border-none shadow-none"
                    />
                  </PopoverContent>
                </Popover>

              </span>
            </div>
          )}


          {/* Nút tìm kiếm */}
          <Button
            variant="default"
            className="bg-orange h-full text-xl [&_svg]:size-6 lg:py-0 py-6"
            onClick={handleSearch}
          >
            <MdSearch />
            Tìm chuyến
          </Button>
        </div>



        {/* footer search form*/}
        <div className="md:mt-2 mt-6 p-4 flex flex-col md:flex-row items-start gap-4">
          <RadioGroup
            value={tripType}
            onValueChange={setTripType}
            className="flex gap-4 gap-x-5 flex-wrap"
            color="cyan"
          >
            <div className="flex items-center">
              <RadioGroupItem value="roundTrip" id="roundTrip" />
              <label
                htmlFor="roundTrip"
                className={`ml-2 py-2 px-4 rounded cursor-pointer ${tripType === "roundTrip"
                  ? "bg-orange text-white"
                  : "bg-gray-200"
                  }`}
              >
                Khứ hồi
              </label>
            </div>

            <div className="flex items-center">
              <RadioGroupItem value="oneWay" id="oneWay" />
              <label
                htmlFor="oneWay"
                className={`ml-2 py-2 px-4 rounded cursor-pointer ${tripType === "oneWay"
                  ? "bg-orange text-white"
                  : "bg-gray-200"
                  }`}
              >Một chiều</label>
            </div>

            <div className="flex items-center">
              <RadioGroupItem value="multiLeg" id="multiLeg" />
              <label
                htmlFor="multiLeg"
                className={`ml-2 py-2 px-4 rounded cursor-pointer ${tripType === "multiLeg"
                  ? "bg-orange text-white"
                  : "bg-gray-200"
                  }`}
              >Nhiều chặng</label>
            </div>
          </RadioGroup>

          {/* Số lượng người lớn */}
          <div className="flex items-center gap-4 w-full md:max-w-xs md:ml-5">
            <label className="flex items-center whitespace-nowrap w-1/4"> Số người lớn</label>
            <Input
              type="number"
              value={adultCount}
              onChange={(e) => setAdultCount(Math.max(1, +e.target.value))}
              className="text-base px-2 py-1 rounded-md"
              placeholder="Nhập số người lớn"
            />
          </div>

          {/* Số lượng trẻ em*/}
          <div className="flex items-center gap-4 w-full md:max-w-xs md:ml-5">
            <label className="flex items-center whitespace-nowrap w-1/4"> Số trẻ em</label>
            <Input
              type="number"
              value={childCount}
              onChange={(e) => setChildCount(Math.max(0, +e.target.value))}
              className="text-base px-2 py-1 rounded-md"
              placeholder="Nhập số người lớn"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export { SearchFlightForm }