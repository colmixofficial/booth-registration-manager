// src/app/admin/dashboard/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession, signOut } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { 
  Users, 
  Euro, 
  FileText, 
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Eye,
  UserCog
} from 'lucide-react'

interface Stats {
  totalRegistrations: number
  pendingRegistrations: number
  approvedRegistrations: number
  rejectedRegistrations: number
  paidRegistrations: number
  totalRevenue: number
  averageStandSize: number
  registrationsByCategory: {
    fleaMarket: number
    artisanal: number
  }
  registrationsByType: {
    company: number
    association: number
    private:number
    }
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/stats')
      return response.data
    }
  })

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="btn-secondary flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                View Public Site
              </Link>
              <button onClick={handleSignOut} className="btn-secondary flex items-center text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold">{stats?.totalRegistrations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{stats?.pendingRegistrations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats?.approvedRegistrations || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">€{stats?.totalRevenue || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/registrations" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manage Registrations</h3>
              <p className="text-gray-600">Review, approve, and manage booth registrations</p>
            </div>
          </Link>

          <Link href="/registrations?status=pending" className="card hover:shadow-lg transition-shadow">
            <div className="text-center">
              <FileText className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
              <p className="text-gray-600">
                {stats?.pendingRegistrations || 0} registrations need review
              </p>
            </div>
          </Link>

          {session?.user?.role === 'admin' && (
            <Link href="/admin/users" className="card hover:shadow-lg transition-shadow">
              <div className="text-center">
                <UserCog className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Management</h3>
                <p className="text-gray-600">Manage system users and permissions</p>
              </div>
            </Link>
          )}

          <div className="card">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Event Status</h3>
              <p className="text-gray-600">October 19, 2025</p>
              <p className="text-sm text-gray-500">Registration deadline: Sep 7</p>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Registration Status Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats?.totalRegistrations ? (stats.pendingRegistrations / stats.totalRegistrations) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">{stats?.pendingRegistrations || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats?.totalRegistrations ? (stats.approvedRegistrations / stats.totalRegistrations) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">{stats?.approvedRegistrations || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paid</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats?.totalRegistrations ? (stats.paidRegistrations / stats.totalRegistrations) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">{stats?.paidRegistrations || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ 
                        width: `${stats?.totalRegistrations ? (stats.rejectedRegistrations / stats.totalRegistrations) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-semibold">{stats?.rejectedRegistrations || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Registration Categories</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Flea Market</span>
                  <span className="font-semibold">{stats?.registrationsByCategory.fleaMarket || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats?.totalRegistrations ? (stats.registrationsByCategory.fleaMarket / stats.totalRegistrations) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Artisanal</span>
                  <span className="font-semibold">{stats?.registrationsByCategory.artisanal || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ 
                      width: `${stats?.totalRegistrations ? (stats.registrationsByCategory.artisanal / stats.totalRegistrations) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">Applicant Types</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Companies</span>
                    <span className="font-semibold">{stats?.registrationsByType.company || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Associations</span>
                    <span className="font-semibold">{stats?.registrationsByType.association || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Private</span>
                    <span className="font-semibold">{stats?.registrationsByType.private || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold mb-4">Event Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Average Stand Size</p>
              <p className="text-xl font-bold">{stats?.averageStandSize?.toFixed(1) || 0} m²</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Deadline</p>
              <p className="text-xl font-bold">Sep 7, 2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Event Date</p>
              <p className="text-xl font-bold">Oct 19, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}