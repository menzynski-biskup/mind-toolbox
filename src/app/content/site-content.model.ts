export interface NavItem {
  label: string;
  path: string;
  future?: boolean;
  children?: NavItem[];
}

export interface Hero {
  title: string;
  description: string;
  meta?: string[];
}

export interface Feature {
  title: string;
  description: string;
  tag?: string;
}

export interface TableData {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface DefinitionItem {
  term: string;
  detail: string;
}

export interface Section {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  ordered?: string[];
  table?: TableData;
  callout?: string;
  features?: Feature[];
  definitions?: DefinitionItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Person {
  name: string;
  role: string;
  summary?: string;
}

export interface ContactChannel {
  label: string;
  detail: string;
  notes?: string;
}

export interface Contact {
  channels: ContactChannel[];
  escalation?: string;
  responseTime?: string;
}

export interface PageContent {
  hero: Hero;
  sections: Section[];
}

export interface SiteContent {
  nav: NavItem[];
  footer: {
    contact: Contact;
    governance: {
      title: string;
      body: string;
      meta: string;
    };
    repository: {
      label: string;
      url: string;
      license: string;
    };
  };
  pages: {
    home: PageContent;
    vision: PageContent;
    scientific: PageContent;
    clinical: PageContent;
    knowledge: PageContent;
    technology: PageContent;
    collaboration: PageContent;
    roadmap: PageContent;
    publications: PageContent;
    team: PageContent;
    contact: PageContent;
    ethics: PageContent;
  };
}
