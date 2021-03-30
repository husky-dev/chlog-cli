export interface Changelog {
  versions: ChangelogVersion[];
}

export interface ChangelogVersion {
  name: string;
  date: string;
  sections: ChangelogSection[];
}

export interface ChangelogSection {
  name: string;
  items: string[];
}
