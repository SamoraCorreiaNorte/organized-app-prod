import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { MeetingType } from '@definition/app';
import { SourcesFormattedType } from '@definition/sources';
import { sourcesFormattedState, sourcesValidState } from '@states/sources';
import { useBreakpoints } from '@hooks/index';
import { selectedWeekState } from '@states/schedules';
import { convertStringToBoolean } from '@utils/common';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import MonthsContainer from './months_container';
import { addDays } from '@utils/date';

const useWeekSelector = (meetingType: MeetingType) => {
  const { desktopUp } = useBreakpoints();
  const resetSelectedWeek = useResetAtom(selectedWeekState);

  const sourcesValid = useAtomValue(sourcesValidState);
  const sourcesFormattedByWeek = useAtomValue(sourcesFormattedState);
  const selectedWeek = useAtomValue(selectedWeekState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);

  const [expanded, setExpanded] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortDown, setSortDown] = useState(
    convertStringToBoolean(localStorage.getItem('meeting_sort_down'))
  );

  const currentYear = useMemo(() => {
    if (selectedWeek.length > 0) {
      return new Date(selectedWeek).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  }, [selectedWeek]);

  const sources = useMemo(() => {
    if (meetingType === 'midweek' && !meetingExactDate) {
      return sourcesFormattedByWeek;
    }

    const groupedData = sourcesValid.reduce<SourcesFormattedType[]>(
      (acc, curr) => {
        let toAdd = 0;

        if (meetingType === 'midweek') {
          toAdd = midweekDay - 2;
        }

        if (meetingType === 'weekend') {
          toAdd = weekendDay - 2;
        }

        const date = addDays(curr.weekOf, toAdd);

        const year = date.getFullYear();
        const month = date.getMonth();

        // Initialize year object if not already present
        const findYear = acc.find((record) => record.value === year);
        if (!findYear) {
          acc.push({ value: year, months: [] });
        }

        // Initialize month array if not already present
        const yearRecord = acc.find((record) => record.value === year);
        const findMonth = yearRecord.months.find(
          (record) => record.value === month
        );
        if (!findMonth) {
          yearRecord.months.push({ value: month, weeks: [] });
        }

        // Add current week to the appropriate month array
        const monthRecord = yearRecord.months.find(
          (record) => record.value === month
        );

        monthRecord.weeks.push(curr.weekOf);

        return acc;
      },
      []
    );

    for (const year in groupedData) {
      groupedData[year].months.sort((a, b) => b.value - a.value);
    }

    return groupedData;
  }, [
    meetingType,
    meetingExactDate,
    sourcesFormattedByWeek,
    sourcesValid,
    midweekDay,
    weekendDay,
  ]);

  const tabs = useMemo(() => {
    return sources.toReversed().map((year) => ({
      label: year.value.toString(),
      Component: (
        <MonthsContainer
          months={year.months}
          reverse={sortDown}
          meetingType={meetingType}
        />
      ),
    }));
  }, [sources, sortDown, meetingType]);

  const activeTab = useMemo(() => {
    return tabs.findIndex((record) => record.label === currentYear);
  }, [tabs, currentYear]);

  const hasWeeks = useMemo(() => {
    return sources.length > 0;
  }, [sources]);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggleSort = () => {
    setSortDown((prev) => {
      localStorage.setItem('meeting_sort_down', !prev ? 'true' : 'false');
      return !prev;
    });
  };

  const handleOpenDelete = () => setOpenDelete(true);

  const handleCloseDelete = () => setOpenDelete(false);

  useEffect(() => {
    if (!desktopUp && selectedWeek.length > 0) {
      setExpanded(false);
    }
  }, [selectedWeek, desktopUp]);

  useEffect(() => {
    return () => {
      resetSelectedWeek();
    };
  }, [resetSelectedWeek]);

  return {
    tabs,
    hasWeeks,
    expanded,
    handleToggleExpand,
    activeTab,
    openDelete,
    handleCloseDelete,
    handleOpenDelete,
    sortDown,
    handleToggleSort,
  };
};

export default useWeekSelector;
