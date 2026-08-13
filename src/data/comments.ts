export interface CaseComment {
  id: string;
  email: string;
  stamp: string;
  subject: string;
  detail: string;
}

export const initialComments: CaseComment[] = [
  {
    id: 'c1',
    email: 'byron.campbell-cowan@valuelogistics.co.za',
    stamp: '2026-06-11 09:15',
    subject: 'Initial update',
    detail: 'Issue reproduced in Production. Awaiting latest log extract from operations.',
  },
];
