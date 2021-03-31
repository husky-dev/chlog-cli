export interface Changelog {
  header?: string;
  versions: ChangelogVersion[];
}

export interface ChangelogVersionInfo {
  name: string;
  date?: string;
}

export interface ChangelogVersion extends ChangelogVersionInfo {
  sections: ChangelogSection[];
}

export interface ChangelogSection {
  name: string;
  items: string[];
}

export interface ChangelogGenOpt {
  header?: boolean;
  sortSections?: boolean;
  sortItems?: boolean;
}
