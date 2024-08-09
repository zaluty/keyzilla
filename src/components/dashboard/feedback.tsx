"use client";
import { FaRegSmileBeam } from "react-icons/fa";
import { FaRegSmile } from "react-icons/fa";
import { FaRegSadTear } from "react-icons/fa";
import { FaRegSadCry } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

import { toast } from "sonner";
import { Button } from "../ui/button";

export interface MenuProps {
    page?: "chat" | "analytics" | "channel";
}

export default function Feedback() {
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

    const handleFeedback = () => {
        toast.success("Thank you for your feedback!");
        setFeedbackActive(false);
    };
    const handleFeedback2 = () => {

        setFeedbackActive(false);
    };

    return (
        <>
            <Button
                onClick={() => setFeedbackActive(true)}
            >
                Feedback
            </Button>
            {feedbackActive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={node}
                        className="bg-zinc-950 p-6 rounded-md border-b border-b-white border-opacity-10 flex flex-col items-start transition-all duration-[0.3s] ease-in-out overflow-hidden w-[19rem] max-[374px]:w-[15rem]"
                    >
                        <div className="w-full">
                            <textarea
                                className="w-full h-[8rem] text-medium p-2 bg-zinc-950 rounded-md border border-white border-opacity-10 resize-none -mb-1 text-white focus:outline-none focus:border-opacity-50 text-sm"
                                placeholder="Your feedback..."


                            />
                        </div>
                        <div className="flex justify-between w-full gap-4 max-[374px]:flex-col">
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setRating(4)}
                                    className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                                >
                                    <FaRegSmileBeam
                                        size={25}
                                        className={`${rating === 4 ? "opacity-100" : "opacity-50"}`}
                                        fill={`${rating === 4 ? "lightgreen" : "white"}`}
                                    />
                                </button>
                                <button
                                    onClick={() => setRating(3)}
                                    className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                                >
                                    <FaRegSmile
                                        size={25}
                                        className={`${rating === 3 ? "opacity-100" : "opacity-50"}`}
                                        fill={`${rating === 3 ? "white" : "white"}`}
                                    />
                                </button>
                                <button
                                    onClick={() => setRating(2)}
                                    className="active:scale-[.95] hover:scale-105 transition-all duration-400"
                                >
                                    <FaRegSadTear
                                        size={25}
                                        className={`${rating === 2 ? "opacity-100" : "opacity-50"}`}
                                        fill={`${rating === 2 ? "orange" : "white"}`}
                                    />
                                </button>
                                <button
                                    onClick={() => setRating(1)}
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
                                <Button
                                    onClick={handleFeedback}
                                    disabled={rating === 0 || rating === null}
                                    className="text-sm px-2 py-1 max-[374px]:w-full max-[374px]:py-2 flex items-center justify-center"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}