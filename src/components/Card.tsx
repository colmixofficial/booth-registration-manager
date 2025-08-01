import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CardProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

export function Card({ icon: Icon, title, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center mb-4 text-primary-600">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="text-gray-600 dark:text-gray-300 text-sm">
        {children}
      </div>
    </div>
  )
}
