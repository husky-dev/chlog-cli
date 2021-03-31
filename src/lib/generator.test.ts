import { readFileSync } from 'fs';
import { resolve } from 'path';
import { changelogToStr } from './generator';
import { Changelog } from './types';

const mockPath = resolve(__dirname, '../mock');

describe('changelogToStr()', () => {
  it('should generate', () => {
    const str = readFileSync(`${mockPath}/changelog_001.md`, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const data: Changelog = JSON.parse(readFileSync(`${mockPath}/changelog_001.json`, 'utf-8')) as Changelog;
    expect(changelogToStr(data, { sortSections: false, sortRecords: false })).toBe(str);
  });
});
