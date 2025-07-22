export default function Card({ children, className = "", borderColor = "primary-light", ...props }) {
  const borderClasses = {
    "primary-light": "border-primary-light",
    "accent-teal": "border-accent-teal", 
    "accent-blue": "border-accent-blue",
    "accent-purple": "border-accent-purple"
  };

  return (
    <div className={`bg-white rounded-xl shadow-card p-8 ${className}`} {...props}>
      {children}
    </div>
  );
} 