export default function FormInput({
  id,
  label,
  required,
  defaultValue,
  fieldError,
  type,
  step,
}: {
  id: string;
  label: string;
  required?: boolean;
  defaultValue?: string | number | null | undefined;
  fieldError?: string[] | undefined;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label} {required && "(Required)"}
      </label>
      <input
        id={id}
        type={type}
        name={id}
        step={step}
        required={required}
        className="w-full rounded border p-2"
        defaultValue={defaultValue ?? undefined}
      />
      {fieldError && <p className="text-sm text-red-600">{fieldError[0]}</p>}
    </div>
  );
}
