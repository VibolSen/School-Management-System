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
} from "lucide-react";

export default function HomeSection() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-lg rotate-45 blur-lg animate-bounce" />
        <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-md animate-pulse delay-1000" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full border border-blue-200/50 mb-8 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-blue-700 tracking-wide">
              Empowering Global Education
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-8 text-balance leading-tight">
            Transform Your Learning Journey
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto text-balance leading-relaxed font-medium">
            We are passionate about empowering learners worldwide with
            high-quality, accessible & engaging education that opens doors to
            endless possibilities.
          </p>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-pink-500/3" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-2xl animate-pulse delay-500" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-emerald-200/50 mb-8 shadow-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-emerald-600 animate-bounce" />
              <span className="text-sm font-semibold text-emerald-700 tracking-wide">
                Our Global Impact
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 via-emerald-900 to-blue-900 bg-clip-text text-transparent mb-8 text-balance">
              Trusted by Thousands Worldwide
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Join our thriving community of learners and educators making a
              difference across the globe.
            </p>
          </div>

          {/* Fancy Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Card 1: Instructors */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-blue-500/25 group-hover:-translate-y-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Briefcase className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-125 transition-transform duration-500">
                  25+
                </div>

                <div className="text-slate-700 font-semibold text-center text-sm">
                  Professional Instructors
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                </div>
              </div>
            </div>

            {/* Card 2: Students */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-300" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-emerald-500/25 group-hover:-translate-y-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-125 transition-transform duration-500">
                  56k
                </div>

                <div className="text-slate-700 font-semibold text-center text-sm">
                  Students Enrolled
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>

            {/* Card 3: Courses */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-300 animate-pulse delay-600" />

              <div className="relative flex flex-col items-center p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-orange-500/25 group-hover:-translate-y-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <BookOpen className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-125 transition-transform duration-500">
                  170+
                </div>

                <div className="text-slate-700 font-semibold text-center text-sm">
                  Courses Available
                </div>

                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-400" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Achievement Badge */}
          <div className="flex justify-center mt-20">
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-30 group-hover:opacity-70 transition duration-1000" />
              <div className="relative flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-full border border-white/40 shadow-2xl group-hover:scale-105 transition-all duration-500">
                <Award className="w-6 h-6 text-purple-600 animate-pulse" />
                <span className="text-lg font-bold text-slate-800">
                  Rated #1 Online Learning Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Top Categories Section */}
      <section className="py-28 px-4 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-pink-500/3 to-rose-500/3" />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-br from-pink-400/8 to-rose-400/8 rounded-full blur-3xl animate-pulse delay-1500" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-200/50 mb-8 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 tracking-wide">
                Popular Categories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-8 text-balance">
              Explore Top Categories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Discover the perfect course for your journey from our
              comprehensive range of expertly crafted categories.
            </p>
          </div>

          {/* Enhanced Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${category.bgGradient} rounded-2xl blur-lg opacity-15 group-hover:opacity-50 transition duration-1000 group-hover:duration-300 animate-pulse`}
                  style={{ animationDelay: `${index * 200}ms` }}
                />

                <div className="relative flex flex-col items-center p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2 cursor-pointer">
                  <div className="relative mb-4">
                    <div
                      className={`absolute -inset-4 bg-gradient-to-r ${category.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-all duration-700`}
                    />

                    <div
                      className={`relative flex items-center justify-center w-14 h-14 bg-gradient-to-r ${category.gradient} rounded-2xl shadow-2xl group-hover:shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-125`}
                    >
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                    </div>

                    <div
                      className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full opacity-80 animate-bounce shadow-lg"
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/90 rounded-full opacity-60 animate-bounce shadow-md"
                      style={{ animationDelay: `${index * 150 + 200}ms` }}
                    />
                  </div>

                  <h3
                    className={`font-black text-lg mb-2 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500 text-center`}
                  >
                    {category.name}
                  </h3>

                  <div className="flex items-center gap-3 text-slate-700">
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full animate-pulse`}
                    />
                    <span className="font-semibold text-sm">
                      {category.courses} Courses
                    </span>
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-700`}
                  />

                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full animate-ping`}
                      style={{ animationDelay: `${index * 300}ms` }}
                    />
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full animate-ping`}
                      style={{ animationDelay: `${index * 300 + 150}ms` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Button */}
          <div className="text-center mt-24">
            <div className="group relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-300 animate-pulse" />

              <button className="relative px-16 py-5 text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-full shadow-2xl shadow-purple-500/30 transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-purple-500/50 backdrop-blur-sm border border-white/20">
                <span className="relative z-10">Browse All Categories</span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
