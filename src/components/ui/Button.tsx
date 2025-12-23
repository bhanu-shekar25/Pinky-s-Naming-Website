import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-pink-deep text-white hover:bg-opacity-90 shadow-md active:scale-95",
            secondary: "bg-peach text-foreground hover:bg-opacity-90 shadow-sm active:scale-95",
            outline: "border-2 border-pink-deep text-pink-deep hover:bg-pink-soft/10 active:scale-95",
            ghost: "hover:bg-black/5 text-foreground active:scale-95",
        };

        const sizes = {
            sm: "h-8 px-3 text-sm",
            md: "h-11 px-5 text-base",
            lg: "h-14 px-8 text-lg font-semibold",
            icon: "h-10 w-10 p-2 flex items-center justify-center rounded-full",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
