import { type ClassValue, clsx } from 'clsx';
import { createTwc, type TwcComponentProps } from 'react-twc';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const twx = createTwc({ compose: cn });

export type TwxComponentProps<TComponent extends React.ElementType> = TwcComponentProps<
    TComponent,
    typeof cn
>;
