import { produce } from 'immer';
import * as superjson from 'superjson';
import { z } from 'zod';

function defineMeta<TSchema extends z.ZodType>(meta: {
    schema: TSchema;
    default: z.infer<NoInfer<TSchema>>;
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
    theme: defineMeta({
        schema: z.enum(['light', 'dark']),
        default: 'dark',
    }),
} as const;

export type StorageTypes = {
    [K in keyof typeof storageMeta]: z.infer<(typeof storageMeta)[K]['schema']>;
};

export type Settings = z.infer<typeof storageMeta.settings.schema>;
export type Theme = z.infer<typeof storageMeta.theme.schema>;

function get<TKey extends keyof typeof storageMeta>(
    key: TKey,
): z.infer<(typeof storageMeta)[TKey]['schema']> {
    const raw = localStorage.getItem(key);
    const meta = storageMeta[key];

    if (!raw) {
        return meta.default;
    }

    let parsed: z.infer<(typeof storageMeta)[TKey]['schema']>;
    try {
        parsed = meta.schema.parse(superjson.parse(raw));
    } catch (error) {
        console.error(
            new Error(`Failed to parse ${key} from localStorage, (value: ${raw})`, {
                cause: error,
            }),
        );
        localStorage.removeItem(key);
        localStorage.setItem(`_${key}_error_${Math.floor(Math.random() * 1000)}`, raw);
        return meta.default;
    }

    return parsed;
}

function set<TKey extends keyof typeof storageMeta>(
    key: TKey,
    value: z.infer<(typeof storageMeta)[TKey]['schema']>,
): void {
    const meta = storageMeta[key];

    if (!meta.schema.safeParse(value).success) {
        throw new Error(`Failed to validate ${key} with schema`);
    }

    localStorage.setItem(key, superjson.stringify(value));
}

function update<TKey extends keyof typeof storageMeta>(
    key: TKey,
    updater: (value: z.infer<(typeof storageMeta)[TKey]['schema']>) => void,
): void {
    set(key, produce(get(key), updater));
}

export const storage = { get, set, update };
