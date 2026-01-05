export default function InlineEditableField({
  label,
  value,
  isEditing,
  onChange,
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-primary">
        {label}:
      </span>

      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            px-3 py-1 rounded-md
            bg-gray-200 text-gray-700
            text-sm
            outline-none
            focus:ring-2 focus:ring-secondary
            w-[90px]
          "
        />
      ) : (
        <span className="px-3 py-1 rounded-md bg-gray-200 text-gray-700">
          {value}
        </span>
      )}
    </div>
  );
}