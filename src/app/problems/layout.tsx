export default function ProblemsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            {/* 
        Ideally, the header should be here or in a root layout. 
        For now, the page has its own simulated header or we can extract it here.
        Let's keep it simple: just a wrapper.
      */}
            {children}
        </div>
    )
}
