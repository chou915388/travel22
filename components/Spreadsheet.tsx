
import React, { useState } from 'react';
import { SheetData, CellData } from '../types';
import { getColName, evaluateFormula } from '../utils/formulas';

interface Props {
  sheet: SheetData;
  onUpdate: (updatedSheet: SheetData) => void;
}

const Spreadsheet: React.FC<Props> = ({ sheet, onUpdate }) => {
  const [editing, setEditing] = useState<{ r: number, c: number } | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Sufficient rows to feel like a full app
  const rowCount = 100;
  const colCount = 26;

  const handleCellClick = (r: number, c: number) => {
    setEditing({ r, c });
    const cell = sheet.rows[r]?.[c];
    setInputValue(cell?.formula || cell?.value || '');
  };

  const handleBlur = () => {
    if (!editing) return;
    const { r, c } = editing;
    const newRows = [...sheet.rows];
    if (!newRows[r]) newRows[r] = [];
    
    const isFormula = inputValue.startsWith('=');
    const newCell: CellData = isFormula 
      ? { value: evaluateFormula(inputValue, newRows), formula: inputValue }
      : { value: inputValue };

    newRows[r][c] = newCell;
    
    const updatedRows = newRows.map((row) => 
      row?.map((cell) => cell?.formula ? { ...cell, value: evaluateFormula(cell.formula, newRows) } : cell) || []
    );

    onUpdate({ ...sheet, rows: updatedRows });
    setEditing(null);
  };

  const getCellDisplay = (r: number, c: number) => {
    const cell = sheet.rows[r]?.[c];
    return cell?.value || '';
  };

  return (
    <div className="absolute inset-0 overflow-auto bg-white scrollbar-thin scrollbar-thumb-gray-300">
      <table className="border-collapse text-[13px] w-full table-fixed min-w-[1500px]">
        <thead className="sticky top-0 z-10 shadow-sm">
          <tr className="bg-[#f8f9fa]">
            <th className="w-10 border border-gray-300 bg-[#f8f9fa] text-gray-500 font-normal"></th>
            {Array.from({ length: colCount }).map((_, i) => (
              <th key={i} className="w-48 border border-gray-300 font-normal p-0 h-10 select-none group">
                <div className="flex flex-col h-full">
                   <div className="bg-gray-100/50 text-[10px] text-gray-400 border-b border-gray-200 py-0.5">{getColName(i)}</div>
                   <div className="flex-1 flex items-center justify-center font-semibold text-gray-700 px-2 leading-tight">
                    {i === 0 ? '日期 (Date)' : 
                     i === 1 ? '預計時長 (Duration)' : 
                     i === 2 ? '景點/交通 (Spot)' : 
                     i === 3 ? '地址 (Address)' : ''}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, r) => (
            <tr key={r} className="group">
              <td className="bg-[#f8f9fa] border border-gray-300 text-center text-gray-400 font-medium select-none sticky left-0 z-0">{r + 1}</td>
              {Array.from({ length: colCount }).map((_, c) => (
                <td 
                  key={c} 
                  className={`border border-gray-200 p-0 h-9 relative cursor-cell hover:bg-gray-50 transition-colors ${editing?.r === r && editing?.c === c ? 'ring-2 ring-indigo-500 z-10' : ''}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {editing?.r === r && editing?.c === c ? (
                    <input
                      autoFocus
                      className="w-full h-full px-2 outline-none bg-white shadow-inner"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={handleBlur}
                      onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                    />
                  ) : (
                    <div className="w-full h-full px-2 flex items-center overflow-hidden whitespace-nowrap">
                      {getCellDisplay(r, c)}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spreadsheet;
