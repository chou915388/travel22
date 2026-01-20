
import { CellData } from '../types';

export const evaluateFormula = (formula: string, rows: CellData[][]): string => {
  const match = formula.match(/^=(SUM|AVG|MIN|MAX)\((.*)\)$/i);
  if (!match) return formula;

  const func = match[1].toUpperCase();
  const rangeStr = match[2];
  
  // Basic range parsing A1:B10
  const rangeParts = rangeStr.split(':');
  if (rangeParts.length !== 2) return "#VALUE!";

  const parseCoord = (coord: string) => {
    const col = coord.match(/[A-Z]+/)?.[0];
    const row = coord.match(/[0-9]+/)?.[0];
    if (!col || !row) return null;
    
    // Column A -> index 0, B -> 1 etc.
    let colIdx = 0;
    for (let i = 0; i < col.length; i++) {
      colIdx = colIdx * 26 + col.charCodeAt(i) - 64;
    }
    return { r: parseInt(row) - 1, c: colIdx - 1 };
  };

  const start = parseCoord(rangeParts[0]);
  const end = parseCoord(rangeParts[1]);

  if (!start || !end) return "#REF!";

  const numbers: number[] = [];
  for (let r = Math.min(start.r, end.r); r <= Math.max(start.r, end.r); r++) {
    for (let c = Math.min(start.c, end.c); c <= Math.max(start.c, end.c); c++) {
      const val = parseFloat(rows[r]?.[c]?.value || '0');
      if (!isNaN(val)) numbers.push(val);
    }
  }

  if (numbers.length === 0) return "0";

  switch (func) {
    case 'SUM': return numbers.reduce((a, b) => a + b, 0).toString();
    case 'AVG': return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2);
    case 'MIN': return Math.min(...numbers).toString();
    case 'MAX': return Math.max(...numbers).toString();
    default: return "#NAME?";
  }
};

export const getColName = (index: number): string => {
  let name = '';
  while (index >= 0) {
    name = String.fromCharCode((index % 26) + 65) + name;
    index = Math.floor(index / 26) - 1;
  }
  return name;
};
