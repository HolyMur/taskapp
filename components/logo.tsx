import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
    src: "../public/fonts/font.woff2"
})

const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    height={30}
                    width={30}
                />
                <p className={cn("text-lg text-neutral-700 pb-1 mt-2", headingFont.className)}>
                    КМЗ
                </p>
            </div>
        </Link>
    );
};

export default Logo;