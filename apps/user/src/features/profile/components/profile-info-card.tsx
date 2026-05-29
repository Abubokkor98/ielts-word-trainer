import { Card, CardContent, CardHeader, CardTitle } from '@ielts/ui';
import type { UserProfile } from '../types';

interface ProfileInfoCardProps {
  profile: UserProfile;
}

export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider block">
              Name
            </span>
            <p className="text-foreground text-sm font-medium">
              {profile.name}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider block">
              Email
            </span>
            <p className="text-foreground text-sm font-medium">
              {profile.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
