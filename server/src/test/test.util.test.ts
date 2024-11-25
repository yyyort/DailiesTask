import { expect, test } from 'vitest';
import { testUtil } from '../util/test.util';

test('testUtil', async() => {
    expect(await testUtil()).toBe('test');
});