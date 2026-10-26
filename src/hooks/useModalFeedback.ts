import { useCallback, useEffect, useRef, useState } from "react";

const SUCCESS_CLOSE_DELAY_MS = 2500;

export type ModalFeedbackTone = "success" | "error";

export function useModalFeedback(active: boolean, onClose: () => void) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<ModalFeedbackTone>("success");
  const [pendingClose, setPendingClose] = useState(false);
  const timerRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setMessage("");
    setTone("success");
    setPendingClose(false);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (active) return;
    reset();
  }, [active, reset]);

  const showError = useCallback(
    (text: string) => {
      clearTimer();
      setPendingClose(false);
      setTone("error");
      setMessage(text);
    },
    [clearTimer]
  );

  const showSuccess = useCallback(
    (text: string) => {
      clearTimer();
      setTone("success");
      setMessage(text);
      setPendingClose(true);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        onCloseRef.current();
      }, SUCCESS_CLOSE_DELAY_MS);
    },
    [clearTimer]
  );

  return { message, tone, pendingClose, reset, showError, showSuccess };
}
