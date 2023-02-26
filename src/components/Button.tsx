import React from "react";

interface Props {
  suffix?: React.ReactElement;
  prefix?: React.ReactElement;
}

export default function Button({
  children,
  suffix,
  prefix,
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="flex items-center rounded-lg bg-white/10 p-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      {...props}
    >
      {prefix ? <div className="mr-2">{prefix}</div> : null}
      {children}
      {suffix ? <div className="ml-2">{suffix}</div> : null}
    </button>
  );
}
