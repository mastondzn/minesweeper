import * as React from 'react';

import { cn } from '~/utils/classnames';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative overflow-auto ">
            <table
                ref={ref}
                className={cn(
                    'border-separate border-spacing-0 overflow-hidden rounded-md border text-sm',
                    className,
                )}
                {...props}
            />
        </div>
    ),
);

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tbody ref={ref} className={className} {...props} />);

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => <tr ref={ref} className={className} {...props} />,
);

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn(
            'h-12 w-12 border text-center align-middle text-lg font-extrabold transition-colors hover:bg-muted/30',
            className,
        )}
        {...props}
    />
));

export { Table, TableBody, TableRow, TableCell };
