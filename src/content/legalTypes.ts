export type LegalLink = {
  label: string;
  href: string;
};

export type LegalTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: LegalTable;
  paragraphsAfter?: string[];
  bulletsAfter?: string[];
  links?: LegalLink[];
};

export type PrivacyPolicyContent = {
  title: string;
  application: string;
  serviceProvider: string;
  website: string;
  privacyUrl: string;
  termsUrl: string;
  deleteAccountUrl: string;
  contactEmail: string;
  supportEmail: string;
  effectiveDate: string;
  lastUpdated: string;
  metaDescription: string;
  intro: string[];
  sections: LegalSection[];
};

export type DeleteAccountContent = {
  title: string;
  application: string;
  serviceProvider: string;
  website: string;
  privacyUrl: string;
  termsUrl: string;
  contactEmail: string;
  lastUpdated: string;
  metaDescription: string;
  intro: string[];
  sections: LegalSection[];
  form: {
    heading: string;
    emailLabel: string;
    companyLabel: string;
    detailsLabel: string;
    submit: string;
    mailtoSubject: string;
    note: string;
  };
};

export type SupportContent = {
  title: string;
  application: string;
  serviceProvider: string;
  website: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  lastUpdated: string;
  metaDescription: string;
  intro: string[];
  sections: LegalSection[];
};
