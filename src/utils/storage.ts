import { equals, mergeDeepRight as mergeDeep } from 'ramda';
import { parse, stringify } from 'superjson';
import { z } from 'zod';

import { type DeepPartial, type Settings } from './types';

const defineMeta = <TShape>(meta: {
    schema: z.ZodType<TShape, z.ZodTypeDef, TShape>;
    default: TShape;
}) => {
    return meta;
};

const storageMeta = {
    settings: defineMeta<Settings>({
        schema: z.object({
            preset: z.enum(['beginner', 'intermediate', 'expert', 'evil']),
            startDirective: z.enum(['none', 'empty', 'numberOrEmpty']),
        }),
        default: {
            preset: 'beginner',
            startDirective: 'empty',
        },
    }),
};

function get<TKey extends keyof typeof storageMeta>(
    key: TKey,
): z.infer<(typeof storageMeta)[TKey]['schema']> {
    // TODO: handle this better, if we change the schema and the user still has old schema this will fail
    const raw = localStorage.getItem(key);
    const meta = storageMeta[key];

    if (!raw) {
        return meta.default;
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

    return parsed.data;
}

function set<
    TKey extends keyof typeof storageMeta, //
>(key: TKey, value: DeepPartial<z.infer<(typeof storageMeta)[TKey]['schema']>>): void {
    const meta = storageMeta[key];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const after = mergeDeep(get(key) ?? {}, value);
    // @ts-expect-error safe
    if (equals(meta.default, after) as boolean) {
        console.log('removing', key);
        localStorage.removeItem(key);
        return;
    }

    localStorage.setItem(key, stringify(after));
}

export const storage = { get, set };
