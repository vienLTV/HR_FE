"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Chủ đề phải có ít nhất 5 ký tự"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự")
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log("Form submitted:", data)
      setSubmitSuccess(true)
      reset()
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@cetus.com",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "+84 (028) 3456 7890",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Đường Nguyễn Huệ, TP. HCM, Việt Nam",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6, 9:00 - 18:00",
      color: "from-orange-500 to-orange-600"
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
            <Link href="/features" className="text-sm font-semibold leading-6 text-gray-900">Features</Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">About</Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-blue-600">Contact</Link>
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
              Liên hệ với chúng tôi
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Chúng tôi yêu nghe từ bạn. Gửi cho chúng tôi một tin nhắn và chúng tôi sẽ phản hồi trong 24 giờ.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition duration-300">
                <div className={`inline-flex rounded-lg bg-gradient-to-r ${info.color} p-3 text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{info.title}</h3>
                <p className="mt-2 text-gray-600">{info.content}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
              Gửi tin nhắn cho chúng tôi
            </h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">
                  ✓ Cảm ơn! Chúng tôi đã nhận được tin nhắn của bạn.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tên
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Điện thoại (tùy chọn)
                  </label>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="+84 (028) 3456 7890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Công ty (tùy chọn)
                  </label>
                  <Input
                    {...register("company")}
                    placeholder="Tên công ty"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Chủ đề
                </label>
                <Input
                  {...register("subject")}
                  placeholder="Chủ đề của bạn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tin nhắn
                </label>
                <Textarea
                  {...register("message")}
                  placeholder="Tin nhắn của bạn ở đây..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </Button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center border border-gray-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  123 Đường Nguyễn Huệ<br />
                  TP. HCM, Việt Nam
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin thêm
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Sales:</strong> sales@cetus.com
                </p>
                <p>
                  <strong>Support:</strong> support@cetus.com
                </p>
                <p>
                  <strong>Partnership:</strong> partnership@cetus.com
                </p>
                <p className="mt-6">
                  Nếu bạn có câu hỏi về tính năng, giá cả hoặc bất cứ điều gì khác, 
                  xin vui lòng liên hệ với chúng tôi. Chúng tôi rất vui lòng được giúp bạn!
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-green-50 rounded-lg p-8 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thời gian phản hồi
              </h3>
              <p className="text-gray-700">
                Chúng tôi cố gắng phản hồi tất cả các tin nhắn trong vòng <strong>24 giờ</strong> hoặc ít hơn. 
                Nếu bạn không nhận được phản hồi, vui lòng kiểm tra thư mục spam của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Các câu hỏi thường gặp
            </h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-4">
            {[
              {
                question: "Làm cách nào để bắt đầu?",
                answer: "Bạn có thể đăng ký miễn phí trên trang chủ của chúng tôi. Không cần thẻ tín dụng và bạn có thể dùng thử miễn phí trong 14 ngày."
              },
              {
                question: "Tôi có thể hủy bất cứ lúc nào không?",
                answer: "Có, bạn có thể hủy bất cứ lúc nào mà không cần đưa ra lý do. Chúng tôi không có hợp đồng dài hạn bắt buộc."
              },
              {
                question: "Bạn có hỗ trợ tích hợp không?",
                answer: "Có, chúng tôi hỗ trợ tích hợp với hơn 100 ứng dụng phổ biến. Liên hệ với chúng tôi để biết thêm chi tiết."
              },
              {
                question: "Dữ liệu của tôi có an toàn không?",
                answer: "Có, chúng tôi sử dụng mã hóa end-to-end và tuân thủ các tiêu chuẩn bảo mật quốc tế. Tất cả dữ liệu được sao lưu hàng ngày."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg p-6 hover:border-blue-300">
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
