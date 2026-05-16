"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Youtube } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

export function FooterSection() {
  const { t } = useTranslation()

  return (
    <footer className="bg-background py-6 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative w-48 h-12 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo-soulmar-official.png" 
                alt="Soulmar" 
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Combined Links and Copyright Section */}
          <div className="flex flex-col md:flex-row items-center gap-x-8 gap-y-4 text-center md:text-left">
            <nav className="flex items-center gap-x-6">
              <Link href="/terms" className="text-[12px] font-medium text-foreground/50 hover:text-primary transition-colors tracking-tight whitespace-nowrap">{t('footer.terms')}</Link>
              <Link href="/privacy" className="text-[12px] font-medium text-foreground/50 hover:text-primary transition-colors tracking-tight whitespace-nowrap">{t('footer.privacy')}</Link>
              <Link href="/contact" className="text-[12px] font-medium text-foreground/50 hover:text-primary transition-colors tracking-tight whitespace-nowrap">{t('footer.contact')}</Link>
              <Link href="/cookies" className="text-[12px] font-medium text-foreground/50 hover:text-primary transition-colors tracking-tight whitespace-nowrap">{t('footer.cookies')}</Link>
            </nav>
            
            <p className="text-[12px] text-foreground/40 font-normal tracking-tight whitespace-nowrap pt-[1px]">
              {t('footer.rights')}
            </p>
          </div>

          {/* Social and Admin Section */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <Link href="https://instagram.com/soulmar" target="_blank" className="group relative block transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95">
                <div className="relative w-5 h-5">
                  <div className="block dark:hidden">
                    <Image src="/socialmedia/1.png" alt="Instagram" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/v.png" alt="Instagram" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/socialmedia/b.png" alt="Instagram" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/a.png" alt="Instagram" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                </div>
              </Link>

              {/* Facebook */}
              <Link href="https://facebook.com/soulmar" target="_blank" className="group relative block transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95">
                <div className="relative w-5 h-5">
                  <div className="block dark:hidden">
                    <Image src="/socialmedia/2.png" alt="Facebook" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/v2.png" alt="Facebook" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/socialmedia/b2.png" alt="Facebook" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/a2.png" alt="Facebook" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                </div>
              </Link>

              {/* Spotify */}
              <Link href="https://open.spotify.com/user/soulmar" target="_blank" className="group relative block transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95">
                <div className="relative w-5 h-5">
                  <div className="block dark:hidden">
                    <Image src="/socialmedia/3.png" alt="Spotify" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/v3.png" alt="Spotify" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/socialmedia/b3.png" alt="Spotify" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/a3.png" alt="Spotify" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                </div>
              </Link>

              {/* Youtube */}
              <Link href="https://youtube.com/@soulmar" target="_blank" className="group relative block transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95">
                <div className="relative w-5 h-5">
                  <div className="block dark:hidden">
                    <Image src="/socialmedia/4.png" alt="Youtube" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/v4.png" alt="Youtube" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                  <div className="hidden dark:block">
                    <Image src="/socialmedia/b4.png" alt="Youtube" width={20} height={20} className="block group-hover:hidden object-contain" />
                    <Image src="/socialmedia/a4.png" alt="Youtube" width={20} height={20} className="hidden group-hover:block object-contain" />
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="h-4 w-px bg-border hidden md:block"></div>
            
            <Link 
              href="/panel-admin/login" 
              className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/10 hover:text-primary transition-colors duration-300"
            >
              {t('common.admin')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
