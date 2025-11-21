import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'FAQ - Preguntas Frecuentes | Portfolio',
  description: 'Encuentra respuestas a las preguntas más frecuentes sobre desarrollo web, colaboraciones y servicios.',
};

export default async function FAQPage() {
  const t = await getTranslations('faq');

  const faqs = [
    {
      category: t('categories.general'),
      questions: [
        {
          question: t('questions.tech_stack.question'),
          answer: t('questions.tech_stack.answer'),
        },
        {
          question: t('questions.project_duration.question'),
          answer: t('questions.project_duration.answer'),
        },
        {
          question: t('questions.support.question'),
          answer: t('questions.support.answer'),
        },
      ],
    },
    {
      category: t('categories.collaborations'),
      questions: [
        {
          question: t('questions.freelance.question'),
          answer: t('questions.freelance.answer'),
        },
        {
          question: t('questions.remote_work.question'),
          answer: t('questions.remote_work.answer'),
        },
        {
          question: t('questions.code_review.question'),
          answer: t('questions.code_review.answer'),
        },
      ],
    },
    {
      category: t('categories.services'),
      questions: [
        {
          question: t('questions.full_service.question'),
          answer: t('questions.full_service.answer'),
        },
        {
          question: t('questions.uiux_design.question'),
          answer: t('questions.uiux_design.answer'),
        },
        {
          question: t('questions.migrations.question'),
          answer: t('questions.migrations.answer'),
        },
      ],
    },
    {
      category: t('categories.technical'),
      questions: [
        {
          question: t('questions.nextjs_vs_react.question'),
          answer: t('questions.nextjs_vs_react.answer'),
        },
        {
          question: t('questions.testing_strategy.question'),
          answer: t('questions.testing_strategy.answer'),
        },
        {
          question: t('questions.scalability.question'),
          answer: t('questions.scalability.answer'),
        },
        {
          question: t('questions.security.question'),
          answer: t('questions.security.answer'),
        },
      ],
    },
    {
      category: t('categories.process'),
      questions: [
        {
          question: t('questions.workflow.question'),
          answer: t('questions.workflow.answer'),
        },
        {
          question: t('questions.updates.question'),
          answer: t('questions.updates.answer'),
        },
        {
          question: t('questions.satisfaction.question'),
          answer: t('questions.satisfaction.answer'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((category) => (
            <section key={category.category}>
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">
                {category.category}
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.category}-${index}`}
                    className="border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
          <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">{t('cta_title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('cta_description')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            {t('cta_button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
