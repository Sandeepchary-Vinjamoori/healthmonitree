
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Call Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=${keyword}&key=${googleMapsApiKey}`
    
    console.log('Making request to Google Places API:', url.replace(googleMapsApiKey, 'HIDDEN_KEY'))
    
    const response = await fetch(url)
    const data = await response.json()

    console.log('Google Places API response status:', data.status)
    console.log('Google Places API results count:', data.results?.length || 0)

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message)
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`)
    }

    // Get place details for each hospital
    const hospitalsWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (place: any) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours,website&key=${googleMapsApiKey}`
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()
          
          console.log(`Details for ${place.name}:`, detailsData.status)
          
          return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            formatted_address: detailsData.result?.formatted_address || place.vicinity,
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            },
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            phone: detailsData.result?.formatted_phone_number,
            website: detailsData.result?.website,
            opening_hours: detailsData.result?.opening_hours,
            photos: place.photos?.slice(0, 1).map((photo: any) => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${googleMapsApiKey}`
            ) || []
          }
        } catch (error) {
          console.error(`Error getting details for ${place.name}:`, error)
          return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            formatted_address: place.vicinity,
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng
            },
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            phone: null,
            website: null,
            opening_hours: null,
            photos: []
          }
        }
      })
    )

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
        details: 'Please check that your Google Maps API key is properly configured and has the necessary permissions for Places API.'
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
