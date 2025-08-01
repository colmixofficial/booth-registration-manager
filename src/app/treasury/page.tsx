'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Euro, 
  Download,
  Check,
  X,
  Clock,
  Filter,
  Search,
  CreditCard,
  Receipt,
  TrendingUp,
  Users,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Registration {
  _id: string
  applicantType: string
  companyName?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  standLength: number
  standDepth: number
  standNumber?: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  totalFee: number
  paymentDate?: string
  paymentMethod?: string
  paymentReference?: string
  createdAt: string
}

export default function TreasuryPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'bank_transfer',
    paymentReference: '',
    paymentDate: new Date().toISOString().split('T')[0]
  })

  // Fetch registrations
  const { data: registrations, isLoading, refetch } = useQuery({
    queryKey: ['treasury-registrations', search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: '1000', // Get all registrations for treasury
        ...(search && { search }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })
      const response = await axios.get(`/api/registrations?${params}`)
      return response.data.registrations
    }
  })

  // Mark as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async (data: { id: string; paymentData: any }) => {
      const response = await axios.put(`/api/registrations/${data.id}`, {
        status: 'paid',
        ...data.paymentData
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Payment recorded successfully')
      setShowPaymentModal(false)
      setSelectedRegistration(null)
      refetch()
    },
    onError: () => {
      toast.error('Failed to record payment')
    }
  })

  // Calculate statistics
  const stats = registrations ? {
    totalRegistrations: registrations.length,
    paidRegistrations: registrations.filter((r: Registration) => r.status === 'paid').length,
    pendingPayments: registrations.filter((r: Registration) => r.status === 'approved').length,
    totalRevenue: registrations
      .filter((r: Registration) => r.status === 'paid')
      .reduce((sum: number, r: Registration) => sum + r.totalFee, 0),
    expectedRevenue: registrations
      .filter((r: Registration) => r.status === 'approved' || r.status === 'paid')
      .reduce((sum: number, r: Registration) => sum + r.totalFee, 0),
    outstandingAmount: registrations
      .filter((r: Registration) => r.status === 'approved')
      .reduce((sum: number, r: Registration) => sum + r.totalFee, 0)
  } : null

  const handleMarkAsPaid = () => {
    if (!selectedRegistration) return
    
    markAsPaidMutation.mutate({
      id: selectedRegistration._id,
      paymentData
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="h-4 w-4" />
      case 'approved':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const exportToCSV = () => {
    if (!registrations) return

    const headers = ['Name', 'Company', 'Email', 'Phone', 'Stand Size', 'Fee (€)', 'Status', 'Payment Date', 'Payment Method', 'Reference']
    const rows = registrations.map((r: Registration) => [
      `${r.firstName} ${r.lastName}`,
      r.companyName || '',
      r.email,
      r.phone,
      `${r.standLength}m × ${r.standDepth}m`,
      r.totalFee,
      r.status,
      r.paymentDate ? format(new Date(r.paymentDate), 'yyyy-MM-dd') : '',
      r.paymentMethod || '',
      r.paymentReference || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `treasury-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
            <h1 className="text-3xl font-bold">Treasury Management</h1>
          </div>
          <button onClick={exportToCSV} className="btn-primary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">€{stats.totalRevenue}</p>
                  <p className="text-xs text-gray-500 mt-1">Collected</p>
                </div>
                <Euro className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-3xl font-bold text-orange-600">€{stats.outstandingAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">To collect</p>
                </div>
                <CreditCard className="h-12 w-12 text-orange-600 opacity-20" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Registrations</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.paidRegistrations}</p>
                  <p className="text-xs text-gray-500 mt-1">of {stats.totalRegistrations} total</p>
                </div>
                <Users className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expected Total</p>
                  <p className="text-3xl font-bold text-purple-600">€{stats.expectedRevenue}</p>
                  <p className="text-xs text-gray-500 mt-1">When all paid</p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Awaiting Payment</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending Approval</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="ml-3">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : registrations?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  registrations?.map((registration: Registration) => (
                    <tr key={registration._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.firstName} {registration.lastName}
                          </div>
                          {registration.companyName && (
                            <div className="text-sm text-gray-500">{registration.companyName}</div>
                          )}
                          <div className="text-xs text-gray-400 capitalize">{registration.applicantType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.email}</div>
                        <div className="text-sm text-gray-500">{registration.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {registration.standLength}m × {registration.standDepth}m
                        </div>
                        {registration.standNumber && (
                          <div className="text-sm text-gray-500">Stand #{registration.standNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">€{registration.totalFee}</div>
                        <div className="text-xs text-gray-500">{registration.standLength}m × €7/m</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(registration.status)}`}>
                              {getStatusIcon(registration.status)}
                              <span className="ml-1">{registration.status}</span>
                            </span>
                          </div>
                          {registration.paymentDate && (
                            <div className="text-xs text-gray-500">
                              Paid: {format(new Date(registration.paymentDate), 'MMM d, yyyy')}
                            </div>
                          )}
                          {registration.paymentMethod && (
                            <div className="text-xs text-gray-500">
                              Via: {registration.paymentMethod.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/registrations/${registration._id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View Details"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                          {registration.status === 'approved' && (
                            <button
                              onClick={() => {
                                setSelectedRegistration(registration)
                                setShowPaymentModal(true)
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Paid"
                            >
                              <Receipt className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Applicant</p>
                <p className="font-medium">
                  {selectedRegistration.firstName} {selectedRegistration.lastName}
                  {selectedRegistration.companyName && ` - ${selectedRegistration.companyName}`}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Amount Due</p>
                <p className="text-2xl font-bold text-green-600">€{selectedRegistration.totalFee}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="input-field"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={paymentData.paymentReference}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentReference: e.target.value })}
                  className="input-field"
                  placeholder="Transaction ID, Check number, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setSelectedRegistration(null)
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={markAsPaidMutation.isPending}
                className="btn-primary"
              >
                {markAsPaidMutation.isPending ? 'Recording...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}