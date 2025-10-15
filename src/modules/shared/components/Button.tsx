/**
 * Reusable button component with variant support.
 * 
 * Provides a consistent button interface across the application with
 * primary and secondary visual styles. Extends native HTML button attributes
 * and includes proper accessibility features.
 * 
 * @component
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // Secondary button
 * <Button variant="secondary" disabled>
 *   Disabled
 * </Button>
 * ```
 */
import React from 'react';

/**
 * Props for the Button component.
 * Extends native button HTML attributes.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button. Defaults to 'primary'. */
  variant?: 'primary' | 'secondary';
}

/**
 * Button component with forwarded ref support.
 * 
 * @param {ButtonProps} props - Button properties
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the button element
 * @returns {JSX.Element} Styled button element
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', disabled, children, className, ...rest },
  ref,
) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn--primary' : 'btn--secondary',
    disabled ? 'is-disabled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // Ensure the button has proper type attribute if not provided
  const buttonType = rest.type || 'button';

  return (
    <button 
      ref={ref} 
      className={classes} 
      disabled={disabled} 
      aria-disabled={disabled}
      type={buttonType as 'button' | 'submit' | 'reset'}
      {...rest}
    >
      {children}
    </button>
  );
});


