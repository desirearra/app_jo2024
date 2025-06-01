// Accordion Shadcn UI basé sur Radix UI
// https://ui.shadcn.com/docs/components/accordion

import { cn } from '@/lib/utils';
import * as RadixAccordion from '@radix-ui/react-accordion';
import * as React from 'react';

export const Accordion = RadixAccordion.Root;
export const AccordionItem = RadixAccordion.Item;

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Header asChild>
    <RadixAccordion.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between py-4 font-medium transition-all hover:underline',
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </RadixAccordion.Trigger>
  </RadixAccordion.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ className, children, ...props }, ref) => (
  <RadixAccordion.Content
    ref={ref}
    className={cn(
      'overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
      className
    )}
    {...props}
  >
    <div className="pt-0 pb-4">{children}</div>
  </RadixAccordion.Content>
));
AccordionContent.displayName = 'AccordionContent';
