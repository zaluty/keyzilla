import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";

export function BentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <CardSpotlight className="min-h-[250px] w-full">
          <StepsCard />
        </CardSpotlight>

        <CardSpotlight className="min-h-[250px] w-full">
          <NpmInstall />
        </CardSpotlight>

        <CardSpotlight className="min-h-[250px] w-full sm:col-span-2 lg:col-span-1">
          <PrivacyCard />
        </CardSpotlight>
      </div>
    </div>
  );
}

const StepsCard = () => (
  <>
    <p className="text-xl font-bold relative z-20 mt-2 text-white">
      1. Create a project
    </p>
    <div className="text-neutral-200 mt-4 relative z-20">
      Follow these steps to create a project:
      <ul className="list-none mt-2">
        <Step title="Enter your project name" />
        <Step title="Add description" />
        <Step title="Configure user access" />
        <Step title="Create your project" />
        <Step title="Add API keys" />
      </ul>
    </div>
  </>
);

const NpmInstall = () => (
  <>
    <p className="text-xl font-bold relative z-20 mt-2 text-white">
      2. Install the CLI
    </p>
    <div className="text-neutral-200 mt-4 relative z-20">
      Run the following commands in your terminal:
      <ul className="list-none mt-2">
        <Step title="npm install -g keyzilla" />
        <Step title="keyzilla login" />
        <Step title="keyzilla pull" />
        <Step title="Access your secrets" />
      </ul>
    </div>
  </>
);

const PrivacyCard = () => (
  <>
    <p className="text-xl font-bold relative z-20 mt-2 text-white">
      3. TypeScript support
    </p>
    <div className="text-neutral-200 mt-4 relative z-20">
      Everything is typesafe and secure thanks to{" "}
      <Link
        href={"https://github.com/t3-oss/t3-env"}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-500"
      >
        T3-env
      </Link>
      <ul className="list-none mt-2">
        <Step title="Type safe environment variables" />
        <Step title="Access your secrets in their specified environment" />
        <Step title="And more!" />
      </ul>
    </div>
  </>
);

const Step = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-white">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};
