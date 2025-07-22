export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  onClick,
  type = "button"
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white hover:scale-105",
    success: "bg-green-500 hover:bg-green-600 text-white hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      className={`rounded-xl font-semibold transition-all shadow ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 