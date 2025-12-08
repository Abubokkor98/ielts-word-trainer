import * as React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

// Map old variant/size props to Chakra for backward compatibility
export interface ButtonProps
  extends Omit<ChakraButtonProps, 'variant' | 'size'> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', size = 'default', asChild = false, ...props },
    ref
  ) => {
    // Map variants
    const chakraVariant = React.useMemo(() => {
      switch (variant) {
        case 'destructive':
          return 'solid';
        case 'outline':
          return 'outline';
        case 'ghost':
          return 'ghost';
        case 'link':
          return 'link';
        case 'secondary':
          return 'outline';
        default:
          return 'solid';
      }
    }, [variant]);

    // Map sizes
    const chakraSize = React.useMemo(() => {
      switch (size) {
        case 'sm':
          return 'sm';
        case 'lg':
          return 'lg';
        case 'icon':
          return 'sm';
        default:
          return 'md';
      }
    }, [size]);

    // Map color scheme
    const colorScheme = React.useMemo(() => {
      if (variant === 'destructive') return 'red';
      if (variant === 'secondary') return 'gray';
      return 'brand';
    }, [variant]);

    return (
      <ChakraButton
        ref={ref}
        variant={chakraVariant}
        size={chakraSize}
        colorScheme={colorScheme}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
