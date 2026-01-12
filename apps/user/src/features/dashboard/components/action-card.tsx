import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import { Heading, Text } from '@chakra-ui/react';

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  emoji: string;
}

export function ActionCard({
  href,
  title,
  description,
  emoji,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      aria-label={`${title}: ${description}`}
    >
      <Card
        _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
        cursor="pointer"
        role="button"
        tabIndex={0}
      >
        <CardHeader>
          <Text fontSize="3xl" mb={2} aria-hidden="true">
            {emoji}
          </Text>
          <Heading size="md" color="brand.400">
            {title}
          </Heading>
        </CardHeader>
        <CardContent>
          <Text color="gray.400" fontSize="sm">
            {description}
          </Text>
        </CardContent>
      </Card>
    </Link>
  );
}
