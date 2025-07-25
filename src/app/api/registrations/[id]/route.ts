// src/app/api/registrations/[id]/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/src/lib/mongodb'
import Registration from '@/src/models/Registration'

async function withDb<T>(fn: () => Promise<T>) {
  try {
    await dbConnect()
    return await fn()
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function GET(request: Request, context: any) {
  const { id } = context.params
  return withDb(async () => {
    const reg = await Registration.findById(id)
    if (!reg) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(reg)
  }).catch(() =>
    NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  )
}

export async function PUT(request: Request, context: any) {
  const { id } = context.params
  return withDb(async () => {
    const data = await request.json()
    const reg = await Registration.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
    if (!reg) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(reg)
  }).catch(() =>
    NextResponse.json({ error: 'Update failed' }, { status: 500 })
  )
}

export async function DELETE(request: Request, context: any) {
  const { id } = context.params
  return withDb(async () => {
    const reg = await Registration.findByIdAndDelete(id)
    if (!reg) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Deleted successfully' })
  }).catch(() =>
    NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  )
}
