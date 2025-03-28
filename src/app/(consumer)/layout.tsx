import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from 'next/image'
import logo from '@/assets/logo.svg'
import { Button } from "@/components/ui/button";

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
        <Link className="mr-auto text-lg flex items-center px-2" href="/">        
          <Image src={logo} width={20} height={20} alt="xz courses platform demo" />
          <span className="pl-4 text-xl font-bold">Courses</span>
        </Link>
        <SignedIn>
          <AdminLink /> 
          <Link className="hover:bg-accent/10 flex items-center px-2" href="/courses">My Courses</Link>
          <Link className="hover:bg-accent/10 flex items-center px-2" href="/purchases">Purchase History</Link>
          <div className="size-8 self-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "100%", height: "100%" },
                  },
                }}
              />
            </div>
        </SignedIn>
        <SignedOut>
            <Button className="self-center" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
          </SignedOut>
      </nav>
    </header>
  );
}

async function AdminLink() {
  // const user = await getCurrentUser()
  // if (!canAccessAdminPages(user)) return null

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  )
}