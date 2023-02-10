import { EditorView } from 'codemirror';
import { useCallback, useEffect, useState } from 'react';
import { EditorState } from '@codemirror/state';

function useCodeMirror(state: EditorState) {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: state,
      parent: element,
    });

    return () => view?.destroy();
  }, [element]);

  return { ref };
}

export default useCodeMirror;
