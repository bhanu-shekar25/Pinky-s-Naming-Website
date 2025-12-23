import { Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-6 mt-12 text-center text-foreground/50 text-sm">
            <p className="flex items-center justify-center gap-1">
                Made with <Heart className="w-3 h-3 text-pink-deep fill-pink-deep" /> for Pinky
            </p>
        </footer>
    );
}
