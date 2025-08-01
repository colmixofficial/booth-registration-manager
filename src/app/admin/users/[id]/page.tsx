// src/app/admin/users/[id]/page.tsx
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Shield, 
  Calendar,
  User,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  _id: string
  name: string
  email: string
  role: 'admin' | 'moderator'
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axios.get(`/api/users/${id}`)
      return response.data
    },
    enabled: !!id
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/users/${id}`)
    },
    onSuccess: () => {
      toast.success('User deleted successfully')
      router.push('/admin/users')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete user')
    }
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      await axios.put(`/api/users/${id}`, { isActive })
    },
    onSuccess: () => {
      toast.success('User status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user status')
    }
  })

  const handleDelete = () => {
    if (user?._id === session?.user?.id) {
      toast.error('You cannot delete your own account')
      return
    }
    
    if (confirm(`Are you sure you want to delete ${user?.name}? This action cannot be undone.`)) {
      deleteMutation.mutate()
    }
  }

  const handleToggleActive = () => {
    if (!user) return
    
    if (user._id === session?.user?.id && user.isActive) {
      toast.error('You cannot deactivate your own account')
      return
    }
    
    toggleActiveMutation.mutate(!user.isActive)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'moderator':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading user...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
              <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
              <Link href="/admin/users" className="btn-primary">
                Back to Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin/users" className="inline-flex items-center text-primary-600 hover:text-primary-700 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
            <div className="flex items-center">
              <User className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold">User Details</h1>
                {user._id === session?.user?.id && (
                  <span className="text-sm text-blue-600">This is your account</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleToggleActive}
              disabled={toggleActiveMutation.isPending}
              className={`btn-secondary flex items-center ${
                user.isActive ? 'text-yellow-600' : 'text-green-600'
              }`}
            >
              {user.isActive ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <Link href={`/admin/users/${id}/edit`} className="btn-primary flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button 
              onClick={handleDelete} 
              disabled={user._id === session?.user?.id}
              className="btn-secondary flex items-center text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-4">Status & Role</h2>
              <div className="flex space-x-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <a href={`mailto:${user.email}`} className="text-lg font-medium text-primary-600 hover:text-primary-700">
                  {user.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Access Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Access Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium capitalize">{user.role}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {user.role === 'admin' 
                    ? 'Full system access including user management'
                    : 'Can view and manage registrations'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-lg font-medium">
                  {user.lastLogin 
                    ? format(new Date(user.lastLogin), 'MMMM d, yyyy HH:mm')
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="text-lg font-medium">{format(new Date(user.createdAt), 'MMMM d, yyyy HH:mm')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-lg font-medium">{format(new Date(user.updatedAt), 'MMMM d, yyyy HH:mm')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}