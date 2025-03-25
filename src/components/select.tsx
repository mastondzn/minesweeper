import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';
import { TbCheck, TbChevronDown, TbChevronUp } from 'react-icons/tb';

import { store, useGame } from '~/utils/game';
import { type PresetName, presets } from '~/utils/presets';
import { cn } from '~/utils/tailwind';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
    ref,
    className,
    children,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.Trigger> | null>;
}) {
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border-2 border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
                className,
            )}
            {...properties}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <TbChevronDown className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export function SelectScrollUpButton({
    ref: reference,
    className,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.ScrollUpButton> | null>;
}) {
    return (
        <SelectPrimitive.ScrollUpButton
            ref={reference}
            className={cn('flex cursor-default items-center justify-center', className)}
            {...properties}
        >
            <TbChevronUp className="size-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export function SelectScrollDownButton({
    ref: reference,
    className,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.ScrollDownButton> | null>;
}) {
    return (
        <SelectPrimitive.ScrollDownButton
            ref={reference}
            className={cn('flex cursor-default items-center justify-center', className)}
            {...properties}
        >
            <TbChevronDown className="size-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export function SelectContent({
    ref: reference,
    className,
    children,
    position = 'popper',
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.Content> | null>;
}) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={reference}
                className={cn(
                    'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border-2 bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    position === 'popper' &&
                        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                    className,
                )}
                position={position}
                {...properties}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        'p-1',
                        position === 'popper' &&
                            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

export function SelectLabel({
    ref: reference,
    className,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.Label> | null>;
}) {
    return (
        <SelectPrimitive.Label
            ref={reference}
            className={cn('pl-8 pr-2 text-sm font-semibold', className)}
            {...properties}
        />
    );
}
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export function SelectItem({
    ref: reference,
    className,
    children,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.Item> | null>;
}) {
    return (
        <SelectPrimitive.Item
            ref={reference}
            className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                className,
            )}
            {...properties}
        >
            <span className="absolute left-2 flex size-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <TbCheck className="size-4" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

export function SelectSeparator({
    ref: reference,
    className,
    ...properties
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
    ref?: React.RefObject<React.ComponentRef<typeof SelectPrimitive.Separator> | null>;
}) {
    return (
        <SelectPrimitive.Separator
            ref={reference}
            className={cn('-mx-1 my-1 h-px bg-muted', className)}
            {...properties}
        />
    );
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export function PresetPicker() {
    const preset = useGame((state) => state.context.settings.preset);

    return (
        <Select
            value={preset}
            onValueChange={(value) => {
                store.send({ type: 'choosePreset', preset: value as PresetName });
            }}
        >
            <SelectTrigger className="w-[270px]" aria-label="Change minesweeper preset">
                <SelectValue placeholder="Change preset" />
            </SelectTrigger>
            <SelectContent aria-label="Choose Preset">
                <SelectGroup>
                    {presets.list.map((preset) => {
                        return (
                            <SelectItem key={preset.name} value={preset.name}>
                                {preset.stylized}
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
