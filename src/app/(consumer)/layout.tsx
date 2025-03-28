import Link from "next/link";

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className='flex h-12 shadow bg-background z-10'>
      <nav className="flex gap-4 container">
        <Link className="mr-auto text-lg hover:underline items-center px-2" href="/">        
          Web Dev Simplified
        </Link>
        
      </nav>
    </header>
  );
}