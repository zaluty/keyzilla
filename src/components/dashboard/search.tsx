"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { Search } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
export default function SearchModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const os = navigator.userAgent;
            if (os.includes("Mac")) {
                if (event.key === "/" && !isOpen) {
                    event.preventDefault();
                    setIsOpen(true);
                }
            } else {
                if (event.key === "/" && !isOpen) {
                    event.preventDefault();
                    setIsOpen(true);
                }
                if (event.ctrlKey && event.key === "k") {
                    event.preventDefault();
                    setIsOpen(true);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <div className="text-center" onClick={() => setIsOpen(true)}>
                <Dialog.Trigger asChild>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Search />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Search ctrl + k</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </Dialog.Trigger>
            </div>
            <Dialog.Portal>
                <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 dark:bg-black/80" />
                <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid max-h-[85vh] w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden border bg-white shadow-lg duration-200 sm:rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:shadow-gray-800">
                    <VisuallyHidden.Root>
                        <Dialog.Title>Search</Dialog.Title>
                        <Dialog.Description>
                            Start typing to search the documentation
                        </Dialog.Description>
                    </VisuallyHidden.Root>
                    <form className="border-b border-slate-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <VisuallyHidden.Root>
                                <label htmlFor="search-modal">Search</label>
                            </VisuallyHidden.Root>
                            <svg
                                className="ml-4 h-4 w-4 shrink-0 fill-slate-500 dark:fill-gray-300"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="m14.707 13.293-1.414 1.414-2.4-2.4 1.414-1.414 2.4 2.4ZM6.8 12.6A5.8 5.8 0 1 1 6.8 1a5.8 5.8 0 0 1 0 11.6Zm0-2a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
                            </svg>
                            <input
                                id="search-modal"
                                className="[&::-webkit-search-decoration]:none [&::-webkit-search-results-button]:none [&::-webkit-search-results-decoration]:none [&::-webkit-search-cancel-button]:hidden w-full appearance-none border-0 bg-white py-3 pl-2 pr-4 text-sm placeholder-slate-400 text-black focus:outline-none dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500"
                                type="search"
                                placeholder="Search"
                            />
                        </div>
                    </form>
                    <ScrollArea.Root className="max-h-[calc(85vh-44px)]">
                        <ScrollArea.Viewport className="h-full w-full">
                            <div className="space-y-4 px-2 py-4">
                                <div>
                                    <div className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
                                        Recent
                                    </div>
                                    <ul>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Alternative Schemas</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Query string parameters</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Integrations</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Organize Contacts with Tags</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
                                        Suggestions
                                    </div>
                                    <ul>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >

                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Flexbox and Grid</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>API Reference</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="flex items-center rounded-lg px-2 py-1 text-sm leading-6 text-slate-700 outline-none focus-within:bg-slate-100 hover:bg-slate-100 dark:text-gray-300 dark:focus-within:bg-gray-800 dark:hover:bg-gray-800"
                                                href="#0"
                                            >
                                                <svg
                                                    className="mr-3 h-3 w-3 shrink-0 fill-slate-400 dark:fill-gray-500"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                >
                                                    <path d="M11.953 4.29a.5.5 0 0 0-.454-.292H6.14L6.984.62A.5.5 0 0 0 6.12.173l-6 7a.5.5 0 0 0 .379.825h5.359l-.844 3.38a.5.5 0 0 0 .864.445l6-7a.5.5 0 0 0 .075-.534Z" />
                                                </svg>
                                                <span>Authentication</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar
                            className="flex h-full w-2 touch-none select-none border-l border-l-transparent p-[1px] transition-colors dark:border-l-gray-700"
                            orientation="vertical"
                        >
                            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-300 dark:bg-gray-600" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Scrollbar
                            className="flex h-2.5 touch-none select-none flex-col border-t border-t-transparent p-[1px] transition-colors dark:border-t-gray-700"
                            orientation="horizontal"
                        >
                            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-slate-300 dark:bg-gray-600" />
                        </ScrollArea.Scrollbar>
                        <ScrollArea.Corner className="bg-blackA5 dark:bg-gray-700" />
                    </ScrollArea.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}