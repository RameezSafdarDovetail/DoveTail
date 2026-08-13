export type QuoteStatusTone = 'pending' | 'awaiting' | 'approved';

export interface Quote {
  id: string;
  title: string;
  subtitle: string;
  product: string;
  subject: string;
  status: string;
  statusTone: QuoteStatusTone;
  date: string;
}

export const quotes: Quote[] = [
  {
    id: '#QT-0089',
    title: 'Annual Software Licence Renewal',
    subtitle: 'Re: Renewal',
    product: 'D365',
    subject: 'Renewal',
    status: 'Pending',
    statusTone: 'pending',
    date: '10 Feb',
  },
  {
    id: '#QT-0082',
    title: 'Custom Integration Package',
    subtitle: 'Re: New Build',
    product: 'Services',
    subject: 'New Build',
    status: 'Awaiting',
    statusTone: 'awaiting',
    date: '4 Feb',
  },
  {
    id: '#QT-0077',
    title: 'Support Tier Upgrade — Enterprise',
    subtitle: 'Re: Upgrade',
    product: 'Support',
    subject: 'Upgrade',
    status: 'Approved',
    statusTone: 'approved',
    date: '28 Jan',
  },
];
