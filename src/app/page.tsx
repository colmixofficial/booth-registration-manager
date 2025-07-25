import Link from 'next/link'
import { Calendar, Users, FileText, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hunnefeier 2025 Registration Manager
          </h1>
          <p className="text-xl text-gray-600">
            Sunday, October 19, 2025 - Schengen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/dashboard" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Dashboard</h2>
            <p className="text-gray-600 text-center">View registration overview and statistics</p>
          </Link>

          <Link href="/registrations" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Registrations</h2>
            <p className="text-gray-600 text-center">Manage all booth registrations</p>
          </Link>

          <Link href="/register" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">New Registration</h2>
            <p className="text-gray-600 text-center">Add a new booth registration</p>
          </Link>

          <Link href="/settings" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <Settings className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Settings</h2>
            <p className="text-gray-600 text-center">Configure application settings</p>
          </Link>
        </div>

        <div className="card">
          <h3 className="text-2xl font-semibold mb-4">Event Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Registration Fee</h4>
              <p className="text-gray-600">7€ per meter</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Registration Deadline</h4>
              <p className="text-gray-600">September 7, 2025</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Location</h4>
              <p className="text-gray-600">Schengen, Luxembourg</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
              <p className="text-gray-600">info@si-schengen.lu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}