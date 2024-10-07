import { cn } from "@/lib/utils";
import {
    Terminal,
    MoveHorizontal,
    DollarSign,
    Cloud,
    GitFork,
    HelpCircle,
    Settings,
    Heart,
} from "lucide-react";

export default function BentoGrid() {
    const features = [
        {
            title: "Built for developers",
            description:
                "Built for engineers, developers, dreamers, thinkers and doers .",
            icon: <Terminal />,
        },
        {
            title: "Ease of use",
            description:
                "Sign up create a project add api keys and tada.",
            icon: <MoveHorizontal />,
        },
        {
            title: "Pricing like no other",
            description:
                "Our prices are best in the market. No cap, no lock, no credit card required.",
            icon: <DollarSign />,
        },
        {
            title: "100% Uptime guarantee",
            description: "We just cannot be taken down by anyone.",
            icon: <Cloud />,
        },
        {
            title: "Multi-tenant Architecture",
            description: "You can simply share new encrypted keys  instead of  giving the original ones each generated key can be taken down anytime ",
            icon: <GitFork />,
        },
        {
            title: "24/7 Customer Support",
            description:
                "We are available a 100% of the time. Atleast our AI Agents are.",
            icon: <HelpCircle />,
        },
        {
            title: "No hype",
            description:
                "We don't use AI (yet).",
            icon: <Settings />,
        },
        {
            title: "And everything else",
            description: "I just ran out of copy ideas. Accept my sincere apologies",
            icon: <Heart />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  dark:bg-black bg-white py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-black dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-black dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
