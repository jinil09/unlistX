import Link from "next/link"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold tracking-tight">UnlistX</span>
    </Link>
  )
}
