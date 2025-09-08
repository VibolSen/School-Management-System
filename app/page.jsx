
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold">Welcome to the University Management System</h1>
        <p className="mt-4 text-lg">Please select a dashboard from the navigation menu.</p>
      </main> */}
      <Footer />
    </>
  );
}