import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p>© 2026 AI Image Tool. All rights reserved.</p>
            <p className="text-xs">This platform is an independent product and is not affiliated with, endorsed by, or sponsored by Google, Black Forest Labs, or Stability AI.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <a href="mailto:3478137972@qq.com" className="hover:text-foreground transition-colors">
              Support
            </a>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
