"use client";

import { Button } from '@/components/ui/button';
import { GitBranch } from 'lucide-react';
import { signIn } from '@/lib/auth-client';


export function BetterAuthSignIn() {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <Button onClick={() => signIn.social({ provider: 'github' })} variant="outline" size="lg" className="gap-2">
        <GitBranch className="h-5 w-5" />
        Sign in with GitHub
      </Button>
      <span className="text-xs text-muted-foreground">Powered by Better Auth</span>
    </div>
  );
}
