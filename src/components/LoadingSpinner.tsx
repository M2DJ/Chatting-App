interface LoadingProps {
  size: "small" | "medium" | "large";
  color: string;
}

const LoadingSpinner = ({ size, color }: LoadingProps) => {
  const sizeClasses: Record<LoadingProps["size"], string> = {
    small: "h-6 w-6 border-2",
    medium: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-[#${color}] border-t-transparent rounded-full animate-spin`}
    ></div>
  );
};

export default LoadingSpinner;
