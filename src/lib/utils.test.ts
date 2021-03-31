/* eslint-disable max-len */
import { Version, Changelog } from './types';
import { getSectionsWithVersion, mergeVersionsSections } from './utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const mockPath = resolve(__dirname, '../mock');

describe('getSectionsWithVersion()', () => {
  it('shoud return correct data', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const data: Changelog = JSON.parse(readFileSync(`${mockPath}/changelog-001.json`, 'utf-8')) as Changelog;
    expect(getSectionsWithVersion(data, '1.57')).toMatchObject([
      {
        name: 'Added',
        items: [
          '[APP-1048: Add ability to assign volunteer to multiple recurring events](https://circleof.atlassian.net/browse/APP-1048)',
          '[APP-1237: Allow to invite team members](https://circleof.atlassian.net/browse/APP-1237)',
          '[APP-300: Infosec:  Encrypt sensitive information or PII  phone](https://circleof.atlassian.net/browse/APP-300)',
          '[APP-629: Add reminders for tasks and events](https://circleof.atlassian.net/browse/APP-629)',
          '[APP-742: Add ability to leave team for FnF role](https://circleof.atlassian.net/browse/APP-742)',
          '[APP-890: [Public Teams] Add a home screen card to encourage a visit to organizational team](https://circleof.atlassian.net/browse/APP-890)',
          '[PLAT-189: Add recurrence for activties](https://circleof.atlassian.net/browse/PLAT-189)',
          '[PLAT-192: Enable mention for Posts](https://circleof.atlassian.net/browse/PLAT-192)',
          '[PLAT-193: Post created notifications. Add In-app notification component](https://circleof.atlassian.net/browse/PLAT-193)',
        ],
      },
      { name: 'Changed', items: ['[PLAT-183: Remove Twilio Chat](https://circleof.atlassian.net/browse/PLAT-183)'] },
      {
        name: 'Fixed',
        items: [
          'Chat fixes',
          'Chat: various chat bug fixes',
          `[APP-1079: [Inactivity Problem] Token expires if user haven't used the app for a while, but app is unaware and it hangs/doesn't function](https://circleof.atlassian.net/browse/APP-1079)`,
          `[APP-1182: [Admin Pages] Editing images for already created company doesn't work](https://circleof.atlassian.net/browse/APP-1182)`,
          '[APP-972: [Multiple Volunteers] iPhone 8: After swiping on a task the "Unassign Volunteer" it barely fits](https://circleof.atlassian.net/browse/APP-972)',
        ],
      },
    ]);
    expect(getSectionsWithVersion(data, '2')).toMatchObject([]);
  });
});

describe('mergeVersionsSections()', () => {
  it('should return correct data', () => {
    const c1: Version = {
      name: 'v1',
      sections: [
        { name: 'Added', items: ['Added 001'] },
        { name: 'Fixed', items: ['Fixed 001'] },
      ],
    };
    const c2: Version = {
      name: 'v2',
      sections: [
        { name: 'Added', items: ['Added 002'] },
        { name: 'Fixed', items: ['Fixed 002'] },
      ],
    };
    expect(mergeVersionsSections([c1, c2])).toMatchObject([
      { name: 'Added', items: ['Added 001', 'Added 002'] },
      { name: 'Fixed', items: ['Fixed 001', 'Fixed 002'] },
    ]);
  });
});
