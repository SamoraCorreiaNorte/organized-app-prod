import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Week } from '@definition/week_type';
import { MeetingType } from '@definition/app';
import { formatMediumDateWithFullMonth } from '@utils/date';
import { schedulesState, selectedWeekState } from '@states/schedules';
import {
  schedulesGetMeetingDate,
  schedulesWeekAssignmentsInfo,
} from '@services/app/schedules';
import {
  userDataViewState,
  weekendMeetingOpeningPrayerAutoAssignState,
} from '@states/settings';
import { WeekTypeCongregation } from '@definition/schedules';

const useWeekItem = (week: string, meetingType: MeetingType) => {
  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const prayerAutoAssign = useAtomValue(
    weekendMeetingOpeningPrayerAutoAssignState
  );

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const isSelected = useMemo(() => {
    return week === selectedWeek;
  }, [week, selectedWeek]);

  const weekType = useMemo(() => {
    if (!schedule || meetingType === 'duties') return Week.NORMAL;

    const field = schedule[`${meetingType}_meeting`]
      .week_type as WeekTypeCongregation[];

    return (
      field.find((record) => record.type === dataView)?.value ?? Week.NORMAL
    );
  }, [schedule, dataView, meetingType]);

  const weekDateLocale = useMemo(() => {
    if (meetingType === 'duties') {
      return formatMediumDateWithFullMonth(week);
    }

    const meetingDate = schedulesGetMeetingDate({ week, meeting: meetingType });

    return meetingDate.locale;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [week, meetingType, weekType]);

  const { assigned, total } = useMemo(() => {
    const values = { assigned: 0, total: 0 };

    if (!schedule) return values;

    const data = schedulesWeekAssignmentsInfo(schedule.weekOf, meetingType);

    values.assigned = data.assigned;
    values.total = data.total;

    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, meetingType, prayerAutoAssign]);

  const handleSelectWeek = (value: string) => {
    setSelectedWeek(value);
  };

  return { weekDateLocale, handleSelectWeek, isSelected, total, assigned };
};

export default useWeekItem;
