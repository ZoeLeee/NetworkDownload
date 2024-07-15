import React, { useEffect } from "react";
import { TResource } from "../types";

type Props = { item: TResource };

export const WasmViewer = (props: Props) => {
  useEffect(() => {
    (async () => {})();
  }, [props.item.url]);

  return <div>WasmViewer</div>;
};
