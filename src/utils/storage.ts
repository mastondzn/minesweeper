import { equals, mergeDeepRight as mergeDeep } from 'ramda';
import { parse, stringify } from 'superjson';
import { z } from 'zod';

import { type DeepPartial, type Settings } from './types';

const defineMeta = <
    TSchema extends z.ZodType,
    TDefinable extends {
        schema: TSchema;
        default?: z.infer<TSchema>;
    },
>(
    shape: TDefinable,
) => {
    return shape;
};

const schemaForType =
    <T>() =>
    <S extends z.ZodType<T, z.ZodTypeDef, unknown>>(arg: S) => {
        return arg;
    };

const storageMeta = {
    settings: defineMeta({
        schema: schemaForType<Settings>()(
            z.object({
                preset: z.enum(['beginner', 'intermediate', 'expert', 'evil']),
                startDirective: z.enum(['none', 'empty', 'numberOrEmpty']),
            }),
        ),
        default: {
            preset: 'beginner',
            startDirective: 'empty',
        },
    }),
};

type KeysWithDefault = {
    [K in keyof typeof storageMeta]: (typeof storageMeta)[K] extends {
        default: Record<string, unknown>;
    }
        ? K
        : never;
}[keyof typeof storageMeta];

type KeysWithoutDefault = {
    [K in keyof typeof storageMeta]: (typeof storageMeta)[K] extends {
        default: Record<string, unknown>;
    }
        ? never
        : K;
}[keyof typeof storageMeta];

function get<
    TKey extends KeysWithDefault,
    TShape extends z.infer<(typeof storageMeta)[TKey]['schema']>,
>(key: TKey): TShape;
function get<
    TKey extends KeysWithoutDefault,
    TShape extends z.infer<(typeof storageMeta)[TKey]['schema']>,
>(key: TKey): TShape | null;
function get<
    TKey extends keyof typeof storageMeta,
    TShape extends z.infer<(typeof storageMeta)[TKey]['schema']>,
>(key: TKey): TShape | null {
    // TODO: handle this better, if we change the schema and the user still has old schema this will fail
    const raw = localStorage.getItem(key);
    const meta = storageMeta[key];

    if (!raw && 'default' in meta) {
        // @ts-expect-error safe
        return meta.default;
    } else if (!raw) {
        return null;
    }

    let superjsond: unknown;
    try {
        superjsond = parse(raw);
    } catch (error) {
        console.warn(error);
        throw new Error(`Failed to json parse ${key} from localStorage, (value: ${raw})`);
    }

    const parsed = storageMeta[key].schema.safeParse(superjsond);
    if (!parsed.success) {
        console.warn(parsed.error);
        throw new Error(`Failed to json parse ${key} from localStorage, (value: ${raw})`);
    }

    // @ts-expect-error safe
    return parsed.data;
}

function set<
    TKey extends keyof typeof storageMeta, //
    TShape extends z.infer<(typeof storageMeta)[TKey]['schema']>,
>(key: TKey, value: DeepPartial<TShape>): void {
    const meta = storageMeta[key];
    const before = get(key);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const after = mergeDeep(get(key) ?? {}, value);
    // @ts-expect-error safe
    if (equals(meta.default, after) as boolean) {
        console.log('removing', key);
        localStorage.removeItem(key);
        return;
    }

    console.log({ key, value, after, before });
    localStorage.setItem(key, stringify(after));
}

export const storage = { get, set };
