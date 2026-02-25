export type DutiesExportProps = {
  open: boolean;
  onClose: VoidFunction;
};

export type DutiesExportDepartment = 'som' | 'indicadores';

export type DutiesExportHeaderCell = {
  label: string;
  span?: number;
  align?: 'left' | 'center' | 'right';
};

export type DutiesExportTable = {
  title: string;
  headers?: string[];
  headerRows?: DutiesExportHeaderCell[][];
  rows: string[][];
  columnWeights: number[];
};
