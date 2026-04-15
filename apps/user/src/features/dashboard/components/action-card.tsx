import { Box, Heading, Text } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ActionCard({ href, title, description, icon: Icon }: ActionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} aria-label={`${title}: ${description}`}>
      <Card
        _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
        cursor="pointer"
        role="button"
        tabIndex={0}
      >
        <CardHeader>
          <Box
            display="inline-flex"
            p={3}
            mb={2}
            borderRadius="xl"
            bg="whiteAlpha.100"
            color="brand.400"
          >
            <Icon size={28} strokeWidth={1.5} aria-hidden="true" focusable={false} />
          </Box>
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
