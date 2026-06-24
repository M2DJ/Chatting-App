interface LoadingProps {
  size: "small" | "medium" | "large" | "xl";
  color: string;
}

const LoadingSpinner = ({
  size = "medium",
  color = 'border-black',
}: LoadingProps) => {
  const sizeClasses: Record<LoadingProps["size"], string> = {
    small: "h-6 w-6 border-2",
    medium: "h-10 w-10 border-3",
    large: "h-16 w-16 border-4",
    xl: "h-24 w-24 border-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color} border-r-transparent rounded-full animate-spin [animation-timing-function:ease-in-out]`}
    />
  );
};

export default LoadingSpinner;
