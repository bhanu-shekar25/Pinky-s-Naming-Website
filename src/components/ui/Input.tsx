import { InputHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="text-sm font-medium text-foreground/80 pl-1">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-2 text-base shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-pink-soft focus-visible:ring-2 focus-visible:ring-pink-soft/30 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
