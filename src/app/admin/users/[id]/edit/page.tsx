// src/app/admin/users/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Shield, Save } from 'lucide-react'
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

export default function EditUserPage() {
  const router = useRouter()
  const { id } = useParams()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'moderator' as 'admin' | 'moderator',
    isActive: true,
    password: ''
  })

  // Fetch user data
  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axios.get(`/api/users/${id}`)
      return response.data
    },
    enabled: !!id
  })

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        password: ''
      })
    }
  }, [user])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const updateData: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive
      }
      
      // Only include password if it's provided
      if (data.password.trim()) {
        updateData.password = data.password
      }

      const response = await axios.put(`/api/users/${id}`, updateData)
      return response.data
    },
    onSuccess: () => {
      toast.success('User updated successfully!')
      router.push(`/admin/users/${id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update user')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
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
        {/* Header */}
        <div className="mb-8">
          <Link href={`/admin/users/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to User Details
          </Link>
          
          <div className="flex items-center">
            <User className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600">{user.name}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="user@example.com"
                />
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Security & Access</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Leave blank to keep current password"
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 6 characters. Leave blank to keep current password.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="moderator"
                      checked={formData.role === 'moderator'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'moderator' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Moderator</div>
                      <div className="text-sm text-gray-500">Can view and manage registrations</div>
                    </div>
                  </label>
                  <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Administrator</div>
                      <div className="text-sm text-gray-500">Full system access including user management</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-3 h-4 w-4"
                    disabled={user._id === session?.user?.id}
                  />
                  <div>
                    <span className="font-medium text-gray-900">Active User</span>
                    <div className="text-sm text-gray-500">
                      User can log in and access the system
                      {user._id === session?.user?.id && ' (Cannot deactivate your own account)'}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6">
            <Link
              href={`/admin/users/${id}`}
              className="btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center"
            >
              {updateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}