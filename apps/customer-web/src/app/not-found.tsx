import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link href="/" className="text-primary underline underline-offset-4">
        Go to the home page
      </Link>
    </main>
  );
}
