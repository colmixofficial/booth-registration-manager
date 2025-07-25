import { NextResponse } from 'next/server'
import dbConnect from '@/src/lib/mongodb'
import Registration from '@/src/models/Registration'

export async function GET() {
  try {
    await dbConnect()

    // Get all registrations for calculations
    const registrations = await Registration.find({}).lean()

    // Calculate statistics
    const stats = {
      totalRegistrations: registrations.length,
      pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
      approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
      rejectedRegistrations: registrations.filter(r => r.status === 'rejected').length,
      paidRegistrations: registrations.filter(r => r.status === 'paid').length,
      totalRevenue: registrations.reduce((sum, r) => sum + r.totalFee, 0),
      averageStandSize: registrations.length > 0 
        ? registrations.reduce((sum, r) => sum + (r.standLength * r.standDepth), 0) / registrations.length 
        : 0,
      registrationsByCategory: {
        fleaMarket: registrations.filter(r => r.productCategory === 'fleaMarket').length,
        artisanal: registrations.filter(r => r.productCategory === 'artisanal').length,
      },
      registrationsByType: {
        company: registrations.filter(r => r.applicantType === 'company').length,
        association: registrations.filter(r => r.applicantType === 'association').length,
        private: registrations.filter(r => r.applicantType === 'private').length,
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}