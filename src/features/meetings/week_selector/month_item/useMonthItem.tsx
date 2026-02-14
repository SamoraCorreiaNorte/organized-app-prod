import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';
import { schedulesWeekAssignmentsInfo } from '@services/app/schedules';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  meetingExactDateState,
  midweekMeetingWeekdayState,
  weekendMeetingWeekdayState,
} from '@states/settings';
import { addDays } from '@utils/date';
import { MonthItemType } from './index.types';

const useMonthItem = ({
  month,
  weeks,
  currentExpanded,
  onChangeCurrentExpanded,
  meetingType,
}: MonthItemType) => {
  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const monthNames = useAtomValue(monthNamesState);
  const schedules = useAtomValue(schedulesState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);
  const weekendDay = useAtomValue(weekendMeetingWeekdayState);

  const [total, setTotal] = useState(0);
  const [assigned, setAssigned] = useState(0);

  const expanded = useMemo(() => {
    return currentExpanded === month.toString();
  }, [currentExpanded, month]);

  const monthName = useMemo(() => {
    return monthNames[month];
  }, [monthNames, month]);

  const assignComplete = useMemo(() => {
    return total === 0 ? false : assigned === total;
  }, [total, assigned]);

  const meeting_month = useMemo(() => {
    if (!selectedWeek) return;

    let toAdd = 0;

    if (meetingType === 'midweek') {
      toAdd = meetingExactDate ? midweekDay - 1 : 0;
    }

    if (meetingType === 'weekend') {
      toAdd = weekendDay - 1;
    }

    const meetingDate = addDays(selectedWeek, toAdd);
    return meetingDate.getMonth().toString();
  }, [selectedWeek, meetingType, midweekDay, weekendDay, meetingExactDate]);

  const counts = useMemo(() => {
    let total = 0;
    let assigned = 0;

    for (const week of weeks) {
      const schedule = schedules.find((record) => record.weekOf === week);

      if (!schedule) {
        continue;
      }

      const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meetingType);

      total += data.total;
      assigned += data.assigned;
    }

    return { total, assigned };
  }, [weeks, schedules, meetingType]);

  const handleToggleExpand = () => {
    if (currentExpanded === month.toString()) {
      setSelectedWeek('');
      onChangeCurrentExpanded('');
    } else {
      setSelectedWeek('');
      onChangeCurrentExpanded(month.toString());
    }
  };

  useEffect(() => {
    if (!meeting_month) return;

    if (meeting_month !== currentExpanded) {
      onChangeCurrentExpanded(meeting_month);
    }
  }, [meeting_month, onChangeCurrentExpanded, currentExpanded]);

  useEffect(() => {
    setTotal(counts.total);
    setAssigned(counts.assigned);
  }, [counts]);

  return { monthName, expanded, handleToggleExpand, assignComplete };
};

export default useMonthItem;
