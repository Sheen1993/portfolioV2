// Every word on the site lives here. Desktop (pinned) and mobile (snap) renders
// both read from this file, so copy only ever changes in one place.

export const profile = {
  firstName: 'Sheen',
  middleName: 'Michael',
  lastName: 'Aking',
  fullName: 'Sheen Michael Aking',
  role: 'Fullstack Developer',
  city: 'Cebu City',
  country: 'Philippines',
  timeZone: 'Asia/Manila',
  email: 'sheenaking2017.sa@gmail.com',
  phone: { display: '0977 787 0848', href: 'tel:+639777870848' },
  now: 'Software Engineer at Cody Web Development',
  oneLiner: 'Nine years shipping web apps — and keeping the old ones alive.',
} as const

/** A run of text; `mark` runs get the accent treatment inline. */
export type Run = string | { mark: string }

/**
 * About beat. The lead is split into phrases only so the scrubbed timeline can
 * light them one at a time — they render inline, so the text still wraps
 * naturally at any width.
 */
export const about = {
  years: '9',
  yearsLabel: 'years, professionally',
  lead: [
    ['I’ve spent ', { mark: '9 years' }, ' building the parts of web apps'],
    [' people only notice when they break —'],
    [' payroll dashboards, queue screens, reporting modules,'],
    [' and one Japanese storefront that kept throwing 500s.'],
  ] as Run[][],
  details: [
    {
      label: 'Day to day',
      runs: [{ mark: 'React, Next.js, Laravel, .NET Core, Python' }, ' — plus whatever the codebase already runs on.'] as Run[],
    },
    {
      label: 'Lately',
      runs: [
        { mark: 'AI-assisted development (Cursor, Claude, Gemini)' },
        ' for the legacy code nobody wants to read twice.',
      ] as Run[],
    },
  ],
}

export interface SkillGroup {
  key: string
  items: string[]
  comment?: string
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'languages',
    items: ['C#', 'PHP', 'JavaScript', 'TypeScript', 'SQL', 'Python', 'HTML5', 'CSS3'],
    comment: 'PHP: both the legacy and the modern kind',
  },
  {
    key: 'frontend',
    items: ['React', 'Angular 8', 'Vue 3', 'Tailwind CSS', 'DevExpress', 'jQuery', 'AJAX'],
  },
  {
    key: 'backend',
    items: [
      '.NET Core 3.1/5/8',
      'Node.js',
      'Laravel 6',
      'REST APIs',
      'Microservices',
      'Stored Procedures',
      'SQL Server',
      'MySQL',
      'PostgreSQL',
    ],
    comment: 'yes, stored procedures. someone has to',
  },
  {
    key: 'tooling',
    items: [
      'Docker',
      'WSL',
      'Ubuntu/Linux',
      'Git',
      'GitHub',
      'GitLab',
      'IIS',
      'SSRS',
      'PuTTY',
      'WinSCP',
      'Figma',
      'Bitbucket',
    ],
    comment: 'PuTTY + WinSCP: for the servers that predate Docker',
  },
  {
    key: 'ai',
    items: ['Cursor', 'Claude', 'Gemini'],
    comment: 'used for refactoring legacy code and accelerating delivery',
  },
]

export interface WorkItem {
  name: string
  detail: string
}

export interface Role {
  id: string
  title: string
  company: string
  period: string
  /** Year range for the timeline rail. `null` end = present. */
  years: [number, number | null]
  lede: string
  tenures?: { from: string; to: string; kind: string; start: number; end: number }[]
  work: WorkItem[]
}

