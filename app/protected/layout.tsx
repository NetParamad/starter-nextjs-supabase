export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col gap-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}