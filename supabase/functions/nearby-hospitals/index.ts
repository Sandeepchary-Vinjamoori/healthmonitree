
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lat, lng, radius = 5000, keyword = 'hospital' } = await req.json()

    console.log('Received request:', { lat, lng, radius, keyword })

    // Get Google Maps API key from environment
    const googleMapsApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!googleMapsApiKey) {
      console.error('Google Maps API key not found in environment variables')
      throw new Error('Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to Supabase secrets.')
    }

    console.log('Using Google Maps API key:', googleMapsApiKey.substring(0, 10) + '...')

    // Use the new Places API (New) instead of legacy API
    const url = `https://places.googleapis.com/v1/places:searchNearby`
    
    console.log('Making request to Google Places API (New)')
    
    const requestBody = {
      includedTypes: ['hospital'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng
          },
          radius: radius
        }
      }
    }

    if (keyword && keyword !== 'hospital') {
      requestBody.textQuery = keyword
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleMapsApiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.photos'
      },
      body: JSON.stringify(requestBody)
    })

    const data = await response.json()

    console.log('Google Places API response status:', response.status)
    console.log('Google Places API results count:', data.places?.length || 0)

    if (!response.ok) {
      console.error('Google Places API error:', response.status, data)
      
      if (response.status === 403) {
        throw new Error('Google Places API access denied. Please check that your API key has Places API (New) enabled and proper restrictions configured.')
      } else if (response.status === 429) {
        throw new Error('Google Places API quota exceeded. Please check your API limits or upgrade your plan.')
      } else {
        throw new Error(`Google Places API error: ${response.status} - ${data.error?.message || 'Unknown error'}`)
      }
    }

    // Transform the new API response to match our expected format
    const hospitalsWithDetails = (data.places || []).map((place: any) => {
      const photos = place.photos?.slice(0, 3).map((photo: any) => 
        `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=400&key=${googleMapsApiKey}`
      ) || []

      return {
        id: place.id,
        name: place.displayName?.text || 'Unknown Hospital',
        address: place.formattedAddress || 'Address not available',
        formatted_address: place.formattedAddress || 'Address not available',
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0
        },
        rating: place.rating,
        user_ratings_total: place.userRatingCount,
        phone: place.nationalPhoneNumber,
        website: place.websiteUri,
        opening_hours: place.regularOpeningHours ? {
          open_now: place.regularOpeningHours.openNow || false,
          periods: place.regularOpeningHours.periods || []
        } : null,
        photos: photos
      }
    })

    console.log('Returning hospitals:', hospitalsWithDetails.length)

    return new Response(
      JSON.stringify({ hospitals: hospitalsWithDetails }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in nearby-hospitals function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please check that your Google Maps API key is properly configured and has the necessary permissions for Places API (New).'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
