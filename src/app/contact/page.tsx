"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useI18n } from "@/app/providers/LanguageProvider";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.info.email"),
      content: t("contact.info.email.value"),
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Phone,
      title: t("contact.info.phone"),
      content: t("contact.info.phone.value"),
      color: "from-green-500 to-green-600",
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      content: t("contact.info.address.value"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Clock,
      title: t("contact.info.hours"),
      content: t("contact.info.hours.value"),
      color: "from-orange-500 to-orange-600",
    },
  ];

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
            <Link href="/features" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.features")}
            </Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.pricing")}
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-blue-600">
              {t("nav.contact")}
            </Link>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.login")}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {t("contact.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{t("contact.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition duration-300"
              >
                <div
                  className={`inline-flex rounded-lg bg-gradient-to-r ${info.color} p-3 text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{info.title}</h3>
                <p className="mt-2 text-gray-600">{info.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Form & Map */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
              {t("contact.form.title")}
            </h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold">{t("contact.form.success")}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t("contact.form.name")}
                  </label>
                  <Input
                    {...register("name")}
                    placeholder={t("contact.form.name.placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{t("contact.form.error.name")}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t("contact.form.email")}
                  </label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder={t("contact.form.email.placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{t("contact.form.error.email")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t("contact.form.phone")}
                  </label>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder={t("contact.form.phone.placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t("contact.form.company")}
                  </label>
                  <Input
                    {...register("company")}
                    placeholder={t("contact.form.company.placeholder")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("contact.form.subject")}
                </label>
                <Input
                  {...register("subject")}
                  placeholder={t("contact.form.subject.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{t("contact.form.error.subject")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("contact.form.message")}
                </label>
                <Textarea
                  {...register("message")}
                  placeholder={t("contact.form.message.placeholder")}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{t("contact.form.error.message")}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
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
                  {t("contact.map.title")}
                  <br />
                  {t("contact.map.location")}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("contact.additional.title")}
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>{t("contact.additional.sales")}</strong>{" "}
                  {t("contact.additional.sales.email")}
                </p>
                <p>
                  <strong>{t("contact.additional.support")}</strong>{" "}
                  {t("contact.additional.support.email")}
                </p>
                <p>
                  <strong>{t("contact.additional.partnership")}</strong>{" "}
                  {t("contact.additional.partnership.email")}
                </p>
                <p className="mt-6">{t("contact.additional.desc")}</p>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-green-50 rounded-lg p-8 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("contact.responseTime.title")}
              </h3>
              <p className="text-gray-700">{t("contact.responseTime.desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("contact.faq.title")}
            </h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-4">
            {[
              {
                question: t("contact.faq.q1"),
                answer: t("contact.faq.a1"),
              },
              {
                question: t("contact.faq.q2"),
                answer: t("contact.faq.a2"),
              },
              {
                question: t("contact.faq.q3"),
                answer: t("contact.faq.a3"),
              },
              {
                question: t("contact.faq.q4"),
                answer: t("contact.faq.a4"),
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-lg p-6 hover:border-blue-300"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
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
  );
}
