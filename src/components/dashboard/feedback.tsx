'use client'

import { FaRegSmileBeam } from "react-icons/fa";
import { FaRegSmile } from "react-icons/fa";
import { FaRegSadTear } from "react-icons/fa";
import { FaRegSadCry } from "react-icons/fa";

import { useRef, useEffect, useState } from "react";
import { Button } from "../hexta-ui/Button";

export default function FeedbackRating() {
    const [rating, setRating] = useState<number | null>(0);
    const [feedbackActive, setFeedbackActive] = useState(false);
    const node = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedbackActive === true) {
            const handleClickOutside = (e: MouseEvent) => {
                if (node.current && !node.current.contains(e.target as Node)) {
                    setFeedbackActive(false);
                    setRating(null);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [feedbackActive]);

    return (
        <>
            <div
                ref={node}
                className={`flex gap-4 bg-zinc-950 px-6 py-3 rounded-md border-b border-b-white border-opacity-10   items-start transition-all duration-[0.3s] ease-in-out overflow-hidden  flex-col max-[315px]:scale-95  ${feedbackActive ? " max-[374px]:h-[16rem] h-[13rem]" : "h-[3.5rem]"
                    } ${feedbackActive ? "w-[19rem] max-[374px]:w-[15rem] " : "w-[12.3rem] "
                    } ${feedbackActive ? "max-[374px]:justify-center" : "justify-end"}`}
            >
                <div className="w-full">
                    <textarea
                        className="w-full h-[8rem] p-2 bg-zinc-950 rounded-md border border-white border-opacity-10 resize-none -mb-1 text-white focus:outline-none focus:border-opacity-50 text-sm"
                        placeholder="Your feedback..."
                    />
                </div>
                <div
                    className={`flex justify-between w-full ${feedbackActive && "max-[374px]:flex-col"
                        } ${feedbackActive ? "gap-4" : "gap-8"}`}
                >
                    <div
                        className={`flex items-center ${feedbackActive && "justify-center"
                            } gap-4`}
                    >
                        <button
                            onClick={() => {
                                setRating(4);
                                setFeedbackActive(true);
                            }}
                            className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                        >
                            <FaRegSmileBeam
                                size={25}
                                className={`${rating === 4 ? "opacity-100" : "opacity-50"}`}
                                fill={`${rating === 4 ? "lightgreen" : "white"}`}
                            />
                        </button>
                        <button
                            onClick={() => {
                                setRating(3);
                                setFeedbackActive(true);
                            }}
                            className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                        >
                            <FaRegSmile
                                size={25}
                                className={`${rating === 3 ? "opacity-100" : "opacity-50"}`}
                                fill={`${rating === 3 ? "white" : "white"}`}
                            />
                        </button>
                        <button
                            onClick={() => {
                                setRating(2);
                                setFeedbackActive(true);
                            }}
                            className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                        >
                            <FaRegSadTear
                                size={25}
                                className={`${rating === 2 ? "opacity-100" : "opacity-50"}`}
                                fill={`${rating === 2 ? "orange" : "white"}`}
                            />
                        </button>
                        <button
                            onClick={() => {
                                setRating(1);
                                setFeedbackActive(true);
                            }}
                            className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                        >
                            <FaRegSadCry
                                size={25}
                                className={`${rating === 1 ? "opacity-100" : "opacity-50"}`}
                                fill={`${rating === 1 ? "red" : "white"}`}
                            />
                        </button>
                    </div>
                    <div>
                        <Button className="text-sm px-2 py-1 max-[374px]:w-full max-[374px]:py-2 flex items-center justify-center">
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};