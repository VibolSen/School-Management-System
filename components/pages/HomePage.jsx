// components/HomePage.jsx
"use client";

import { Star, Play, Users, BookOpen, HelpCircle , ChevronRight, GraduationCap, Briefcase, Code } from "lucide-react";
import { Sparkles, TrendingUp, Award } from "lucide-react"
import { useState, useEffect } from "react";
import HomeSection from "./HomeSection";

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({ // Increased particle count
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 20}s`, // Slower, more subtle
      animationDelay: `${Math.random() * 15}s`,
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
    // Add a subtle gradient background for depth
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20 overflow-x-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-particle"
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
      <section className="relative  lg:py-12 px-32 ">
        <div className="container mx-auto px-4 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-blue-900 text-balance leading-tight">
                Smart Learning
                <br />
                <span className="text-foreground">Deeper & More</span>
                <br />
                {/* Gradient text for emphasis */}
                <span className="  text-blue-900  from-primary to-primary/70 text-transparent bg-clip-text">
                  -Amazing
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md text-pretty ">
                Transform your skills with our comprehensive online courses
                designed for modern learners. Join thousands of students already
                advancing their careers.
              </p>
            </div>

            {/* GIF with a soft glow effect */}
            <div className="relative w-full max-w-lg mx-auto animate-float">
               {/* This pseudo-element creates the glow */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"></div>
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

<section>
   <div>
        <HomeSection/>
   </div>
</section>






      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-blue-900 dark:to-gray-950">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find answers to common questions about our platform and courses.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden 
                ${openFaqIndex === index ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20 shadow-md" : "bg-white dark:bg-gray-800"}`}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left p-6 font-semibold group"
              >
                <span className="text-lg flex text-white items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  {faq.question}
                </span>
                <ChevronRight
                  className={`h-5 w-5 transform transition-transform duration-300 text-white group-hover:text-purple-500
                    ${openFaqIndex === index ? "rotate-90" : ""}`}
                />
              </button>

              {/* Answer Section */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? "max-h-96" : "max-h-0"}`}
              >
                <div className="p-6 pt-0 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>



    </div>
  );
}