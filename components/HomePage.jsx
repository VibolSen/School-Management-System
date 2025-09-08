// components/LandingPage.jsx
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Online is now <br />
                <span className="text-blue-600">much easier</span>
              </h1>
              <p className="text-lg mb-8">
                TOTC is an interesting platform that will teach you in more an
                interactive way
              </p>
              <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-8">
                <p className="font-semibold">Congratulations</p>
                <p>Your admission completed</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
                Join for free
              </button>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs mx-auto">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">User Experience Class</p>
                    <p className="text-sm text-gray-500">Today at 12.00 PM</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Success</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Ornare id fames interdum porttitor nulla turpis etiam. Diam vitae
            sollicitudin at nec nam et pharetra gravida. Adipiscing a quis
            ultrices eu ornare tristique vel nisl orci.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">15K+</p>
              <p className="text-gray-600">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">75%</p>
              <p className="text-gray-600">Total success</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">35</p>
              <p className="text-gray-600">Main questions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">26</p>
              <p className="text-gray-600">Chief experts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">16</p>
              <p className="text-gray-600">Years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            All-In-One Cloud Software.
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            TOTC is one powerful online software suite that combines all the
            tools needed to run a successful school or office.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">B</span>
              </div>
              <h3 className="font-bold text-lg mb-3">
                Online Billing, Invoicing, & Contracts
              </h3>
              <p className="text-gray-600">
                Simple and secure control of your organization's financial and
                legal transactions. Send customized invoices and contracts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">S</span>
              </div>
              <h3 className="font-bold text-lg mb-3">
                Easy Scheduling & Attendance Tracking
              </h3>
              <p className="text-gray-600">
                Schedule and reserve classrooms at one campus or multiple
                campuses. Keep detailed records of student attendance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">C</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Customer Tracking</h3>
              <p className="text-gray-600">
                Automate and track emails to individuals or groups. Skilline's
                built-in system helps organize your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is TOTC Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What is TOTC?</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            TOTC is a platform that allows educators to create online classes
            whereby they can store the course materials online; manage
            assignments, quizzes and exams; monitor due dates; grade results and
            provide students with feedback all in one place.
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center max-w-xs">
              <h3 className="font-bold text-lg mb-4">FOR INSTRUCTORS</h3>
              <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium">
                Start a class today
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center max-w-xs">
              <h3 className="font-bold text-lg mb-4">FOR STUDENTS</h3>
              <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium">
                Enter access code
              </button>
            </div>
          </div>

          <div className="mt-16 bg-blue-50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-4">
                  Everything you can do in a physical classroom, you can do with
                  TOTC
                </h3>
                <p className="text-gray-600 mb-6">
                  TOTC's school management software helps traditional and online
                  schools manage scheduling, attendance, payments and virtual
                  classrooms all in one secure cloud-based system.
                </p>
                <a href="#" className="text-blue-600 font-semibold underline">
                  Learn more
                </a>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md w-64 h-64 flex items-center justify-center">
                  <p className="text-center">Classroom Illustration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Features Section */}
      <section className="py-16 bg-gray-50 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Features</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            This very extraordinary feature, can make learning activities more
            efficient
          </p>

          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
                <h3 className="font-bold text-xl mb-4">
                  A user interface designed for the classroom
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span>
                      Teachers don't get lost in the grid view and have a
                      dedicated Podium space.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span>
                      TA's and presenters can be moved to the front of the
                      class.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <span>
                      Teachers can easily see all students and class data at one
                      time.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md w-64 h-64 flex items-center justify-center">
                <p className="text-center">UI Illustration</p>
              </div>
            </div>
          </div>

          {/* Additional features would go here following the same pattern */}

          <div className="text-center mt-8">
            <button className="text-blue-600 font-semibold underline">
              See more features
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            What They Say?
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            TOTC has got more than 100k positive ratings from our users around
            the world.
          </p>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Some of the students and teachers were greatly helped by the
            Skilline.
          </p>

          <div className="bg-blue-50 rounded-xl p-8 max-w-3xl mx-auto">
            <div className="flex items-start mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-bold">Gloria Rose</h4>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                  <span className="ml-2 text-sm text-gray-600">
                    12 reviews at Yelp
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 italic mb-6">
              "Thank you so much for your help. It's exactly what I've been
              looking for. You won't regret it. It really saves me time and
              effort. TOTC is exactly what our business has been lacking."
            </p>
            <div className="flex justify-between items-center">
              <div></div>
              <button className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium">
                Leave your assessment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Lastest News and Resources
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            See the developments that have occurred to TOTC in the world
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* News Item 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">
                  Class Technologies Inc. Closes $30 Million Series A Financing
                  to Meet High Demand
                </h3>
                <p className="text-gray-600 mb-4">
                  Class Technologies Inc., the company that created Class...
                </p>
                <a href="#" className="text-blue-600 font-semibold">
                  Read more
                </a>
              </div>
            </div>

            {/* News Item 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">
                  Zoom's earliest investors are betting millions on a better
                  Zoom for schools
                </h3>
                <p className="text-gray-600 mb-4">
                  Zoom was never created to be a consumer product. Nonetheless,
                  the...
                </p>
                <a href="#" className="text-blue-600 font-semibold">
                  Read more
                </a>
              </div>
            </div>

            {/* News Item 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3">
                  Former Blackboard CEO Raises $16M to Bring LMS Features to
                  Zoom Classrooms
                </h3>
                <p className="text-gray-600 mb-4">
                  This year, investors have reaped big financial returns from
                  betting on Zoom...
                </p>
                <a href="#" className="text-blue-600 font-semibold">
                  Read more
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">TOTC</h3>
              <p className="text-gray-400 mt-2">
                Virtual classroom for everyone
              </p>
            </div>
            <div className="flex space-x-6">
              <button className="bg-white text-gray-800 py-2 px-6 rounded-lg font-medium">
                Join for free
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 TOTC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
