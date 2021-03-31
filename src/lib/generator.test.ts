import { readFileSync } from 'fs';
import { resolve } from 'path';
import { changelogToStr } from './generator';
import { Changelog } from './types';

const mockPath = resolve(__dirname, '../mock');

describe('changelogToStr()', () => {
  it('should generate', () => {
    const str = readFileSync(`${mockPath}/changelog-001.md`, 'utf-8').trim();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const data: Changelog = JSON.parse(readFileSync(`${mockPath}/changelog-001.json`, 'utf-8')) as Changelog;
    expect(changelogToStr(data, { sortSections: false, sortItems: false, header: true })).toBe(str);
  });
});
