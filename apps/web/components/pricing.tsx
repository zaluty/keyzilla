"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

interface PricingTabProps {
  yearly: boolean;
  popular?: boolean;
  planName: string;
  NoFeatures?: string[];
  price: {
    monthly: number;
    yearly: number;
  };
  planDescription: string;
  features: string[];
}

function PricingTab(props: PricingTabProps) {
  const { NoFeatures = [] } = props; // Default value for NoFeatures

  return (
    <div className={`h-full ${props.popular ? "dark" : ""}`}>
      <div className="relative flex flex-col h-full p-6 rounded-2xl bg-card dark:bg-card border border-border dark:border-border shadow shadow-ring/5">
        {props.popular && (
          <div className="absolute top-0 right-0 mr-6 -mt-4">
            <div className="inline-flex items-center text-xs font-semibold py-1.5 px-3 bg-primary text-primary-foreground rounded-full shadow-sm shadow-ring/5">
              Most Popular
            </div>
          </div>
        )}
        <div className="mb-5">
          <div className="text-foreground dark:text-foreground font-semibold mb-1">
            {props.planName}
          </div>
          <div className="inline-flex items-baseline mb-2">
            <span className="text-foreground dark:text-foreground font-bold text-3xl">
              $
            </span>
            <span className="text-foreground dark:text-foreground font-bold text-4xl">
              {props.yearly ? props.price.yearly : props.price.monthly}
            </span>
            <span className="text-muted-foreground font-medium">/mo</span>
          </div>
          <div className="text-sm text-muted-foreground mb-5">
            {props.planDescription}
          </div>
          <a
            className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-primary px-3.5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm shadow-ring/10 hover:bg-primary focus-visible:outline-none focus-visible:ring focus-visible:ring-ring dark:focus-visible:ring-ring transition-colors duration-150"
            href="#0"
          >
            Purchase Plan
          </a>
        </div>
        <div className="text-foreground dark:text-foreground font-medium mb-3">
          Includes:
        </div>
        <ul className="text-muted-foreground dark:text-muted-foreground text-sm space-y-3 grow">
          {props.features.map((feature, index) => {
            return (
              <li key={index} className="flex items-center">
                <Check className="w-4 h-4 text-green-800  mr-3 shrink-0" />
                <span>{feature}</span>
              </li>
            );
          })}
          {NoFeatures.map((f, i) => {
            return (
              <li key={i} className="flex items-center">
                <X className="w-4 h-4 text-red-800  mr-3 shrink-0" />
                <span>{f}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  return (
    <div>
      {/* Pricing toggle */}
      <div className="flex justify-center max-w-[14rem] m-auto mb-8 lg:mb-16">
        <div className="relative flex w-full p-1 bg-card dark:bg-card rounded-full">
          <span
            className="absolute inset-0 m-1 pointer-events-none"
            aria-hidden="true"
          >
            <span
              className={`absolute inset-0 w-1/2 bg-primary rounded-full shadow-sm shadow-ring/10 transform transition-transform duration-150 ease-in-out ${isAnnual ? "translate-x-0" : "translate-x-full"}`}
            ></span>
          </span>
          <button
            className={`relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-ring dark:focus-visible:ring-ring transition-colors duration-150 ease-in-out ${isAnnual ? "text-primary-foreground" : "text-muted-foreground"}`}
            onClick={() => setIsAnnual(true)}
            aria-pressed={isAnnual}
          >
            Yearly{" "}
            <span
              className={`${isAnnual ? "text-primary-foreground" : "text-muted-foreground"}`}
            >
              -20%
            </span>
          </button>
          <button
            className={`relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-ring dark:focus-visible:ring-ring transition-colors duration-150 ease-in-out ${isAnnual ? "text-muted-foreground" : "text-primary-foreground"}`}
            onClick={() => setIsAnnual(false)}
            aria-pressed={isAnnual}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto grid gap-6 lg:grid-cols-2 items-start lg:max-w-[700px]">
        {/* Pricing tab 1 */}

        {/* Pricing tab 1 */}
        <PricingTab
          yearly={isAnnual}
          popular={false}
          planName="Individual"
          price={{ yearly: 0, monthly: 0 }}
          planDescription="Free forever"
          features={["Unlimited  Projects and api keys "]}
          NoFeatures={["0 Organizations "]}
        />

        {/* Pricing tab 2 */}
        <PricingTab
          yearly={isAnnual}
          popular
          planName="Teams"
          price={{ yearly: 9, monthly: 10 }}
          planDescription="Deliviring good product costs..."
          features={["Everyting in Free Tier ", "Unlimited Organizations "]}
        />
      </div>
    </div>
  );
}
