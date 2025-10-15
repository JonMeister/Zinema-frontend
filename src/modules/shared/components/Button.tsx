import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

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