export const roles: Role[] = [
  {
    id: 'cody',
    title: 'Software Engineer',
    company: 'Cody Web Development',
    period: 'Aug 2021 – Present',
    years: [2021, null],
    lede: 'Six very different products. The same job each time: make it faster, then keep it up.',
    work: [
      {
        name: 'HRIS',
        detail:
          'React frontends for employee tracking and payroll dashboards. Cut the rendering lag HR staff sat through all day.',
      },
      {
        name: 'Queue management',
        detail:
          'Real-time React frontend for a ticket queue, built to survive peak-hour spikes. Smarter routing, less lag on the wait screen.',
      },
      {
        name: 'Healthcare',
        detail:
          'Node.js + React features for web-based healthcare apps, where data privacy is a requirement, not a checkbox.',
      },
      {
        name: 'Financial reporting',
        detail:
          'Rewrote tangled SQL stored procedures and .NET APIs behind accounting modules. Faster queries, reports that reconcile.',
      },
      {
        name: 'E-commerce',
        detail:
          'Traced a Japanese storefront’s HTTP 500s down to PHP and database bottlenecks, fixed the cause, raised uptime.',
      },
      {
        name: 'Replatforming',
        detail:
          'Moved corporate marketing sites off Wix onto custom WordPress themes built from modular PHP components.',
      },
    ],
  },
  {
    id: 'evotech',
    title: 'Web Developer',
    company: 'Evotech Software Solutions',
    period: 'Oct 2016 – Feb 2019 · Mar 2021 – Oct 2025',
    years: [2016, 2025],
    lede: 'Where it started — and a team I kept coming back to.',
    tenures: [
      { from: 'Oct 2016', to: 'Feb 2019', kind: 'Full-time', start: 2016.75, end: 2019.1 },
      { from: 'Mar 2021', to: 'Oct 2025', kind: 'Part-time', start: 2021.2, end: 2025.8 },
    ],
    work: [
      {
        name: 'White-label WordPress',
        detail:
          'Branded, mobile-first sites across multiple domains with Elementor, Divi and a lot of custom CSS.',
      },
      {
        name: 'Scraping pipelines',
        detail:
          'Re-engineered Python Playwright extraction against Amazon endpoints: structured error logs, dynamic retries, more runs that finish.',
      },
      {
        name: 'Laravel 6 + Vue 3',
        detail:
          'Kept production apps healthy — refactored reactive components and REST endpoints for real-time data sync.',
      },
      {
        name: 'Testing',
        detail: 'PHPUnit coverage and cross-browser performance passes before anything shipped.',
      },
      {
        name: 'Figma → code',
        detail: 'Prototypes turned into accessible, cross-browser UI components that match the file.',
      },
    ],
  },
  {
    id: 'npax',
    title: 'Software Engineer',
    company: 'N-PAX Cebu Corporation',
    period: 'Feb 2019 – Aug 2021',
    years: [2019, 2021],
    lede: 'Factory software. Less glamorous, much less forgiving.',
    work: [
      {
        name: 'Auto PCR System',
        detail:
          'Maintained the manufacturing system; ran data housekeeping and archived legacy records until it was quick again.',
      },
      {
        name: 'Architecture docs',
        detail: 'Wrote the architecture documentation and runbooks, so new hires stopped starting from zero.',
      },
      {
        name: 'Client lead',
        detail: 'Primary technical contact for clients — ran the weekly meetings and made the calls on software.',
      },
    ],
  },
]

export interface Highlight {
  id: string
  where: string
  title: string
  body: string
  stack: string
}

export const highlights: Highlight[] = [
  {
    id: 'queue',
    where: 'Cody Web Development — queue system',
    title: 'A queue screen that holds up at rush hour.',
    body: 'Real-time React frontend for a ticketing queue, designed around peak-traffic spikes. Tighter ticket routing, and less lag between a number being called and the screen showing it.',
    stack: 'React · real-time updates',
  },
  {
    id: 'ecommerce',
    where: 'Cody Web Development — e-commerce',
    title: 'Fewer 500s on a Japanese storefront.',
    body: 'A high-traffic shop kept falling over. Instead of restarting things and hoping, I traced the HTTP 500s back to PHP and database bottlenecks and fixed those. Uptime went up and stayed up.',
    stack: 'PHP · database profiling',
  },
  {
    id: 'reporting',
    where: 'Cody Web Development — accounting',
    title: 'Reports that reconcile the first time.',
    body: 'Refactored the stored procedures and .NET APIs behind financial reporting. Queries got faster, and month-end numbers stopped needing a second pair of eyes.',
    stack: '.NET · SQL stored procedures',
  },
  {
    id: 'scraper',
    where: 'Evotech — data pipelines',
    title: 'A scraper that retries instead of dying.',
    body: 'Rebuilt Python Playwright pipelines against Amazon endpoints with structured error logging and dynamic retries. More runs finish, and the ones that don’t explain why.',
    stack: 'Python · Playwright',
  },
]

export const education = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'University of Cebu – Banilad Campus',
  place: 'Cebu City, Philippines',
  aside: 'The formal part. Everything after it was learned in production.',
} as const

export const contact = {
  heading: ['Send me', 'the slow one.'],
  body: 'Legacy PHP, a dashboard that crawls, a report nobody trusts — or something new. Email is fastest.',
} as const
