export interface Changelog {
  header?: string;
  versions: Version[];
}

export interface VersionData {
  name: string;
  date?: string;
}

export interface Version extends VersionData {
  sections: Section[];
}

export interface Section {
  name: string;
  items: string[];
}

export type SectionType = 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
