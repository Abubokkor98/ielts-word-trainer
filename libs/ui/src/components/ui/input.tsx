import { Input as ChakraInput, type InputProps as ChakraInputProps } from '@chakra-ui/react';
import * as React from 'react';

export interface InputProps extends ChakraInputProps {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
  return <ChakraInput ref={ref} {...props} />;
});

Input.displayName = 'Input';

export { Input };
