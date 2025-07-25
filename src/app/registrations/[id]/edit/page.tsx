'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axios from 'axios'
import Link from 'next/link'
import { ArrowLeft, User, Building, MapPin, Zap, ShoppingBag, MessageSquare } from 'lucide-react'

interface FormData {
  applicantType: 'company' | 'association' | 'private'
  companyName?: string
  firstName: string
  lastName: string
  birthDate: string
  birthPlace: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  productType: string
  standLength: number
  standDepth: number
  standType: 'tent' | 'carStand' | 'carTrailerStand' | 'salesVehicle'
  electricityNeeded: boolean
  electricityType?: '240v-lighting' | '240v-high' | '400v'
  watts?: number
  water: boolean
  productCategory: 'fleaMarket' | 'artisanal'
  artisanalType?: string
  demonstration: boolean
  remarks?: string
}

export default function EditRegistrationPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>()

  // Fetch existing registration data
  const { data: registration, isLoading } = useQuery({
    queryKey: ['registration', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axios.get(`/api/registrations/${id}`)
      return response.data
    },
    enabled: !!id
  })

  // Populate form with existing data
  useEffect(() => {
    if (registration) {
      const formData = {
        ...registration,
        birthDate: registration.birthDate ? new Date(registration.birthDate).toISOString().split('T')[0] : '',
        electricityNeeded: registration.electricity?.needed || false,
        electricityType: registration.electricity?.type,
        watts: registration.electricity?.watts
      }
      reset(formData)
    }
  }, [registration, reset])

  const applicantType = watch('applicantType')
  const electricityNeeded = watch('electricityNeeded')
  const productCategory = watch('productCategory')

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formattedData = {
        ...data,
        birthDate: new Date(data.birthDate),
        electricity: {
          needed: data.electricityNeeded,
          type: data.electricityType,
          watts: data.watts ? parseInt(data.watts.toString()) : undefined
        }
      }
      const response = await axios.put(`/api/registrations/${id}`, formattedData)
      return response.data
    },
    onSuccess: () => {
      toast.success('Registration updated successfully!')
      router.push(`/registrations/${id}`)
    },
    onError: () => {
      toast.error('Failed to update registration')
    }
  })

  const onSubmit = async (data: FormData) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading registration...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration not found</h2>
              <p className="text-gray-600 mb-6">The registration you're looking for doesn't exist.</p>
              <Link href="/registrations" className="btn-primary">
                Back to Registrations
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
          <Link href={`/registrations/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration Details
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Registration</h1>
            <p className="text-gray-600">{registration.firstName} {registration.lastName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Applicant Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Applicant Information</h2>
            </div>

            <div className="space-y-6">
              {/* Applicant Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am / Je suis / Ich bin *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="company"
                      {...register('applicantType', { required: 'Please select applicant type' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Company</div>
                      <div className="text-sm text-gray-500">Une société / Eine Firma</div>
                    </div>
                  </label>
                  <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="association"
                      {...register('applicantType', { required: 'Please select applicant type' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Association</div>
                      <div className="text-sm text-gray-500">Une association / Ein Verein</div>
                    </div>
                  </label>
                  <label className="relative flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="private"
                      {...register('applicantType', { required: 'Please select applicant type' })}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Private Person</div>
                      <div className="text-sm text-gray-500">Une personne privée / Eine Privatperson</div>
                    </div>
                  </label>
                </div>
                {errors.applicantType && <p className="text-red-500 text-sm mt-2">{errors.applicantType.message}</p>}
              </div>

              {/* Company Name (conditional) */}
              {applicantType === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name / Société / Firma *
                  </label>
                  <input
                    type="text"
                    {...register('companyName', { required: applicantType === 'company' ? 'Company name is required' : false })}
                    className="input-field"
                    placeholder="Enter your company name"
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name / Prénom / Vorname *
                  </label>
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name / Nom / Name *
                  </label>
                  <input
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Date / Date de naissance / Geburtsdatum *
                  </label>
                  <input
                    type="date"
                    {...register('birthDate', { required: 'Birth date is required' })}
                    className="input-field"
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Place / Lieu de naissance / Geburtsort *
                  </label>
                  <input
                    type="text"
                    {...register('birthPlace', { required: 'Birth place is required' })}
                    className="input-field"
                    placeholder="Enter your birth place"
                  />
                  {errors.birthPlace && <p className="text-red-500 text-sm mt-1">{errors.birthPlace.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address / Adresse postale / Postanschrift *
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="input-field"
                  placeholder="Enter your full address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code / C.P. / PLZ *
                  </label>
                  <input
                    type="text"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    className="input-field"
                    placeholder="e.g., 5445"
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City / Localité / Ort *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                    placeholder="e.g., Schengen"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone / T. / GSM *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="input-field"
                    placeholder="+352 12 34 56 78"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Stand Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Building className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Stand Information</h2>
            </div>

            <div className="space-y-6">
              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type / Genre de produits / Art der Produkte *
                </label>
                <textarea
                  {...register('productType', { required: 'Product type is required' })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what you will be selling (e.g., handmade jewelry, vintage clothing, food items...)"
                />
                {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType.message}</p>}
              </div>

              {/* Stand Dimensions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stand Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (meters) / Longueur / Länge *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('standLength', { 
                        required: 'Stand length is required',
                        min: { value: 1, message: 'Minimum length is 1m' }
                      })}
                      className="input-field"
                      placeholder="e.g., 3"
                    />
                    {errors.standLength && <p className="text-red-500 text-sm mt-1">{errors.standLength.message}</p>}
                    <p className="text-sm text-gray-500 mt-1">Fee: 7€ per meter</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth (meters) / Profondeur / Tiefe *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('standDepth', { 
                        required: 'Stand depth is required',
                        min: { value: 1, message: 'Minimum depth is 1m' }
                      })}
                      className="input-field"
                      placeholder="e.g., 3"
                    />
                    {errors.standDepth && <p className="text-red-500 text-sm mt-1">{errors.standDepth.message}</p>}
                  </div>
                </div>
              </div>

              {/* Stand Type */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stand Type / Genre du stand / Art des Standes *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="tent"
                      {...register('standType', { required: 'Please select stand type' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Tent without car</div>
                      <div className="text-sm text-gray-500">Pavillon sans voiture ou remorque</div>
                    </div>
                  </label>
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="carStand"
                      {...register('standType', { required: 'Please select stand type' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Stand with car (min 6m)</div>
                      <div className="text-sm text-gray-500">Stand avec voiture</div>
                    </div>
                  </label>
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="carTrailerStand"
                      {...register('standType', { required: 'Please select stand type' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Stand with car and trailer (min 9m)</div>
                      <div className="text-sm text-gray-500">Stand avec voiture et remorque</div>
                    </div>
                  </label>
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="salesVehicle"
                      {...register('standType', { required: 'Please select stand type' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Sales vehicle</div>
                      <div className="text-sm text-gray-500">Véhicule de vente</div>
                    </div>
                  </label>
                </div>
                {errors.standType && <p className="text-red-500 text-sm mt-2">{errors.standType.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Utilities */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Zap className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Utilities & Requirements</h2>
            </div>

            <div className="space-y-6">
              {/* Electricity */}
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    {...register('electricityNeeded')}
                    className="mr-3 h-4 w-4"
                  />
                  <label className="text-base font-medium text-gray-900">
                    I need electricity / J'ai besoin d'électricité / Ich benötige Strom
                  </label>
                </div>

                {electricityNeeded && (
                  <div className="ml-7 space-y-3 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Electricity Type *</h4>
                    <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        value="240v-lighting"
                        {...register('electricityType', { required: electricityNeeded ? 'Please select electricity type' : false })}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">240V - Lighting only (max 1000W)</div>
                        <div className="text-sm text-gray-500">Uniquement éclairage / Nur Beleuchtung</div>
                      </div>
                    </label>
                    <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        value="240v-high"
                        {...register('electricityType', { required: electricityNeeded ? 'Please select electricity type' : false })}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">240V - Higher consumption</div>
                        <div className="text-sm text-gray-500">Consommation plus élevée / Höherer Verbrauch</div>
                      </div>
                    </label>
                    <label className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        value="400v"
                        {...register('electricityType', { required: electricityNeeded ? 'Please select electricity type' : false })}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">400V - Three-phase</div>
                        <div className="text-sm text-gray-500">Courant triphasé / 3 Phasen-Kraftstrom</div>
                      </div>
                    </label>
                    
                    {(watch('electricityType') === '240v-high' || watch('electricityType') === '400v') && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Power consumption (Watts) *
                        </label>
                        <input
                          type="number"
                          {...register('watts', { 
                            required: (watch('electricityType') === '240v-high' || watch('electricityType') === '400v') ? 'Watts required' : false,
                            min: { value: 1, message: 'Minimum 1 watt' }
                          })}
                          className="input-field"
                          placeholder="e.g., 2000"
                        />
                        {errors.watts && <p className="text-red-500 text-sm mt-1">{errors.watts.message}</p>}
                      </div>
                    )}
                    {errors.electricityType && <p className="text-red-500 text-sm mt-2">{errors.electricityType.message}</p>}
                  </div>
                )}
              </div>

              {/* Water */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('water')}
                    className="mr-3 h-4 w-4"
                  />
                  <span className="text-base font-medium text-gray-900">
                    I need water / J'ai besoin d'eau / Ich benötige Wasser
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Product Category */}
          <div className="card">
            <div className="flex items-center mb-6">
              <ShoppingBag className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Product Category</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Product Category *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="fleaMarket"
                      {...register('productCategory', { required: 'Please select product category' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Flea Market</div>
                      <div className="text-sm text-gray-500">Puces-Brocante / Floh- und Trödelmarktartikel</div>
                    </div>
                  </label>
                  <label className="relative flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      value="artisanal"
                      {...register('productCategory', { required: 'Please select product category' })}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Artisanal Market</div>
                      <div className="text-sm text-gray-500">Marché Artisanal / Kunsthandwerk</div>
                    </div>
                  </label>
                </div>
                {errors.productCategory && <p className="text-red-500 text-sm mt-2">{errors.productCategory.message}</p>}
              </div>

              {productCategory === 'artisanal' && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of artisanal products / Art bitte unbedingt angeben *
                    </label>
                    <input
                      type="text"
                      {...register('artisanalType', { required: productCategory === 'artisanal' ? 'Please specify artisanal type' : false })}
                      className="input-field"
                      placeholder="e.g., pottery, jewelry, woodwork, textiles..."
                    />
                    {errors.artisanalType && <p className="text-red-500 text-sm mt-1">{errors.artisanalType.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        {...register('demonstration')}
                        className="mt-1 mr-3 h-4 w-4"
                      />
                      <div>
                        <span className="font-medium text-gray-900">With demonstration/fabrication on site</span>
                        <div className="text-sm text-gray-500">Avec démonstration/fabrication sur place</div>
                        <div className="text-sm text-gray-500">Mit Vorführung/Herstellung vor Ort</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Additional Information */}
          <div className="card">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2></div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks / Remarques / Bemerkungen
              </label>
              <textarea
                {...register('remarks')}
                className="input-field"
                rows={4}
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6">
            <Link
              href={`/registrations/${id}`}
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
                'Update Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}