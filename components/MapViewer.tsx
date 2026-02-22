
import React from 'react';
import { MapPin, Maximize2 } from 'lucide-react';

interface MapViewerProps {
  location: string;
}

const MapViewer: React.FC<MapViewerProps> = ({ location }) => {
  const encodedLocation = encodeURIComponent(location);
  // Use the legacy iframe embed URL which works more reliably without a specific Maps Embed API key
  const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 group">
      <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <MapPin size={14} />
          <span>Vista de Ubicación: {location}</span>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-white transition-colors"
        >
          <Maximize2 size={14} />
        </a>
      </div>
      <div className="relative aspect-video w-full bg-slate-950">
        <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapUrl}
            title={`Map of ${location}`}
            className="grayscale-[20%] contrast-[1.1] brightness-[0.9]"
          ></iframe>
      </div>
    </div>
  );
};

export default MapViewer;
