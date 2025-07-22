export default function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "", 
  required = false,
  disabled = false 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:ring-2 focus:ring-primary ${className}`}
    />
  );
} 