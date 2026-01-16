"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BarChart3, Lock, Clock, Zap, FileText } from "lucide-react";
import { useI18n } from "@/app/providers/LanguageProvider";

export default function FeaturesPage() {
  const { t } = useI18n();
  const features = [
    {
      title: t("features.feature1.title"),
      description: t("features.feature1.desc"),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("features.feature2.title"),
      description: t("features.feature2.desc"),
      icon: BarChart3,
      color: "from-green-500 to-green-600",
    },
    {
      title: t("features.feature3.title"),
      description: t("features.feature3.desc"),
      icon: Lock,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: t("features.feature4.title"),
      description: t("features.feature4.desc"),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: t("features.feature5.title"),
      description: t("features.feature5.desc"),
      icon: Zap,
      color: "from-red-500 to-red-600",
    },
    {
      title: t("features.feature6.title"),
      description: t("features.feature6.desc"),
      icon: FileText,
      color: "from-cyan-500 to-cyan-600",
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
            <Link href="/features" className="text-sm font-semibold leading-6 text-blue-600">
              {t("nav.features")}
            </Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.pricing")}
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              {t("nav.about")}
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
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
              {t("features.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{t("features.subtitle")}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  {t("features.viewPricing")}
                </Button>
              </Link>
              <Link href="/contact" className="text-sm font-semibold leading-6 text-gray-900">
                {t("features.contactUs")} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r rounded-lg opacity-0 group-hover:opacity-10 transition duration-300"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                ></div>
                <div className="relative bg-white border border-gray-200 rounded-lg p-8 hover:border-blue-300 hover:shadow-lg transition duration-300">
                  <div
                    className={`inline-flex rounded-lg bg-gradient-to-r ${feature.color} p-3 text-white w-fit`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("features.cta.title")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">{t("features.cta.subtitle")}</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                  {t("features.cta.button")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
