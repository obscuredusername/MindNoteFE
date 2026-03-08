export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mindnote</h1>
          <p className="text-muted-foreground">Intelligent note-taking powered by AI</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
