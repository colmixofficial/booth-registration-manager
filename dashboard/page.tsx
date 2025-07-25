// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import Link from 'next/link'
// import { ArrowLeft, Users, Euro, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'

// interface DashboardStats {
//   totalRegistrations: number
//   pendingRegistrations: number
//   approvedRegistrations: number
//   rejectedRegistrations: number
//   paidRegistrations: number
//   totalRevenue: number
//   averageStandSize: number
//   registrationsByCategory: {
//     fleaMarket: number
//     artisanal: number
//   }
//   registrationsByType: {
//     company: number
//     association: number
//     private: number
//   }
// }

// export default function DashboardPage() {
//   const { data: stats, isLoading } = useQuery({
//     queryKey: ['dashboard-stats'],
//     queryFn: async () => {
//       const response = await axios.get('/api/dashboard/stats')
//       return response.data as DashboardStats
//     }
//   })

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="card">Loading dashboard...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center mb-6">
//           <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mr-4">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Link>
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Registrations</p>
//                 <p className="text-3xl font-bold text-gray-900">{stats?.totalRegistrations || 0}</p>
//               </div>
//               <Users className="h-12 w-12 text-primary-600" />
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//                 <p className="text-3xl font-bold text-gray-900">€{stats?.totalRevenue || 0}</p>
//               </div>
//               <Euro className="h-12 w-12 text-green-600" />
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Pending</p>
//                 <p className="text-3xl font-bold text-yellow-600">{stats?.pendingRegistrations || 0}</p>
//               </div>
//               <Clock className="h-12 w-12 text-yellow-600" />
//             </div>
//           </div>

//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Approved</p>
//                 <p className="text-3xl font-bold text-green-600">{stats?.approvedRegistrations || 0}</p>
//               </div>
//               <CheckCircle className="h-12 w-12 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Status Breakdown */}
//           <div className="card">
//             <h2 className="text-xl font-semibold mb-4">Registration Status</h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-gray-600">Pending</span>
//                   <span className="text-sm font-semibold">{stats?.pendingRegistrations || 0}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-yellow-500 h-2 rounded-full" 
//                     style={{ width: `${((stats?.pendingRegistrations || 0) / (stats?.totalRegistrations || 1)) * 100}%` }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-gray-600">Approved</span>
//                   <span className="text-sm font-semibold">{stats?.approvedRegistrations || 0}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-green-500 h-2 rounded-full" 
//                     style={{ width: `${((stats?.approvedRegistrations || 0) / (stats?.totalRegistrations || 1)) * 100}%` }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-gray-600">Paid</span>
//                   <span className="text-sm font-semibold">{stats?.paidRegistrations || 0}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full" 
//                     style={{ width: `${((stats?.paidRegistrations || 0) / (stats?.totalRegistrations || 1)) * 100}%` }}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="text-sm font-medium text-gray-600">Rejected</span>
//                   <span className="text-sm font-semibold">{stats?.rejectedRegistrations || 0}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-red-500 h-2 rounded-full" 
//                     style={{ width: `${((stats?.rejectedRegistrations || 0) / (stats?.totalRegistrations || 1)) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Category Breakdown */}
//           <div className="card">
//             <h2 className="text-xl font-semibold mb-4">Registration Categories</h2>
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">By Product Category</h3>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-600">Flea Market</span>
//                   <span className="text-sm font-semibold">{stats?.registrationsByCategory.fleaMarket || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Artisanal</span>
//                   <span className="text-sm font-semibold">{stats?.registrationsByCategory.artisanal || 0}</span>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-sm font-medium text-gray-700 mb-3">By Applicant Type</h3>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-600">Companies</span>
//                   <span className="text-sm font-semibold">{stats?.registrationsByType.company || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-600">Associations</span>
//                   <span className="text-sm font-semibold">{stats?.registrationsByType.association || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Private Persons</span>
//                   <span className="text-sm font-semibold">{stats?.registrationsByType.private || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Additional Stats */}
//         <div className="card mt-6">
//           <h2 className="text-xl font-semibold mb-4">Additional Statistics</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Average Stand Size</p>
//               <p className="text-2xl font-bold text-green-600">
//                 €{stats?.paidRegistrations ? (stats.paidRegistrations * 7 * (stats.averageStandSize / stats.totalRegistrations)).toFixed(0) : '0'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="card mt-6">
//           <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//           <div className="flex flex-wrap gap-4">
//             <Link href="/registrations?status=pending" className="btn-primary">
//               View Pending Registrations
//             </Link>
//             <Link href="/register" className="btn-secondary">
//               Add New Registration
//             </Link>
//             <Link href="/registrations" className="btn-secondary">
//               View All Registrations
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }