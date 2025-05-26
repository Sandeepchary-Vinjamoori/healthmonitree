
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

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Google Maps API key from database
    const { data: apiConfig } = await supabaseClient
      .from('api_config')
      .select('api_key')
      .eq('service_name', 'google_maps')
      .single()

    if (!apiConfig?.api_key) {
      throw new Error('Google Maps API key not configured')
    }

    // Call Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&keyword=${keyword}&key=${apiConfig.api_key}`
    
    const response = await fetch(url)
    const data = await response.json()

    // Get place details for each hospital
    const hospitalsWithDetails = await Promise.all(
      data.results.slice(0, 10).map(async (place: any) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,rating,user_ratings_total,opening_hours,website&key=${apiConfig.api_key}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        
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
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiConfig.api_key}`
          ) || []
        }
      })
    )

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
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
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
