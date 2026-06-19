"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Bars, Xmark } from "@gravity-ui/icons";

import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "All Prompts",
        href: "/all-prompts",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-default-100 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <Link href={'/'} className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tl from-sky-400 via-blue-500 to-indigo-600 shadow-lg">
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5 text-white"
                            fill="currentColor"
                        >
                            <path d="M12 2L13.9 8.1L20 10L13.9 11.9L12 18L10.1 11.9L4 10L10.1 8.1L12 2Z" />
                        </svg>

                        {/* Small Accent Dot */}
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300" />
                    </div>

                    {/* Brand Name */}
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-bold tracking-tight bg-linear-to-tr from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            PromptVerse
                        </span>
                    </div>
                    </Link>

                    
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-8 md:flex">
                    {navLinks.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-default-600 transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

              


                {/* Desktop Actions */}
                <div className="hidden items-center gap-4 md:flex">
                    <div className="h-5 w-px bg-indigo-900" />
                    <ThemeToggle />

                    <Link
                        href="/signin"
                        className="text-sm font-medium text-default-600 hover:text-primary"
                    >
                        Sign In
                    </Link>

                    <Button
                        as={Link}
                        href="/signup"
                        className="bg-indigo-400"
                        radius="full"
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-3 md:hidden">
                    <ThemeToggle />

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                        className="rounded-lg p-2 hover:bg-default-100"
                    >
                        {isOpen ? (
                            <Xmark width={22} height={22} />
                        ) : (
                            <Bars width={22} height={22} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-t border-default-100 md:hidden">
                    <div className="flex flex-col px-4 py-4">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="py-3 text-default-700 hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Link
                            href="/signin"
                            onClick={() => setIsOpen(false)}
                            className="py-3 text-default-700 hover:text-primary"
                        >
                            Sign In
                        </Link>
                         <div className="block lg:hidden my-4 h-px w-full bg-indigo-900" />

                        <Button
                            as={Link}
                            href="/signup"
                            color="primary"
                            className="mt-4"
                            onPress={() => setIsOpen(false)}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;