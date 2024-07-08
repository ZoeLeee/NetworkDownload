import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Text = (props: Props) => {
  return <div className={props.className}>{props.children}</div>;
};
