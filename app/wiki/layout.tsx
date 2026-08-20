export default function WikiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen pt-[60px]">{children}</div>;
}
