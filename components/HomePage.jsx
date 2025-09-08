// components/HomePage.jsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Play, Users, BookOpen, ChevronRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

export default function VSkillLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Smart Learning
                  <br />
                  <span className="text-foreground">Deeper & More</span>
                  <br />
                  <span className="text-primary">-Amazing</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md text-pretty">
                  Transform your skills with our comprehensive online courses
                  designed for modern learners. Join thousands of students
                  already advancing their careers.
                </p>
              </div>

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

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-card rounded-3xl p-8 shadow-xl">
                <img
                  src="/placeholder-wxwn4.png"
                  alt="Student learning online"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are passionate about empowering learners worldwide with
              high-quality, accessible & engaging education. Our mission
              offering a diverse range of courses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
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

      {/* Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Explore Our Course</h2>
              <p className="text-muted-foreground">
                Discover courses that match your interests and career goals
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-border hover:bg-accent rounded-md">
              All Courses
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Learn React to Develop One Beginner to Advanced",
                instructor: "John Smith",
                price: "$49.99",
                rating: 4.8,
                students: 1234,
                image: "/placeholder-x6sao.png",
              },
              {
                title: "Create a Digital Reputation with UI Web Design",
                instructor: "Sarah Johnson",
                price: "$39.99",
                rating: 4.9,
                students: 856,
                image: "/placeholder-sedds.png",
              },
              {
                title: "Build a perfect career with UI Design and Figma",
                instructor: "Mike Chen",
                price: "$59.99",
                rating: 4.7,
                students: 2341,
                image: "/placeholder-1ydkn.png",
              },
              {
                title: "Leadership and Management Skills for Career Growth",
                instructor: "Emily Davis",
                price: "$44.99",
                rating: 4.8,
                students: 1567,
                image: "/placeholder-6bb6c.png",
              },
              {
                title: "Create a Design System From Scratch",
                instructor: "Alex Wilson",
                price: "$54.99",
                rating: 4.9,
                students: 987,
                image: "/design-system-components-tokens.png",
              },
              {
                title: "Create a Digital Document with Photoshop",
                instructor: "Lisa Brown",
                price: "$34.99",
                rating: 4.6,
                students: 1876,
                image: "/placeholder-rfvfb.png",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="group hover:shadow-lg transition-shadow bg-card rounded-lg overflow-hidden"
              >
                <div className="p-0">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({course.students})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {course.instructor}
                    </span>
                    <span className="font-bold text-primary">
                      {course.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
              View More
            </button>
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

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/placeholder-70kwr.png"
                alt="Instructor"
                className="w-full max-w-md mx-auto rounded-2xl"
              />
            </div>

            <div className="space-y-6">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                Growth Skill
              </span>
              <h2 className="text-4xl font-bold text-balance">
                Growth Skill With <span className="text-primary">Vskill</span>{" "}
                Academy & Accelerate to your Better future
              </h2>
              <p className="text-muted-foreground text-pretty">
                Unlock your potential with our comprehensive learning platform.
                Join thousands of successful students who have transformed their
                careers through our expert-led courses.
              </p>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background"
                    ></div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold">15.7k+</div>
                  <div className="text-sm text-muted-foreground">
                    Happy Students
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            See why We're rated <span className="text-primary">#1 in</span>
            <br />
            Online <span className="text-primary">Platform tech</span>
          </h2>

          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-6 h-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="font-semibold">4.9/5</span>
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our dynamic educational platform offers you the tools and resources
            to propel yourself forward in learning and career advancement in a
            supportive community.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Frequently asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our platform and courses
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How do I get started with our platform?",
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
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What You Looking for?</h2>
              <p className="text-muted-foreground">
                Choose the learning path that best fits your goals and schedule
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 text-center hover:shadow-lg transition-shadow bg-card rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-4">Are You New Here?</h3>
                <p className="text-muted-foreground mb-6">
                  Start your learning journey with our beginner-friendly courses
                  and comprehensive onboarding process.
                </p>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                  Get Started
                </button>
              </div>

              <div className="p-8 text-center hover:shadow-lg transition-shadow bg-primary text-primary-foreground rounded-lg">
                <div className="w-16 h-16 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-4">
                  Do You Want to Learn More?
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  Advance your skills with our expert-level courses and
                  specialized learning tracks designed for professionals.
                </p>
                <button className="w-full px-4 py-2 bg-background text-foreground hover:bg-background/90 rounded-md">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
