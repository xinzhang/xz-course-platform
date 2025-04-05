import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({
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
      <nav className='flex gap-4 container'>
        <div className="mr-auto flex items-center gap-2">
          <Link className='text-lg hover:underline' href='/'>
            Wowdemy
          </Link>
          <Badge className="hover: cursor-default">Admin</Badge>
        </div>
        <Link
            className='hover:bg-accent/10 flex items-center px-2'
            href='/admin/courses'
          >
            Courses
          </Link>
          <Link
            className='hover:bg-accent/10 flex items-center px-2'
            href='/admin/products'
          >
            Products
          </Link>
          <Link
            className='hover:bg-accent/10 flex items-center px-2'
            href='/admin/sales'
          >
            Sales
          </Link>
          <div className='size-8 self-center'>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "100%", height: "100%" },
                },
              }}
            />
          </div>
      </nav>
    </header>
  );
}

