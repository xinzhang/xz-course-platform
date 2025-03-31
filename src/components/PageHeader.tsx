import { cn } from "@/lib/utils";

export function PageHeader({ title, className, children }: { title: string, className?: string, children?: React.ReactNode }) {
  return (
    <div className={cn("mb-8 flex gap-4 items-center justify-between", className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  )
}
