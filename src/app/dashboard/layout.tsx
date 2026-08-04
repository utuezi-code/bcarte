import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F6FF]">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-7 lg:px-8 lg:py-9">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
