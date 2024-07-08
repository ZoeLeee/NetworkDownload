import { ListBox } from "primereact/listbox";
import React from "react";

type Props = {
  origins: string[];
  origin: string;
  setOrigin: (origin: string) => void;
};

export const Origins = ({ origins, origin, setOrigin }: Props) => {
  return (
    <ListBox
      value={origin}
      onChange={(e) => setOrigin(e.value)}
      options={origins}
      className="w-1/4 h-full overflow-auto"
      pt={{
        item: {
          className: "whitespace-nowrap text-ellipsis",
        },
      }}
    />
  );
};
