import {
  Card as ChakraCard,
  CardBody as ChakraCardBody,
  CardFooter as ChakraCardFooter,
  CardHeader as ChakraCardHeader,
  type CardProps as ChakraCardProps,
  Heading,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';

// Backward compatible Card components
const Card = React.forwardRef<HTMLDivElement, ChakraCardProps>(({ ...props }, ref) => (
  <ChakraCard ref={ref} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <ChakraCardHeader ref={ref} {...props} />,
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ ...props }, ref) => <Heading ref={ref} as="h3" size="md" {...props} />,
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ ...props }, ref) => <Text ref={ref} fontSize="sm" color="gray.600" {...props} />);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <ChakraCardBody ref={ref} {...props} />,
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => <ChakraCardFooter ref={ref} {...props} />,
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
