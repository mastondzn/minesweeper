import { describe, expect, it } from 'vitest';

import { storage, storageMeta } from '~/utils/storage';

describe('storage', () => {
    it('should get', () => {
        const settings = storage.get('settings');

        expect(settings).not.toBeNull();
        expect(settings).toEqual(storageMeta.settings.default);
    });

    it('should set', () => {
        const initial = storage.get('settings');
        expect(initial.preset).not.toEqual('evil');

        storage.set('settings', {
            preset: 'evil',
            startDirective: 'empty',
        });
        expect(storage.get('settings')).toEqual({ preset: 'evil', startDirective: 'empty' });
    });

    it('should update', () => {
        storage.set('settings', {
            preset: 'evil',
            startDirective: 'empty',
        });
        storage.update('settings', (settings) => {
            settings.preset = 'expert';
        });
        expect(storage.get('settings').preset).toEqual('expert');
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
