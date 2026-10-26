import { useEffect, useRef, useId } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';
export function Dialog({
  title,
  children,
  onClose,
  wide = false,
  open = true,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  open?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current;
    if (!open) {
      dialog?.close();
      return;
    }
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={'dialog ' + (wide ? 'dialog-wide' : '')}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Cerrar ventana">
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
