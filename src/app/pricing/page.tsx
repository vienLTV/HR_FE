"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useI18n } from "@/app/providers/LanguageProvider";

export default function PricingPage() {
  const { t } = useI18n();
  const plans = [
    {
      name: t("pricing.plan.startup"),
      price: "99",
      description: t("pricing.startup.desc"),
      features: [
        t("pricing.feature.employees50"),
        t("pricing.feature.basicProfiles"),
        t("pricing.feature.simpleTracking"),
        t("pricing.feature.basicReporting"),
        t("pricing.feature.emailSupport"),
        t("pricing.feature.storage5gb"),
        t("pricing.feature.mobileApp"),
      ],
      cta: t("pricing.getStarted"),
      highlighted: false,
    },
    {
      name: t("pricing.plan.professional"),
      price: "299",
      description: t("pricing.professional.desc"),
      features: [
        t("pricing.feature.employees500"),
        t("pricing.feature.advancedProfiles"),
        t("pricing.feature.advancedTracking"),
        t("pricing.feature.customReports"),
        t("pricing.feature.emailChatSupport"),
        t("pricing.feature.storage100gb"),
        t("pricing.feature.mobileApp"),
        t("pricing.feature.apiAccess"),
        t("pricing.feature.analytics"),
        t("pricing.feature.workflows"),
      ],
      cta: t("pricing.getStarted"),
      highlighted: true,
    },
    {
      name: t("pricing.plan.enterprise"),
      price: "Custom",
      description: t("pricing.enterprise.desc"),
      features: [
        t("pricing.feature.employeesUnlimited"),
        t("pricing.feature.fullCustomization"),
        t("pricing.feature.integrations"),
        t("pricing.feature.accountManager"),
        t("pricing.feature.phoneEmailSupport"),
        t("pricing.feature.storageUnlimited"),
        t("pricing.feature.sso"),
        t("pricing.feature.development"),
        t("pricing.feature.security"),
        t("pricing.feature.compliance"),
      ],
      cta: t("pricing.contactSales"),
      highlighted: false,
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
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-blue-600">
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
              {t("pricing.title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{t("pricing.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.highlighted
                  ? "ring-2 ring-blue-600 lg:scale-105"
                  : "border border-gray-200 hover:border-blue-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 text-sm font-semibold rounded-full">
                    {t("pricing.plan.recommended")}
                  </span>
                </div>
              )}
              <div className="p-8 bg-white rounded-2xl h-full flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>

                {/* Price */}
                <div className="mt-6 mb-8">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-600 ml-2">{t("pricing.month")}</span>
                  )}
                  {plan.price === "Custom" && (
                    <span className="text-gray-600 ml-2">{t("pricing.custom")}</span>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.price === "Custom" ? "/contact" : "/register"}
                  className="w-full mb-8"
                >
                  <Button
                    className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features List */}
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("pricing.faq.title")}
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {[
              {
                question: t("pricing.faq.q1"),
                answer: t("pricing.faq.a1"),
              },
              {
                question: t("pricing.faq.q2"),
                answer: t("pricing.faq.a2"),
              },
              {
                question: t("pricing.faq.q3"),
                answer: t("pricing.faq.a3"),
              },
              {
                question: t("pricing.faq.q4"),
                answer: t("pricing.faq.a4"),
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

      {/* CTA Section */}
      <div className="relative isolate bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("pricing.cta.title")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">{t("pricing.cta.subtitle")}</p>
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
