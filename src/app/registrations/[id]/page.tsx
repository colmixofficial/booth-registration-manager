'use client'
export const dynamic = 'force-dynamic'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Euro } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegistrationDetailPage() {
const router = useRouter()
const { id } = useParams()      // ← grab the `[id]`

  const { data: registration, isLoading } = useQuery({
    queryKey: ['registration', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axios.get(`/api/registrations/${id}`)
      return response.data
    },
    enabled: !!id
  })

// if (!id) return <div>Missing ID</div>

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await axios.put(`/api/registrations/${id}`, { status })
      return response.data
    },
    onSuccess: () => {
      toast.success('Status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update status')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/registrations/${id}`)
    },
    onSuccess: () => {
      toast.success('Registration deleted successfully')
      router.push('/registrations')
    },
    onError: () => {
      toast.error('Failed to delete registration')
    }
  })

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this registration?')) {
      deleteMutation.mutate()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">Loading...</div>
        </div>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">Registration not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/registrations" className="inline-flex items-center text-primary-600 hover:text-primary-700 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-3xl font-bold">Registration Details</h1>
          </div>
          <div className="flex space-x-2">
            <Link href={`/registrations/${id}/edit`} className="btn-primary flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-secondary flex items-center text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
              </span>
            </div>
            <div className="flex space-x-2">
              <select
                value={registration.status}
                onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          {registration.standNumber && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Stand Number</p>
              <p className="text-lg font-semibold">{registration.standNumber}</p>
            </div>
          )}
        </div>

        {/* Applicant Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Applicant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium capitalize">{registration.applicantType}</p>
            </div>
            {registration.companyName && (
              <div>
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="font-medium">{registration.companyName}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{registration.firstName} {registration.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Birth Date</p>
              <p className="font-medium">{format(new Date(registration.birthDate), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Birth Place</p>
              <p className="font-medium">{registration.birthPlace}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a href={`mailto:${registration.email}`} className="font-medium text-primary-600 hover:text-primary-700">
                  {registration.email}
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <a href={`tel:${registration.phone}`} className="font-medium text-primary-600 hover:text-primary-700">
                  {registration.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">
                  {registration.address}<br />
                  {registration.postalCode} {registration.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stand Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Stand Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Product Type</p>
              <p className="font-medium">{registration.productType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product Category</p>
              <p className="font-medium capitalize">
                {registration.productCategory === 'fleaMarket' ? 'Flea Market' : 'Artisanal'}
              </p>
            </div>
            {registration.artisanalType && (
              <div>
                <p className="text-sm text-gray-600">Artisanal Type</p>
                <p className="font-medium">{registration.artisanalType}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Demonstration</p>
              <p className="font-medium">{registration.demonstration ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stand Dimensions</p>
              <p className="font-medium">{registration.standLength}m × {registration.standDepth}m</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stand Type</p>
              <p className="font-medium">
                {registration.standType === 'tent' && 'Tent without car'}
                {registration.standType === 'carStand' && 'Stand with car'}
                {registration.standType === 'carTrailerStand' && 'Stand with car and trailer'}
                {registration.standType === 'salesVehicle' && 'Sales vehicle'}
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Electricity</p>
              {registration.electricity.needed ? (
                <div>
                  <p className="font-medium">Yes</p>
                  <p className="text-sm">
                    Type: {registration.electricity.type}
                    {registration.electricity.watts && ` (${registration.electricity.watts}W)`}
                  </p>
                </div>
              ) : (
                <p className="font-medium">No</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Water</p>
              <p className="font-medium">{registration.water ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Fee Information</h2>
          <div className="flex items-center">
            <Euro className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Fee</p>
              <p className="text-2xl font-bold">€{registration.totalFee}</p>
              <p className="text-sm text-gray-500">({registration.standLength}m × €7/m)</p>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {registration.remarks && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Remarks</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{registration.remarks}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Registration Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-medium">{format(new Date(registration.createdAt), 'MMMM d, yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{format(new Date(registration.updatedAt), 'MMMM d, yyyy HH:mm')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}