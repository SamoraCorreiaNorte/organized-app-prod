import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 12,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  row: {
    flexDirection: 'row',
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  headerGroupRow: {
    backgroundColor: '#e6e6e6',
  },
  cell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#d9d9d9',
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    minHeight: 18,
    justifyContent: 'center',
  },
  lastCell: {
    borderRightWidth: 0,
  },
  headerText: {
    fontWeight: 'bold',
  },
  headerTextCenter: {
    textAlign: 'center',
  },
  headerTextRight: {
    textAlign: 'right',
  },
});

export default styles;
