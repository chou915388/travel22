
import React from 'react';
import { SheetData } from '../types';

interface Props {
  sheets: SheetData[];
}

const JournalView: React.FC<Props> = ({ sheets }) => {
  const openMaps = (address: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 space-y-12 pb-24">
      {sheets.map((sheet) => (
        <section key={sheet.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-10 py-8">
            <h2 className="text-4xl font-black text-white tracking-tight">{sheet.name}</h2>
            <p className="text-indigo-100 mt-2 font-medium">Adventure Journal</p>
          </div>
          <div className="p-10 space-y-10">
            {sheet.rows.filter(row => row && row[2]?.value).map((row, idx) => {
              const date = row[0]?.value;
              const duration = row[1]?.value;
              const spot = row[2]?.value;
              const address = row[3]?.value;
              const notes = row[4]?.value;

              return (
                <div key={idx} className="flex gap-8 group">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 ring-8 ring-indigo-50 mb-3 flex items-center justify-center text-[10px] text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="w-0.5 flex-1 bg-gray-100 group-last:bg-transparent"></div>
                  </div>
                  <div className="flex-1 pb-12">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                        {date || 'DATE TBD'}
                      </span>
                      <span className="text-gray-400 text-xs font-medium">
                        • {duration || 'Duration TBD'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                      <h3 className="text-3xl font-bold text-gray-900 leading-tight">{spot}</h3>
                      
                      {address && (
                        <button 
                          onClick={() => openMaps(address)}
                          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm group/btn self-start"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold truncate max-w-[200px]">{address}</span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 group-hover/btn:bg-indigo-100 group-hover/btn:text-indigo-600">MAP</span>
                        </button>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-gray-600 text-lg leading-relaxed italic shadow-inner">
                      {notes || "Notes from column E appear here. Write down your feelings or details about this destination."}
                    </div>
                    
                    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-video w-full max-h-[400px] relative">
                      <img 
                        src={`https://picsum.photos/seed/${spot}-${idx}/1200/675`} 
                        alt={spot}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {sheet.rows.filter(row => row && row[2]?.value).length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🗺️</div>
                <div className="text-gray-400 text-xl italic font-medium">
                  Your itinerary is empty. Start planning in Excel View!
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default JournalView;
