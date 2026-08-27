"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "disabled"
> & {
  pendingLabel: ReactNode;
};

export function AdminSubmitButton({
  children,
  pendingLabel,
  style,
  ...props
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending}
      aria-busy={pending}
      style={{
        ...style,
        opacity: pending ? 0.6 : style?.opacity,
        cursor: pending ? "wait" : style?.cursor,
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
