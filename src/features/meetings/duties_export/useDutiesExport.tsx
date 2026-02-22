import { useMemo, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAtomValue } from 'jotai';
import { addMonths, getWeekDate, isMondayDate } from '@utils/date';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import { personsState } from '@states/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangLocaleState,
  userDataViewState,
} from '@states/settings';
import { ASSIGNMENT_PATH } from '@constants/index';
import {
  schedulesGetData,
  schedulesGetMeetingDate,
} from '@services/app/schedules';
import { personGetDisplayName } from '@utils/common';
import { AssignmentCongregation, SchedWeekType } from '@definition/schedules';
import { AssignmentFieldType } from '@definition/assignment';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { DutiesExportDepartment, DutiesExportTable } from './index.types';
import {
  ScheduleListType,
  YearGroupType,
} from '../schedule_publish/index.types';
import { TemplateDutiesExport } from '@views/index';
import { DutiesExportProps } from './index.types';

const useDutiesExport = (onClose: DutiesExportProps['onClose']) => {
  const sources = useAtomValue(sourcesState);
  const schedules = useAtomValue(schedulesState);
  const persons = useAtomValue(personsState);
  const dataView = useAtomValue(userDataViewState);
  const sourceLang = useAtomValue(JWLangLocaleState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const [department, setDepartment] = useState<DutiesExportDepartment>('som');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sourcesList = useMemo(() => {
    const weekDate = getWeekDate();
    const pastDate = addMonths(weekDate, -3);

    return sources
      .filter(
        (record) =>
          isMondayDate(record.weekOf) && new Date(record.weekOf) >= pastDate
      )
      .map((record) => record.weekOf);
  }, [sources]);

  const baseList = useMemo(() => {
    const groupedData = sourcesList.reduce((acc: YearGroupType[], week) => {
      const [year, month] = week.split('/').slice(0, 2);
      let yearGroup = acc.find((item) => item.year === year);

      if (!yearGroup) {
        yearGroup = { year: year, months: [] };
        acc.push(yearGroup);
      }

      let monthGroup = yearGroup.months.find(
        (item) => item === `${year}/${month}`
      );

      if (!monthGroup) {
        monthGroup = `${year}/${month}`;
        yearGroup.months.push(monthGroup);
      }

      return acc;
    }, []);

    return groupedData;
  }, [sourcesList]);

  const schedulesList = useMemo(() => {
    const result: ScheduleListType[] = baseList.map((record) => {
      return {
        year: record.year,
        months: record.months.map((month) => {
          return {
            month,
            checked: checkedItems.includes(month),
          };
        }),
      };
    });

    return result;
  }, [baseList, checkedItems]);

  const handleCheckedChange = (checked: boolean, value: string) => {
    if (checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);

        if (!value.includes('/')) {
          const data = items.filter((record) => !record.includes(value));

          const months = baseList.find(
            (record) => record.year === value
          ).months;

          data.push(...months);

          return data;
        }

        items.push(value);

        return items;
      });
    }

    if (!checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);
        const data = items.filter((record) => !record.includes(value));
        return data;
      });
    }
  };

  const getAssignedName = (
    schedule: SchedWeekType,
    assignment: AssignmentFieldType
  ) => {
    const path = ASSIGNMENT_PATH[assignment];
    const assigned = schedulesGetData(
      schedule,
      path,
      dataView
    ) as AssignmentCongregation;

    if (!assigned?.value) return '-';

    const person = persons.find(
      (record) => record.person_uid === assigned.value
    );

    if (person) {
      return personGetDisplayName(person, displayNameEnabled, fullnameOption);
    }

    if (assigned.name?.length > 0) return assigned.name;

    return assigned.value;
  };

  const handleExportSchedule = async () => {
    if (checkedItems.length === 0 || isProcessing) return;

    try {
      setIsProcessing(true);

      const selectedMonths = checkedItems.toSorted();
      const rowsData: {
        sortDate: string;
        dateLabel: string;
        columns: string[];
      }[] = [];

      const schedulesInMonths = schedules.filter((record) =>
        selectedMonths.some((month) => record.weekOf.startsWith(month))
      );

      const meetingTypes: ('midweek' | 'weekend')[] = ['midweek', 'weekend'];

      for (const schedule of schedulesInMonths) {
        for (const meetingType of meetingTypes) {
          if (meetingType === 'midweek' && !schedule.midweek_meeting) {
            continue;
          }

          if (meetingType === 'weekend' && !schedule.weekend_meeting) {
            continue;
          }

          const meetingDate = schedulesGetMeetingDate({
            week: schedule.weekOf,
            meeting: meetingType,
            dataView,
          });

          if (!meetingDate.locale) {
            continue;
          }

          const prefix = meetingType === 'midweek' ? 'MW' : 'WE';

          if (department === 'som') {
            rowsData.push({
              sortDate: meetingDate.date,
              dateLabel: meetingDate.locale,
              columns: [
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_Audio` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_Video` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_Microphone_1` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_Microphone_2` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_VideoConference` as AssignmentFieldType
                ),
              ],
            });
          }

          if (department === 'indicadores') {
            rowsData.push({
              sortDate: meetingDate.date,
              dateLabel: meetingDate.locale,
              columns: [
                '',
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_EntranceAttendant_Shift_1` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_AuditoriumAttendant_Shift_1` as AssignmentFieldType
                ),
                '',
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_EntranceAttendant_Shift_2` as AssignmentFieldType
                ),
                getAssignedName(
                  schedule,
                  `${prefix}_DUTIES_AuditoriumAttendant_Shift_2` as AssignmentFieldType
                ),
              ],
            });
          }
        }
      }

      rowsData.sort((a, b) => a.sortDate.localeCompare(b.sortDate));

      if (rowsData.length === 0) {
        setIsProcessing(false);
        return;
      }

      const columnWeightsSom = [1.5, 1, 1, 1, 1, 1];
      const columnWeightsIndicadores = [1.5, 1, 1, 1, 1, 1, 1];

      const table: DutiesExportTable = {
        title:
          department === 'som'
            ? 'Meeting duties export - Som'
            : 'Meeting duties export - Indicadores',
        headers:
          department === 'som'
            ? ['Date', 'Audio', 'Video', 'Micro 5', 'Micro 6', 'Zoom']
            : undefined,
        headerRows:
          department === 'indicadores'
            ? [
                [
                  { label: '', span: 1 },
                  { label: 'Turno 1', span: 3, align: 'center' },
                  { label: 'Turno 2', span: 3, align: 'center' },
                ],
                [
                  { label: 'Data' },
                  { label: 'Hora' },
                  { label: 'Hall' },
                  { label: 'Auditorio' },
                  { label: 'Hora' },
                  { label: 'Hall' },
                  { label: 'Auditorio' },
                ],
              ]
            : undefined,
        rows: rowsData.map((row) => [row.dateLabel, ...row.columns]),
        columnWeights:
          department === 'som' ? columnWeightsSom : columnWeightsIndicadores,
      };

      const blob = await pdf(
        <TemplateDutiesExport table={table} lang={sourceLang} />
      ).toBlob();

      const firstDate = rowsData.at(0).sortDate.replaceAll('/', '');
      const lastDate = rowsData.at(-1).sortDate.replaceAll('/', '');

      const filename = `Duties_${department}_${firstDate}-${lastDate}.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    department,
    setDepartment,
    schedulesList,
    handleCheckedChange,
    handleExportSchedule,
    isProcessing,
  };
};

export default useDutiesExport;
