"use client";

import type {
  FormEvent,
  ReactNode,
} from "react";
import { useFormStatus } from "react-dom";

import {
  rowsFromBulkFormData,
  type BulkPerformanceRow,
} from "@/lib/performance-bulk";

type ServerAction = (
  formData: FormData,
) => void | Promise<void>;

function comparable(row: BulkPerformanceRow | undefined) {
  if (!row) return "";

  return JSON.stringify([
    row.performance_date,
    row.venue_name,
    row.session_type,
    row.event_name,
    row.play_title,
    row.last_show_title,
    row.night_show_title,
    row.has_first_part,
    row.is_public,
  ]);
}

export function BulkPerformanceForm({
  action,
  initialRows,
  children,
}: {
  action: ServerAction;
  initialRows: BulkPerformanceRow[];
  children: ReactNode;
}) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    const formData = new FormData(event.currentTarget);

    let currentRows: BulkPerformanceRow[];

    try {
      currentRows = rowsFromBulkFormData(formData);
    } catch (error) {
      event.preventDefault();
      window.alert(
        error instanceof Error
          ? error.message
          : "入力内容を確認してください。",
      );
      return;
    }

    const initialMap = new Map(
      initialRows.map((row) => [
        row.performance_date,
        row,
      ]),
    );

    const changedCount = currentRows.filter(
      (row) =>
        comparable(row) !==
        comparable(initialMap.get(row.performance_date)),
    ).length;

    if (changedCount === 0) {
      event.preventDefault();
      window.alert("保存する変更はありません。");
      return;
    }

    const ok = window.confirm(
      `${changedCount}日分を変更します。\n保存してよろしいですか？`,
    );

    if (!ok) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

export function ConfirmForm({
  action,
  message,
  children,
  style,
}: {
  action: ServerAction;
  message: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      style={style}
    >
      {children}
    </form>
  );
}

export function PendingButton({
  children,
  pendingLabel,
  disabled = false,
  danger = false,
}: {
  children: ReactNode;
  pendingLabel: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      style={{
        padding: "12px 16px",
        border: danger
          ? "1px solid #8b493f"
          : "1px solid #d9ad3d",
        background: danger
          ? "transparent"
          : "#d9ad3d",
        color: danger
          ? "#e08072"
          : "#080706",
        fontWeight: 800,
        cursor:
          pending || disabled
            ? "not-allowed"
            : "pointer",
        opacity:
          pending || disabled ? 0.55 : 1,
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
