import React from "react";
import { Flex } from "./flex";
import { Text } from "./text";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { TResourceType } from "../types";

export type TFilter = {
  resourceTypes: TResourceType[];
  type: "Host" | "Resource";
  query: string;
};

type Props = {
  origin: string;
  filter: TFilter;
  onChange: (f: TFilter) => void;
};

export const Header = ({ origin, filter, onChange }: Props) => {
  return (
    <Flex className="items-center h-20 p-2 gap-10 border-b border-gray-300">
      <Text className="text-lg font-bold w-1/5 overflow-hidden text-ellipsis">
        {origin}
      </Text>
      <Flex className="flex-1 flex items-center h-full overflow-hidden">
        <InputText
          size="small"
          placeholder="Search host or resource"
          value={filter.query}
          className="w-7/12"
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
        />
        <Dropdown
          options={[
            { name: "Resource", value: "Resource" },
            { name: "Host", value: "Host" },
          ]}
          optionLabel="name"
          className="w-2/12"
          value={filter.type}
          onChange={(e) => onChange({ ...filter, type: e.target.value })}
        />
        <SelectButton
          optionLabel="name"
          options={[
            { name: "3D", value: "3D" },
            { name: "Image", value: "Image" },
            { name: "Media", value: "Media" },
            { name: "Other", value: "Other" },
          ]}
          className="w-3/12"
          multiple
          value={filter.resourceTypes}
          onChange={(e) => onChange({ ...filter, resourceTypes: e.value })}
        />
      </Flex>
    </Flex>
  );
};
