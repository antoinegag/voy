import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { api } from "../utils/api";
import { Sport } from "@prisma/client";

interface Props {
  onChange: (sport: Sport) => void;
  selectedSport?: Sport;
}

export default function SportListBox({ selectedSport, onChange }: Props) {
  const sports = api.sports.getSports.useQuery(undefined, {
    onSuccess(data) {
      if (selectedSport == null && data[0] != null) {
        onChange(data[0]);
      }
    },
  });

  if (sports.isLoading) {
    return <Listbox value="Loading sports..."></Listbox>;
  }

  if (sports.isError) {
    return <div>Error</div>;
  }

  if (selectedSport == null) {
    return <div>Error</div>;
  }

  return (
    <div className="relative">
      <Listbox
        value={selectedSport}
        onChange={onChange}
        defaultValue={sports.data[0]}
      >
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white/20 py-2 pl-3 pr-10 text-left text-white shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900 sm:text-sm">
          <span className="block truncate font-semibold">
            {selectedSport.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-50 mt-1  max-h-60 w-full overflow-auto rounded-md bg-white bg-white/20 py-1 text-base text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {sports.data.map((sport) => (
            <Listbox.Option
              key={sport.id}
              value={sport}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active
                    ? "bg-indigo-100 font-semibold text-black"
                    : "text-gray-900"
                }`
              }
            >
              {sport.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
