import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { MeetingType } from '@definition/app';
import { SourcesFormattedType } from '@definition/sources';
import { sourcesFormattedState, sourcesValidState } from '@states/sources';
import { useBreakpoints } from '@hooks/index';
import { selectedDayState } from '@states/schedules';
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

  const sourcesValid = useAtomValue(sourcesValidState);
  const sourcesFormattedByWeek = useAtomValue(sourcesFormattedState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);
  const [selectedWeek, setSelectedWeek] = useAtom(selectedDayState);

  const [expanded, setExpanded] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [sortDown, setSortDown] = useState(
    convertStringToBoolean(localStorage.getItem('meeting_sort_down'))
  );

  const currentYear = useMemo(() => {
    if (selectedWeek?.date) {
      return new Date(selectedWeek.date).getFullYear().toString();
    }

    return new Date().getFullYear().toString();
  }, [selectedWeek]);

  const sources = useMemo(() => {
    if (meetingType === 'midweek' && !meetingExactDate) {
      return sourcesFormattedByWeek;
    }

    // Efficient grouping using Map, weekOf is a string
    const yearMonthMap = new Map();

    for (const curr of sourcesValid) {
      let meetingDates = [];
      if (meetingType === 'midweek') {
        meetingDates = [addDays(new Date(curr.weekOf), midweekDay - 1)];
      } else if (meetingType === 'weekend') {
        meetingDates = [addDays(new Date(curr.weekOf), weekendDay - 1)];
      } else if (meetingType === 'duties') {
        meetingDates = [
          addDays(new Date(curr.weekOf), midweekDay - 1),
          addDays(new Date(curr.weekOf), weekendDay - 1),
        ];
      }

      for (const date of meetingDates) {
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!yearMonthMap.has(year)) yearMonthMap.set(year, new Map());
        const monthMap = yearMonthMap.get(year);
        if (!monthMap.has(month)) monthMap.set(month, new Set());
        monthMap.get(month).add(curr.weekOf);
      }
    }

    // Convert Map structure to array structure
    const groupedData = Array.from(yearMonthMap.entries()).map(
      ([year, monthsMap]) => ({
        value: year,
        months: Array.from(monthsMap.entries())
          .map(([month, weeksSet]) => ({
            value: month,
            weeks: Array.from(weeksSet) as string[],
          }))
          .sort((a, b) => b.value - a.value),
      })
    );

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
    if (!desktopUp && selectedWeek?.date) {
      setExpanded(false);
    }
  }, [selectedWeek, desktopUp]);

  useEffect(() => {
    return () => {
      setSelectedWeek({ date: '', locale: '', dayType: 'midweek' });
    };
  }, [setSelectedWeek]);

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
