const colorClasses = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

export default function Button({
  color = "red",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`h-3 w-3 cursor-pointer rounded-full transition-all duration-300 hover:scale-110 ${colorClasses[color]} ${className}`}
      {...props}
    />
  );
}
