"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, BarChart3, Lock, Clock, Zap, FileText } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      title: "Quản lý nhân sự toàn diện",
      description: "Quản lý hồ sơ nhân viên, thông tin cá nhân, chứng chỉ, kinh nghiệm một cách tập trung và hiệu quả.",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Phân tích và báo cáo",
      description: "Tạo báo cáo chi tiết về nhân sự, phân tích dữ liệu với biểu đồ trực quan và dễ hiểu.",
      icon: BarChart3,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Bảo mật dữ liệu",
      description: "Bảo vệ thông tin nhân viên với mã hóa end-to-end và kiểm soát quyền truy cập chi tiết.",
      icon: Lock,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Quản lý thời gian thực",
      description: "Theo dõi thời gian làm việc, chấm công, và tính lương một cách tự động và chính xác.",
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Hiệu suất cao",
      description: "Hệ thống được tối ưu hóa cho tốc độ và hiệu suất, xử lý hàng nghìn nhân viên mà không giảm tốc.",
      icon: Zap,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Quản lý tài liệu",
      description: "Lưu trữ và quản lý tất cả các tài liệu liên quan đến nhân viên trong một hệ thống tập trung.",
      icon: FileText,
      color: "from-cyan-500 to-cyan-600"
    }
  ]

  return (
    <div className="bg-white">
      {/* Header Section */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-semibold text-2xl text-gray-900">Cetus</span>
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <Link href="/features" className="text-sm font-semibold leading-6 text-blue-600">Features</Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">About</Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">Contact</Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">Log in</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Các tính năng mạnh mẽ cho HR
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Khám phá những tính năng tiên tiến giúp bạn quản lý nhân sự một cách hiệu quả và chuyên nghiệp.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Xem giá
                </Button>
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
                Liên hệ <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r rounded-lg opacity-0 group-hover:opacity-10 transition duration-300" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white border border-gray-200 rounded-lg p-8 hover:border-blue-300 hover:shadow-lg transition duration-300">
                  <div className={`inline-flex rounded-lg bg-gradient-to-r ${feature.color} p-3 text-white w-fit`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Sẵn sàng nâng cấp quản lý nhân sự của bạn?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Bắt đầu miễn phí ngay hôm nay và trải nghiệm sức mạnh của Cetus.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  Bắt đầu ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
