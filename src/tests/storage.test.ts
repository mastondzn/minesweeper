import * as superjson from 'superjson';

// this import leaks node global types, fun
import { describe, expect, it } from 'vitest';

import { storage, storageMeta } from '~/utils/storage';

describe('storage', () => {
    it('should get', () => {
        const settings = storage.get('settings');

        expect(settings).not.toBeNull();
        expect(settings).toEqual(storageMeta.settings.default);
    });

    it('should set', () => {
        const settings = storage.get('settings');

        storage.set('settings', { preset: 'evil' });
        expect(storage.get('settings')).toEqual({ ...settings, preset: 'evil' });
    });

    it('should not set to localStorage if default', () => {
        storage.set('settings', storageMeta.settings.default);
        storage.set('settings', {
            preset: storageMeta.settings.default.preset,
        });

        expect(localStorage.getItem('settings')).toBeNull();
    });

    it('should only contain non-default values', () => {
        storage.set('settings', { preset: 'expert' });
        expect(localStorage.getItem('settings')).toEqual(superjson.stringify({ preset: 'expert' }));
    });

    it('should remove after going back to default', () => {
        storage.set('settings', { preset: 'expert' });
        expect(localStorage.getItem('settings')).not.toBeNull();

        storage.set('settings', storageMeta.settings.default);
        expect(localStorage.getItem('settings')).toBeNull();
    });

    it('should throw on invalid key', () => {
        // @ts-expect-error invalid key
        expect(() => storage.get('invalid')).toThrow();
    });

    it('should throw on invalid value', () => {
        // @ts-expect-error invalid value
        expect(() => storage.set('settings', { preset: 'invalid' })).toThrow();
    });
});

describe('storageMeta', () => {
    it('should match zod schema', () => {
        for (const key in storageMeta) {
            const meta = storageMeta[key as keyof typeof storageMeta];
            expect(() => meta.schema.parse(meta.default)).not.toThrow();
        }
    });
});
