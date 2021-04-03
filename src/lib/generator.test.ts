import { readFileSync } from 'fs';
import { resolve } from 'path';
import { changelogToStr, sortSectionByNameFn } from './generator';
import { Changelog, Section } from './types';

const mockPath = resolve(__dirname, '../mock');

describe('changelogToStr()', () => {
  it('should generate', () => {
    const str = readFileSync(`${mockPath}/changelog-001.md`, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const data: Changelog = JSON.parse(readFileSync(`${mockPath}/changelog-001.json`, 'utf-8')) as Changelog;
    expect(changelogToStr(data, { sortSections: false, sortItems: false, header: true })).toBe(str);
  });
});

describe('sortSectionByNameFn()', () => {
  it('should sort correctly', () => {
    const a: Section = { name: 'Added', items: [] };
    const b: Section = { name: 'Fixed', items: [] };
    expect(sortSectionByNameFn(a, b)).toBe(-1);
    expect(sortSectionByNameFn(a, a)).toBe(0);
    expect(sortSectionByNameFn(b, a)).toBe(1);
  });
});
