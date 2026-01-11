import { produce } from 'immer';
import { parse, stringify } from 'superjson';
import * as z from 'zod';

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

    let parsed;
    try {
        parsed = meta.schema.parse(parse(raw));
    } catch (error) {
        const newKey = `_${key}_error_${Math.floor(Math.random() * 1000)}`;
        console.error(
            new Error(`Failed to parse ${key} from localStorage, setting key ${newKey} as backup`, {
                cause: error,
            }),
        );
        localStorage.removeItem(key);
        localStorage.setItem(newKey, raw);
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

    localStorage.setItem(key, stringify(value));
}

function update<TKey extends keyof typeof storageMeta>(
    key: TKey,
    updater: (value: z.infer<(typeof storageMeta)[TKey]['schema']>) => void,
): void {
    set(key, produce(get(key), updater));
}

export const storage = { get, set, update };
