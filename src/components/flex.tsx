import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const Flex = ({ children, className = "" }: Props) => {
  return <div className={"flex " + className}>{children}</div>;
};
