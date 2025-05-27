
/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      fitBounds(bounds: LatLngBounds): void;
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng | LatLngLiteral;
      styles?: MapTypeStyle[];
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: any[];
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | undefined;
      addListener(eventName: string, handler: Function): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      setContent(content: string): void;
      open(map: Map, anchor?: Marker): void;
    }

    interface InfoWindowOptions {
      content?: string;
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void;
    }

    interface GeocoderRequest {
      address?: string;
    }

    interface GeocoderResult {
      geometry: {
        location: LatLng;
      };
    }

    enum GeocoderStatus {
      OK = 'OK'
    }
  }
}

export {};
