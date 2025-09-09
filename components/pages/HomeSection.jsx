import {
    Briefcase,
    Users,
    BookOpen,
    Sparkles,
    TrendingUp,
    Award,
    Code,
    Smartphone,
    Palette,
    Database,
    Shield,
    Megaphone,
  } from "lucide-react"
  
  export default function HomePage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 dark:border-blue-800/50 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Empowering Global Education</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-6 text-balance">
              Transform Your Learning Journey
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-balance">
              We are passionate about empowering learners worldwide with high-quality, accessible & engaging education.
            </p>
          </div>
        </section>
  
        {/* Enhanced Stats Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
  
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 mb-6">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Our Impact</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-blue-900 dark:from-slate-100 dark:via-emerald-100 dark:to-blue-100 bg-clip-text text-transparent text-balance">
                Trusted by Thousands Worldwide
              </h2>
            </div>
  
            {/* Fancy Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Card 1: Instructors */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
  
                <div className="relative flex flex-col items-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:rotate-12">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                  </div>
  
                  {/* Number with gradient */}
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    25+
                  </div>
  
                  {/* Label */}
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-center">
                    Professional Instructors
                  </div>
  
                  {/* Decorative dots */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                  </div>
                </div>
              </div>
  
              {/* Card 2: Students */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse delay-300" />
  
                <div className="relative flex flex-col items-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:rotate-12">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
  
                  {/* Number with gradient */}
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    56k
                  </div>
  
                  {/* Label */}
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-center">Students Enrolled</div>
  
                  {/* Decorative dots */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
  
              {/* Card 3: Courses */}
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse delay-600" />
  
                <div className="relative flex flex-col items-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:rotate-12">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
  
                  {/* Number with gradient */}
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    170+
                  </div>
  
                  {/* Label */}
                  <div className="text-slate-600 dark:text-slate-400 font-medium text-center">Courses Available</div>
  
                  {/* Decorative dots */}
                  <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-400" />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-500" />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Achievement Badge */}
            <div className="flex justify-center mt-16">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000" />
                <div className="relative flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-white/20 dark:border-slate-800/20 shadow-lg">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Rated #1 Online Learning Platform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Explore Top Categories Section */}
        <section className="py-24 px-4 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-rose-500/10" />
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1500" />
  
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 dark:border-purple-800/50 mb-6">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Popular Categories</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-slate-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent mb-6 text-balance">
                Explore Top Categories
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-balance">
                Find the perfect course for you from our wide range of popular categories.
              </p>
            </div>
  
            {/* Fancy Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  name: "Web Development",
                  courses: 20,
                  icon: <Code className="w-8 h-8" />,
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-600 via-blue-500 to-cyan-500",
                },
                {
                  name: "App Development",
                  courses: 15,
                  icon: <Smartphone className="w-8 h-8" />,
                  gradient: "from-emerald-500 to-teal-500",
                  bgGradient: "from-emerald-600 via-emerald-500 to-teal-500",
                },
                {
                  name: "UI/UX Design",
                  courses: 9,
                  icon: <Palette className="w-8 h-8" />,
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-600 via-purple-500 to-pink-500",
                },
                {
                  name: "Data Science",
                  courses: 12,
                  icon: <Database className="w-8 h-8" />,
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-600 via-orange-500 to-red-500",
                },
                {
                  name: "Cybersecurity",
                  courses: 8,
                  icon: <Shield className="w-8 h-8" />,
                  gradient: "from-slate-500 to-gray-600",
                  bgGradient: "from-slate-600 via-slate-500 to-gray-600",
                },
                {
                  name: "Digital Marketing",
                  courses: 11,
                  icon: <Megaphone className="w-8 h-8" />,
                  gradient: "from-rose-500 to-pink-500",
                  bgGradient: "from-rose-600 via-rose-500 to-pink-500",
                },
              ].map((category, index) => (
                <div key={index} className="group relative">
                  {/* Animated glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${category.bgGradient} rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  />
  
                  <div className="relative flex flex-col items-center p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-3 cursor-pointer">
                    {/* Icon with sophisticated background */}
                    <div className="relative mb-8">
                      {/* Outer glow ring */}
                      <div
                        className={`absolute -inset-4 bg-gradient-to-r ${category.gradient} rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500`}
                      />
  
                      {/* Icon container */}
                      <div
                        className={`relative flex items-center justify-center w-20 h-20 bg-gradient-to-r ${category.gradient} rounded-2xl shadow-2xl group-hover:shadow-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110`}
                      >
                        <div className="text-white group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                      </div>
  
                      {/* Floating particles */}
                      <div
                        className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-60 animate-bounce"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                      <div
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/80 rounded-full opacity-40 animate-bounce"
                        style={{ animationDelay: `${index * 150 + 200}ms` }}
                      />
                    </div>
  
                    {/* Category name with gradient */}
                    <h3
                      className={`font-bold text-2xl mb-3 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 text-center`}
                    >
                      {category.name}
                    </h3>
  
                    {/* Course count */}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full animate-pulse`} />
                      <span className="font-medium">{category.courses} Courses</span>
                    </div>
  
                    {/* Hover overlay effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                    />
  
                    {/* Corner decorations */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1">
                      <div
                        className={`w-1 h-1 bg-gradient-to-r ${category.gradient} rounded-full animate-ping`}
                        style={{ animationDelay: `${index * 300}ms` }}
                      />
                      <div
                        className={`w-1 h-1 bg-gradient-to-r ${category.gradient} rounded-full animate-ping`}
                        style={{ animationDelay: `${index * 300 + 150}ms` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Enhanced CTA Button */}
            <div className="text-center mt-20">
              <div className="group relative inline-block">
                {/* Button glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-300 animate-pulse" />
  
                <button className="relative px-12 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-full shadow-2xl shadow-purple-500/25 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-purple-500/40 backdrop-blur-sm border border-white/10">
                  <span className="relative z-10">Browse All Categories</span>
  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
  