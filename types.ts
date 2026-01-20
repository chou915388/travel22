
export interface CellData {
  value: string;
  formula?: string;
}

export interface SheetData {
  id: string;
  name: string;
  rows: CellData[][];
}

export interface TravelState {
  sheets: SheetData[];
  activeSheetId: string;
  view: 'excel' | 'journal';
}
