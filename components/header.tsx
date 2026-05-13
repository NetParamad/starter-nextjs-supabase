import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "./auth-button";
import { ThemeSwitcher } from "./theme-switcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/protected", label: "Protected" },
  { href: "/notes", label: "Notes" },
];

function AuthSection() {
  return <AuthButton />;
}

function AuthSectionSkeleton() {
  return (
    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
  );
}

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold hover:text-primary transition-colors"
            >
              My Learn
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Suspense fallback={<AuthSectionSkeleton />}>
              <AuthSection />
            </Suspense>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}