import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  container?: boolean
}

export function Section({ children, className, id, container = true }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-32", className)}>
      <div className={cn(container && "container mx-auto px-6")}>
        {children}
      </div>
    </section>
  )
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "left",
}: {
  title: string
  subtitle?: string
  className?: string
  align?: "left" | "center"
}) {
  return (
    <div className={cn("mb-12 space-y-4", align === "center" && "text-center", className)}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.021em] text-foreground leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed tracking-[-0.011em]">
          {subtitle}
        </p>
      )}
    </div>
  )
}
