import { Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { LANGUAGE_LIST } from '@constants/index';
import { DutiesExportTemplateProps } from './index.types';
import registerFonts from '@views/registerFonts';
import styles from './index.styles';

registerFonts();

const DutiesExportTemplate = ({ table, lang }: DutiesExportTemplateProps) => {
  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  const renderHeaderRows = () => {
    if (!table.headerRows || table.headerRows.length === 0) return null;

    return table.headerRows.map((row, rowIndex) => {
      let colIndex = 0;

      return (
        <View
          key={`header-row-${rowIndex}`}
          style={[
            styles.row,
            rowIndex === 0 ? styles.headerGroupRow : styles.headerRow,
          ]}
        >
          {row.map((cell, cellIndex) => {
            const span = cell.span ?? 1;
            const spanWeights = table.columnWeights.slice(
              colIndex,
              colIndex + span
            );
            const flex =
              spanWeights.reduce((sum, value) => sum + value, 0) || span;
            const isLast = colIndex + span >= table.columnWeights.length;

            colIndex += span;

            return (
              <View
                key={`header-cell-${rowIndex}-${cellIndex}`}
                style={[styles.cell, { flex }, isLast ? styles.lastCell : null]}
              >
                <Text
                  style={[
                    styles.headerText,
                    cell.align === 'center' ? styles.headerTextCenter : null,
                    cell.align === 'right' ? styles.headerTextRight : null,
                  ]}
                >
                  {cell.label}
                </Text>
              </View>
            );
          })}
        </View>
      );
    });
  };

  return (
    <Document title={table.title}>
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <Text style={styles.title}>{table.title}</Text>
        <View style={styles.table}>
          {table.headerRows && table.headerRows.length > 0 ? (
            renderHeaderRows()
          ) : (
            <View style={[styles.row, styles.headerRow]}>
              {table.headers?.map((header, index) => (
                <View
                  key={`header-${header}`}
                  style={[
                    styles.cell,
                    { flex: table.columnWeights[index] || 1 },
                    index === table.headers.length - 1 ? styles.lastCell : null,
                  ]}
                >
                  <Text style={styles.headerText}>{header}</Text>
                </View>
              ))}
            </View>
          )}

          {table.rows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.cell,
                    { flex: table.columnWeights[cellIndex] || 1 },
                    cellIndex === row.length - 1 ? styles.lastCell : null,
                  ]}
                >
                  <Text>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default DutiesExportTemplate;
