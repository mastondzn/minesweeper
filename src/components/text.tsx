import * as React from 'react';

import { cn } from '~/utils/tailwind';

export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h1
            ref={ref}
            className={cn('scroll-m-20 text-3xl font-extrabold lg:text-3xl', className)}
            {...props}
        />
    ),
);

export const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn(
                'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className,
            )}
            {...props}
        />
    ),
);
