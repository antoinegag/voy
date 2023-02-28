import classNames from "classnames";
import React from "react";

interface Props {
  suffix?: React.ReactElement;
  prefix?: React.ReactElement;
  bold?: boolean;
}

export default function Button({
  children,
  suffix,
  prefix,
  className,
  bold = false,
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classNames(
        "flex items-center rounded-lg bg-white/10 p-4 py-3 text-white no-underline transition hover:bg-white/20",
        { "font-semibold": bold },
        className
      )}
      {...props}
    >
      {prefix ? <div className="mr-2">{prefix}</div> : null}
      {children}
      {suffix ? <div className="ml-2">{suffix}</div> : null}
    </button>
  );
}
