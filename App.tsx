
import React, { useState } from 'react';
import { TravelState, SheetData } from './types';
import Spreadsheet from './components/Spreadsheet';
import JournalView from './components/JournalView';

const INITIAL_SHEET: SheetData = {
  id: 'sheet-1',
  name: 'Tokyo 2024',
  rows: [
    [{ value: '2024-05-01' }, { value: '3 days' }, { value: 'Shibuya Crossing' }, { value: 'Shibuya City, Tokyo 150-0043' }],
    [{ value: '2024-05-04' }, { value: '2 days' }, { value: 'Mount Fuji' }, { value: 'Kitayama, Fujinomiya, Shizuoka 418-0112' }],
    [{ value: '2024-05-06' }, { value: '1 day' }, { value: 'Kyoto Tower' }, { value: 'Shimogyo Ward, Kyoto, 600-8216' }],
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<TravelState>({
    sheets: [INITIAL_SHEET],
    activeSheetId: 'sheet-1',
    view: 'excel',
  });

  const activeSheet = state.sheets.find(s => s.id === state.activeSheetId) || state.sheets[0];

  const updateSheet = (updatedSheet: SheetData) => {
    setState(prev => ({
      ...prev,
      sheets: prev.sheets.map(s => s.id === updatedSheet.id ? updatedSheet : s)
    }));
  };

  const addSheet = () => {
    const newId = `sheet-${Date.now()}`;
    const newSheet: SheetData = {
      id: newId,
      name: `New Trip ${state.sheets.length + 1}`,
      rows: []
    };
    setState(prev => ({
      ...prev,
      sheets: [...prev.sheets, newSheet],
      activeSheetId: newId
    }));
  };

  const renameSheet = (id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      sheets: prev.sheets.map(s => s.id === id ? { ...s, name: newName } : s)
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Full Width */}
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-md">
            G
          </div>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">Travel Planner</h1>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setState(prev => ({ ...prev, view: 'excel' }))}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${state.view === 'excel' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            EXCEL
          </button>
          <button 
            onClick={() => setState(prev => ({ ...prev, view: 'journal' }))}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${state.view === 'journal' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            JOURNAL
          </button>
        </div>

        <div className="flex items-center space-x-4">
           <div className="text-xs font-medium text-gray-400 hidden lg:block">FORMULAS: SUM, AVG, MIN, MAX</div>
           <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-indigo-700">SHARE</button>
        </div>
      </header>

      {/* Main Content - Takes remaining space */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {state.view === 'excel' ? (
          <div className="flex flex-col h-full">
            {/* Sheet Tabs Bar */}
            <div className="flex items-center px-4 bg-white border-b border-gray-200 overflow-x-auto no-scrollbar flex-shrink-0 h-10">
              {state.sheets.map(s => (
                <div key={s.id} className="flex items-center h-full group">
                  <button
                    onClick={() => setState(prev => ({ ...prev, activeSheetId: s.id }))}
                    className={`h-full px-4 text-xs font-bold border-r border-gray-200 transition-colors flex items-center space-x-2 ${state.activeSheetId === s.id ? 'bg-indigo-50 text-indigo-700 border-b-2 border-b-indigo-500' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span>{s.name}</span>
                    <span 
                      className="opacity-0 group-hover:opacity-100 hover:text-indigo-900 ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt('Rename sheet:', s.name);
                        if (newName) renameSheet(s.id, newName);
                      }}
                    >
                      ✎
                    </span>
                  </button>
                </div>
              ))}
              <button 
                onClick={addSheet}
                className="px-4 text-gray-400 hover:text-indigo-600 font-bold text-lg"
              >
                +
              </button>
            </div>

            {/* Spreadsheet Area - Full remaining viewport */}
            <div className="flex-1 bg-white overflow-hidden relative">
              <Spreadsheet 
                sheet={activeSheet} 
                onUpdate={updateSheet} 
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto bg-gray-100">
            <JournalView sheets={state.sheets} />
          </div>
        )}
      </main>

      {/* Footer - Full Width slim */}
      <footer className="bg-white border-t border-gray-200 px-6 py-1 flex justify-between items-center text-[10px] text-gray-400 flex-shrink-0">
        <div>Gemini Travel OS v1.0 • Ready</div>
        <div className="flex space-x-3 uppercase tracking-tighter font-bold">
          <span className="text-green-500">Auto-save on</span>
          <span>A:Date</span>
          <span>B:Duration</span>
          <span>C:Spot</span>
          <span className="text-indigo-500">D:Address (Maps)</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
