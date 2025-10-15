/**
 * VisuallyHidden component for accessibility.
 * 
 * Hides content visually while keeping it accessible to screen readers.
 * Uses CSS positioning to remove content from visual flow without
 * affecting the accessibility tree. Useful for providing additional
 * context to assistive technologies without cluttering the visual design.
 * 
 * @component
 * @param {VisuallyHiddenProps} props - Component props
 * @param {React.ReactNode} props.children - Content to hide visually
 * @returns {JSX.Element} Span element with visually hidden content
 * 
 * @example
 * ```tsx
 * <button>
 *   <Icon name="close" />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 * ```
 */
import React from 'react';

/**
 * Props for the VisuallyHidden component.
 */
interface VisuallyHiddenProps {
  /** Content to be hidden visually but accessible to screen readers */
  children: React.ReactNode;
}

/**
 * Renders children in a visually hidden span element.
 * 
 * @param {VisuallyHiddenProps} props - Component properties
 * @returns {JSX.Element} Visually hidden span
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps): JSX.Element {
  return (
    <span
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}


