import { useEffect, useCallback } from 'react';

type KeyboardShortcut = {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  callback: () => void;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const metaOrCtrl = shortcut.metaKey || shortcut.ctrlKey;
        const isMetaOrCtrlPressed = event.metaKey || event.ctrlKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!metaOrCtrl || isMetaOrCtrlPressed)
        ) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
