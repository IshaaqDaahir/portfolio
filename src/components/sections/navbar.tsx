"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Linkedin, Globe, Coffee } from 'lucide-react';

import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './theme-toggle';

const iconMap = {
  linkedin: Linkedin,
  globe: Globe,
  coffee: Coffee,
};

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: isVisible ? 0 : -100 
      }}
      transition={{ 
        duration: 0.6, 
        ease: 'easeOut',
        y: { duration: 0.3, ease: 'easeInOut' }
      }}
      className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
  <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 navbar-underline">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                {siteConfig.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="hidden sm:block font-semibold text-foreground">
              {siteConfig.author}
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
            {siteConfig.navigation.map((item) => (
              <motion.div
                whileHover={{ y: -3 }}
                whileFocus={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="inline-block"
                key={item.href}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 focus:text-foreground/80',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                  tabIndex={0}
                >
                  <span className="relative">
                    {item.label}
                    <motion.div
                      className="absolute left-0 right-0 -bottom-1 h-0.5 rounded group-hover:scale-x-100 group-focus:scale-x-100 scale-x-0 transition-transform"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      whileFocus={{ scaleX: 1 }}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                      style={{ transformOrigin: 'left', background: 'var(--navbar-underline)' }}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* GitHub Link */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0"
          >
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><title>GitHub</title><circle cx="12" cy="12" r="12" fill="black"/><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="white"/></svg>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  {siteConfig.siteName}
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-1">
                  {siteConfig.navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/60 hover:text-foreground'
                      )}
                    >
                      {item.label}
                      {pathname === item.href && (
                        <Badge variant="secondary" className="ml-auto">
                          Current
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* Bio */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {siteConfig.description}

                  </p>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Connect</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {siteConfig.social.map((social) => {
                      const Icon = social.icon ? iconMap[social.icon as keyof typeof iconMap] : null;
                      return (
                        <Button
                          key={social.url}
                          variant="outline"
                          size="sm"
                          asChild
                          className="justify-start"
                        >
                          <Link
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {social.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
