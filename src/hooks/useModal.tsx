import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useEscapeKey } from './useEscapeKey';

export type ModalName = 'log-case' | 'change-request' | 'case-comments';

interface ModalState {
  name: ModalName | null;
  caseNumber?: string;
}

interface ModalContextValue {
  modal: ModalState;
  openLogCase: () => void;
  openChangeRequest: (caseNumber?: string) => void;
  openCaseComments: (caseNumber?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ name: null });

  const closeModal = useCallback(() => setModal({ name: null }), []);
  const openLogCase = useCallback(() => setModal({ name: 'log-case' }), []);
  const openChangeRequest = useCallback(
    (caseNumber?: string) => setModal({ name: 'change-request', caseNumber }),
    [],
  );
  const openCaseComments = useCallback(
    (caseNumber?: string) => setModal({ name: 'case-comments', caseNumber }),
    [],
  );

  useEscapeKey(closeModal, Boolean(modal.name));

  const value = useMemo(
    () => ({ modal, openLogCase, openChangeRequest, openCaseComments, closeModal }),
    [modal, openLogCase, openChangeRequest, openCaseComments, closeModal],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
}
