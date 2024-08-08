import { isDeepEqual, mergeDeep } from 'remeda';
import * as superjson from 'superjson';
import { z } from 'zod';

import type { DeepPartial } from './types';

function defineMeta<TSchema extends z.AnyZodObject>(meta: {
    schema: TSchema;
    default: z.infer<TSchema>;
}) {
    return meta;
}

export const storageMeta = {
    settings: defineMeta({
        schema: z.object({
            preset: z.enum(['beginner', 'intermediate', 'expert', 'evil']),
            startDirective: z.enum(['none', 'empty', 'numberOrEmpty']),
        }),
        default: {
            preset: 'beginner',
            startDirective: 'empty',
        },
    }),
} as const;

export type Settings = z.infer<typeof storageMeta.settings.schema>;

function get<TKey extends keyof typeof storageMeta>(
    key: TKey,
): z.infer<(typeof storageMeta)[TKey]['schema']>;

function get<TKey extends keyof typeof storageMeta>(
    key: TKey,
    withDefaults: false,
): DeepPartial<z.infer<(typeof storageMeta)[TKey]['schema']>> | null;

function get<TKey extends keyof typeof storageMeta>(
    key: TKey,
    withDefaults?: false,
):
    | z.infer<(typeof storageMeta)[TKey]['schema']>
    | DeepPartial<z.infer<(typeof storageMeta)[TKey]['schema']>>
    | null {
    // TODO: handle this better, if we change the schema and the user still has old schema this will fail
    const raw = localStorage.getItem(key);
    const meta = storageMeta[key];
    const schema = withDefaults === false ? meta.schema.deepPartial() : meta.schema;

    if (!raw) return withDefaults === false ? null : meta.default;

    let parsed: z.infer<typeof schema>;
    try {
        parsed = schema.parse(
            withDefaults === false
                ? superjson.parse(raw)
                : mergeDeep(meta.default, superjson.parse<Record<string, unknown>>(raw)),
        );
    } catch (error) {
        console.warn(error);
        throw new Error(`Failed to json parse ${key} from localStorage, (value: ${raw})`);
    }

    // @ts-expect-error safe, we know it's a valid schema
    return parsed;
}

function set<TKey extends keyof typeof storageMeta>(
    key: TKey,
    value: DeepPartial<z.infer<(typeof storageMeta)[TKey]['schema']>>,
): void {
    const meta = storageMeta[key];
    const schema = meta.schema.deepPartial();

    const after = mergeDeep(get(key, false) ?? {}, value);

    if (!schema.safeParse(after).success) throw new Error(`Failed to validate ${key} with schema`);

    // @ts-expect-error safe we know it's a valid schema
    if (isDeepEqual(meta.default, mergeDeep(meta.default, after))) {
        localStorage.removeItem(key);
        return;
    }

    localStorage.setItem(key, superjson.stringify(after));
}

export const storage = { get, set };
