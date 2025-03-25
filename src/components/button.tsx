import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { TbBrandGithub, TbMoon, TbSun } from 'react-icons/tb';

import { useTheme } from './theme-provider';
import { cn } from '~/utils/tailwind';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProperties
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export function Button({
    ref,
    className,
    variant,
    size,
    asChild = false,
    ...properties
}: ButtonProperties & { ref?: React.RefObject<HTMLButtonElement | null> }) {
    const Comp = asChild ? Slot : 'button';
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...properties}
        />
    );
}
Button.displayName = 'Button';

export function BottomButtons() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="flex flex-row gap-2">
            <Button variant="outline" className="size-fit rounded-full border-2 p-3" asChild>
                <a
                    href="https://github.com/mastondzn/minesweeper"
                    target="_blank"
                    aria-label="Go to GitHub"
                    rel="noreferrer"
                >
                    <TbBrandGithub className="size-6" />
                </a>
            </Button>
            <Button
                variant="outline"
                className="size-fit rounded-full border-2 p-3"
                onClick={setTheme.bind(null, theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <TbMoon className="size-6" /> : <TbSun className="size-6" />}
            </Button>
        </div>
    );
}
