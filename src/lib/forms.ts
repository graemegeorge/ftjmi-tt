import type { FieldErrors, FieldValues, Path } from "react-hook-form";

export function getFieldError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  name: Path<TFieldValues>
) {
  const error = errors[name];
  return typeof error?.message === "string" ? error.message : null;
}
