import { readFileSync } from 'fs';
import { resolve } from 'path';
import { isUnknownDict } from 'utils';

import { strToChangelog, strToSectionName, strToVersion } from './parser';

const mockPath = resolve(__dirname, '../mock');

describe('strToChangelog()', () => {
  it('should parse', () => {
    const str = readFileSync(`${mockPath}/changelog_001.md`, 'utf-8');
    const data: unknown = JSON.parse(readFileSync(`${mockPath}/changelog_001.json`, 'utf-8'));
    if (isUnknownDict(data)) {
      expect(strToChangelog(str)).toMatchObject(data);
    }
  });
});

describe('strToSectionName()', () => {
  it('should parse', () => {
    expect(strToSectionName('### Fixed')).toBe('Fixed');
    expect(strToSectionName('###Fixed')).toBe('Fixed');
    expect(strToSectionName('## Fixed')).toBe(undefined);
  });
});

describe('strToVersion()', () => {
  it('should parse', () => {
    expect(strToVersion('## [1.57.4] - 2021-02-11')).toMatchObject({ name: '1.57.4', date: '2021-02-11' });
    expect(strToVersion('## [1.57.4]')).toMatchObject({ name: '1.57.4' });
    expect(strToVersion('##[1.57.4]')).toMatchObject({ name: '1.57.4' });
    expect(strToVersion('## [Unreleased]')).toMatchObject({ name: 'Unreleased' });
  });
});
