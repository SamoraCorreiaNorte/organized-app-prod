import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useIntersectionObserver } from '@hooks/index';
import { schedulesState } from '@states/schedules';
import { addMonths, formatDate, getWeekDate } from '@utils/date';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userLocalUIDState,
  userDataViewState,
} from '@states/settings';
import { ASSIGNMENT_PATH } from '@constants/index';
import { schedulesGetData } from '@services/app/schedules';
import { AssignmentCongregation } from '@definition/schedules';
import { monthShortNamesState } from '@states/app';
import { personsState } from '@states/persons';
import { AssignmentFieldType } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';
import { WeeklySchedulesType } from '@features/meetings/weekly_schedules/week_selector/index.types';

const useDutiesContainer = (meetingType: WeeklySchedulesType) => {
  const currentWeekVisible = useIntersectionObserver({
    root: '.schedules-view-week-selector .MuiTabs-scroller',
    selector: '.schedules-current-week',
  });

  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const persons = useAtomValue(personsState);
  const dataView = useAtomValue(userDataViewState);
  const monthNames = useAtomValue(monthShortNamesState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);

  const [value, setValue] = useState<number | boolean>(false);

  const noSchedule = useMemo(() => {
    if (schedules.length === 0) return true;

    const hasMeeting = schedules.some((schedule) => {
      if (meetingType === 'weekend') return !!schedule.weekend_meeting;

      return !!schedule.midweek_meeting;
    });

    return !hasMeeting;
  }, [schedules, meetingType]);

  const filteredSchedules = useMemo(() => {
    const minDate = formatDate(addMonths(new Date(), -2), 'yyyy/MM/dd');

    return schedules.filter((record) => record.weekOf >= minDate);
  }, [schedules]);

  const week = useMemo(() => {
    if (typeof value === 'boolean') return null;

    return filteredSchedules.at(value)?.weekOf || null;
  }, [value, filteredSchedules]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const getAssignedInfo = useCallback(
    (assignment: AssignmentFieldType) => {
      if (!schedule) return { name: '-', active: false };

      const path = ASSIGNMENT_PATH[assignment];
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (!assigned?.value) return { name: '-', active: false };

      const isActive = assigned.value === userUID;

      const person = persons.find(
        (record) => record.person_uid === assigned.value
      );

      if (person) {
        return {
          name: personGetDisplayName(
            person,
            displayNameEnabled,
            fullnameOption
          ),
          active: isActive,
        };
      }

      if (assigned.name?.length > 0) {
        return { name: assigned.name, active: isActive };
      }

      return { name: assigned.value, active: isActive };
    },
    [schedule, dataView, persons, displayNameEnabled, fullnameOption, userUID]
  );

  const scheduleLastUpdated = useMemo(() => {
    if (!schedule || noSchedule) return;

    const assignments = Object.entries(ASSIGNMENT_PATH);
    const prefix = meetingType === 'weekend' ? 'WE' : 'MW';
    const dutiesAssignments = assignments.filter((record) =>
      record[0].startsWith(`${prefix}_DUTIES_`)
    );

    const dates: string[] = [];
    for (const [, path] of dutiesAssignments) {
      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      if (assigned?.updatedAt?.length > 0) {
        dates.push(assigned.updatedAt);
      }
    }

    const recentDate = dates.sort((a, b) => b.localeCompare(a)).at(0);
    if (!recentDate) return;

    const d = new Date(recentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const monthName = monthNames[month];

    const dateFormatted = t('tr_longDateWithYearLocale', {
      year,
      month: monthName,
      date,
    });

    return dateFormatted;
  }, [schedule, dataView, monthNames, t, noSchedule, meetingType]);

  const handleGoCurrent = () => {
    const now = getWeekDate();
    const weekOf = formatDate(now, 'yyyy/MM/dd');

    const index = filteredSchedules.findIndex(
      (record) => record.weekOf === weekOf
    );

    setValue(index);
  };

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  return {
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    dataView,
    getAssignedInfo,
  };
};

export default useDutiesContainer;
