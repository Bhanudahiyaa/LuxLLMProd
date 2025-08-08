import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface WrapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  href?: string;
}

const WrapButton: React.FC<WrapButtonProps> = ({
  className,
  children,
  href,
  onClick,
  ...buttonProps
}) => {
  const Inner = (
    <div
      className={cn(
        "group cursor-pointer border border-border bg-background gap-2 h-[45px] flex items-center p-[8px] rounded-full",
        className
      )}
    >
      {/* Inner colored capsule */}
      <div className="border border-border bg-primary h-[25px] rounded-full flex items-center justify-center text-primary-foreground px-2">
        {/* Optional spinning globe for non-link version */}
        {!href && <Globe className="mr-1 animate-spin" />}
        <p className="font-medium tracking-tight flex items-center gap-1 justify-center">
          {children ?? "Get Started"}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-muted-foreground group-hover:ml-1 ease-in-out transition-all size-[26px] flex items-center justify-center rounded-full border-2 border-border">
        <ArrowRight
          size={18}
          className="group-hover:rotate-45 ease-in-out transition-all"
        />
      </div>
    </div>
  );

  // If href exists, render a Link. Otherwise, render a proper <button>.
  return href ? (
    <div className="flex items-center justify-center">
      <Link to={href}>{Inner}</Link>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        {...buttonProps}
        className="contents" // keep wrapper styles on Inner; button is transparent
        aria-label="Get started"
      >
        {Inner}
      </button>
    </div>
  );
};

export default WrapButton;
