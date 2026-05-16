"use client"

import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/layout/Section"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { 
  Users, 
  ShoppingBag, 
  Settings,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck
} from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export default function AdminDashboard() {
  const { t } = useTranslation()
  return (
    <div className="flex h-screen bg-surface/5 overflow-hidden">
      {/* SIDEBAR MOCK */}
      <div className="w-64 bg-background border-r border-border p-6 hidden md:flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span className="font-bold text-xl tracking-[-0.022em]">SOULMAR</span>
          </div>
          <nav className="space-y-2">
            {[
              { label: t('dashboard.admin.overview') as string, icon: <LayoutDashboard className="w-5 h-5" />, active: true },
              { label: t('dashboard.admin.sales') as string, icon: <ShoppingBag className="w-5 h-5" />, active: false },
              { label: t('dashboard.admin.users') as string, icon: <Users className="w-5 h-5" />, active: false },
              { label: t('dashboard.admin.settings') as string, icon: <Settings className="w-5 h-5" />, active: false },
            ].map((item, i) => (
              <button key={i} className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                item.active ? "bg-primary text-white shadow-lg" : "text-foreground/60 hover:bg-surface"
              )}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold">{t('dashboard.admin.help_center') as string}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">{t('dashboard.admin.console') as string}</h1>
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="h-10 px-4 gap-2">
               <ShieldCheck className="w-4 h-4 text-primary" /> {t('dashboard.admin.super_admin') as string}
             </Badge>
             <div className="h-12 w-12 rounded-full border-2 border-primary p-0.5">
               <div className="w-full h-full rounded-full bg-surface" />
             </div>
          </div>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none bg-background shadow-xl p-8 rounded-[3rem]">
            <div className="flex justify-between items-center mb-10">
              <SectionHeading title={t('dashboard.admin.growth_title') as string} subtitle={t('dashboard.admin.growth_subtitle') as string} className="mb-0" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">{t('dashboard.admin.month') as string}</Button>
                <Button variant="outline" size="sm" className="rounded-full">{t('dashboard.admin.year') as string}</Button>
              </div>
            </div>
            {/* Visual placeholder for a graph */}
            <div className="h-64 w-full bg-surface/30 rounded-[2rem] flex items-end p-6 gap-2">
              {[40, 60, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: `${h}%` }} />
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="border-none bg-secondary-yellow text-foreground p-8 rounded-[3rem] shadow-lg">
              <h4 className="text-sm font-bold uppercase tracking-[0.05em] opacity-60 mb-2">{t('dashboard.admin.daily_checkout') as string}</h4>
              <p className="text-5xl font-bold">$12,450</p>
              <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase">{t('dashboard.admin.daily_goal') as string}</span>
                <span className="text-xs font-bold">92%</span>
              </div>
            </Card>
            <Card className="border-none bg-secondary-olive text-foreground p-8 rounded-[3rem] shadow-lg">
              <h4 className="text-sm font-bold uppercase tracking-[0.05em] opacity-60 mb-2">{t('dashboard.admin.active_sessions') as string}</h4>
              <p className="text-5xl font-bold">342</p>
              <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase">{t('dashboard.admin.server_status') as string}</span>
                <Badge className="bg-white text-secondary-olive border-none text-[10px]">{t('dashboard.admin.optimal') as string}</Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* DATA TABLE MOCK */}
        <div className="mt-12 space-y-6">
          <SectionHeading title={t('dashboard.admin.recent_activity_title') as string} subtitle={t('dashboard.admin.recent_activity_subtitle') as string} className="mb-0" />
          <div className="bg-background rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface/20">
                  <th className="p-6 text-xs font-bold uppercase">{t('dashboard.admin.table.total')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: "Mariano S.", act: t('dashboard.admin.activity.purchase_kit'), status: t('dashboard.admin.table.completed'), val: "$120,000" },
                  { user: "Laura V.", act: t('dashboard.admin.activity.therapy_reservation'), status: t('dashboard.admin.table.pending'), val: "$180,000" },
                  { user: "Roberto K.", act: t('dashboard.admin.activity.course_subscription'), status: t('dashboard.admin.table.completed'), val: "$45,000" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-surface/10 transition-colors">
                    <td className="p-6 font-bold">{row.user}</td>
                    <td className="p-6 text-foreground/60">{row.act}</td>
                    <td className="p-6">
                      <Badge variant={row.status === t('dashboard.admin.table.completed') ? "tertiary" : "outline"} className="rounded-full">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="p-6 font-bold">{row.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
