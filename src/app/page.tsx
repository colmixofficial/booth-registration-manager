import Link from 'next/link'
import { Calendar, Users, FileText, Settings, ArrowRight } from 'lucide-react'
import { Card } from '@/src/components/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-500">
            Hunnefeier
          </Link>
          <div className="space-x-4">
            <Link href="#info" className="hover:text-primary-600 transition">Info</Link>
            <Link href="#register" className="hover:text-primary-600 transition">Register</Link>
            <Link href="/admin/login" className="hover:text-primary-600 transition">Admin</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            Hunnefeier 2025
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Sunday, October 19, 2025 &bull; Schengen, Luxembourg
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-semibold shadow-lg transition"
              aria-label="Register a booth"
            >
              Register Your Booth <ArrowRight className="ml-2" />
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white rounded-lg text-white hover:bg-white hover:text-primary-600 transition"
              aria-label="Admin login"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Event Information */}
      <section id="info" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Event Information
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            All the details you need for Hunnefeier 2025.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card icon={Calendar} title="Date & Time">
            <p>Sunday, October 19, 2025</p>
            <p>8:00 AM &ndash; 6:00 PM</p>
          </Card>

          <Card icon={Users} title="Registration Fee">
            <p>€7 per meter</p>
            <p className="text-xs text-gray-500">(Stand length)</p>
          </Card>

          <Card icon={FileText} title="Deadline">
            <p>September 7, 2025</p>
            <p className="text-xs text-gray-500">Don't miss out!</p>
          </Card>

          <Card icon={Settings} title="Location">
            <p>Schengen, Luxembourg</p>
          </Card>
        </div>
      </section>

      {/* Registration CTA */}
      <section id="register" className="bg-primary-50 dark:bg-gray-800 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to Register?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join vendors from across the region for this popular annual event.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow transition"
          >
            Start Registration <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact */}
      <footer className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Organizer
            </h4>
            <p className="text-gray-600 dark:text-gray-400">SI Schengen</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </h4>
            <a
              href="mailto:info@si-schengen.lu"
              className="text-primary-600 hover:text-primary-700 transition"
            >
              info@si-schengen.lu
            </a>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Flea Market • Artisanal Crafts
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Languages
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              English • Français • Deutsch
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
