export type DutiesExportTable = {
  title: string;
  headers?: string[];
  headerRows?: {
    label: string;
    span?: number;
    align?: 'left' | 'center' | 'right';
  }[][];
  rows: string[][];
  columnWeights: number[];
};

export type DutiesExportTemplateProps = {
  table: DutiesExportTable;
  lang: string;
};
