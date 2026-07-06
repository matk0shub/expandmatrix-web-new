'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import clsx from 'clsx';

import ScrambleTextInteractive from './ScrambleTextInteractive';

export type ScrambleTextProps = ComponentProps<typeof ScrambleTextInteractive>;

const normalizeLines = (props: ScrambleTextProps) => {
  if (props.line1 || props.line2 || props.line3 || props.line4) {
    return [props.line1, props.line2, props.line3, props.line4];
  }
  return props.text ? [props.text] : [];
};

export default function ScrambleText(props: ScrambleTextProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (props.applyScramble && isMounted) {
    return <ScrambleTextInteractive {...props} />;
  }

  const lines = normalizeLines(props);

  if (lines.length <= 1) {
    return <span className={props.className}>{props.text ?? lines[0] ?? ''}</span>;
  }

  return (
    <span className={clsx('inline-flex flex-col', props.className)}>
      {lines.map(
        (line, index) =>
          line && (
            <span key={index} className="block">
              {line}
            </span>
          ),
      )}
    </span>
  );
}
