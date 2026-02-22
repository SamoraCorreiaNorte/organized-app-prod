import { useMemo } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Week } from '@definition/week_type';
import { MeetingType } from '@definition/app';
import { formatMediumDateWithFullMonth } from '@utils/date';
import {
  schedulesState,
  selectedDayState,
  selectedWeekState,
} from '@states/schedules';
import {
  schedulesGetMeetingDate,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import {
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import { WeekTypeCongregation } from '@definition/schedules';

const useWeekItem = (
  day: { date: string; locale: string },
  week: string,
  meetingType: MeetingType,
  dayType: 'midweek' | 'weekend'
) => {
  const [selectedDay, setSelectedDay] = useAtom(selectedDayState);
  const setSelectedWeek = useSetAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const prayerAutoAssign = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const isSelected = useMemo(() => {
    return selectedDay ? day.date === selectedDay.date : false;
  }, [day.date, selectedDay]);

  const weekType = useMemo(() => {
    if (!schedule || meetingType === 'duties') return Week.NORMAL;

    const field = schedule[`${meetingType}_meeting`]
      .week_type as WeekTypeCongregation[];

    return (
      field.find((record) => record.type === dataView)?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, meetingType]);

  const weekDateLocale = useMemo(() => {
    return day.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, meetingType, weekType]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(
      schedule.weekOf,
      meetingType,
      dayType
    );

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, meetingType, dayType, prayerAutoAssign]);

  const handleSelectWeek = (value: { date: string; locale: string }) => {
    setSelectedDay({ ...value, dayType });
    setSelectedWeek(week);
  };

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
