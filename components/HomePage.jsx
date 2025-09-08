// components/HomePage.jsx
"use client";

import { Star, Play, Users, BookOpen, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 20}s`,
      animationDelay: `${Math.random() * 10}s`,
    }));
    setParticles(generated);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I get started with your platform?",
      answer:
        "Simply sign up for a free account, browse our course catalog, and enroll in the courses that interest you. You can start learning immediately after enrollment.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 7-day free trial for new users. You can access selected courses and features to experience our platform before committing to a subscription.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Our platform is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.",
    },
    {
      question: "Do you provide certificates upon completion?",
      answer:
        "Yes, we provide verified certificates for all completed courses. These certificates can be shared on LinkedIn and added to your professional portfolio.",
    },
    {
      question: "Is my data secure with your platform?",
      answer:
        "We take data security very seriously. All user data is encrypted and stored securely. We comply with international data protection standards and never share your information with third parties.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-particle"
            style={{
              top: p.top,
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Smart Learning
                <br />
                <span className="text-foreground">Deeper & More</span>
                <br />
                <span className="text-primary">-Amazing</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md text-pretty">
                Transform your skills with our comprehensive online courses
                designed for modern learners. Join thousands of students already
                advancing their careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  Get Started
                </button>
                <button className="px-6 py-3 text-base border border-border hover:bg-accent rounded-md flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* GIF Image */}
            <div className="relative w-full max-w-md mx-auto animate-float">
              <img
                src="/illustration/Coding workshop.gif"
                alt="Student learning online"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            We are passionate about empowering learners worldwide with
            high-quality, accessible & engaging education.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">
                Professional Instructors
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">56k</div>
              <div className="text-sm text-muted-foreground">
                Students Enrolled
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">170+</div>
              <div className="text-sm text-muted-foreground">
                Courses Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Choice Favourite Course from top category
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "WordPress Development", courses: 12, icon: "💻" },
              { name: "Web Development", courses: 8, icon: "🌐" },
              { name: "App Development", courses: 15, icon: "📱" },
              { name: "Java Script", courses: 6, icon: "⚡" },
              { name: "UI & Software", courses: 9, icon: "🎨" },
              { name: "Graphics Designer", courses: 11, icon: "✨" },
            ].map((category, index) => (
              <div
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer bg-card rounded-lg"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-muted-foreground">
                  {category.courses} Courses
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-4 py-2 border border-border hover:bg-accent rounded-md">
              All Category
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform and courses
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border rounded-lg px-6 py-4"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full text-left hover:no-underline"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className="ml-4 transform transition-transform">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="mt-4 text-muted-foreground">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
