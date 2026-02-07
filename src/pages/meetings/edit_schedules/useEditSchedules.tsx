import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { EditSchedulesType } from './index.types';
import { settingsState, userDataViewState } from '@states/settings';
import MidweekContainer from '@features/meetings/weekly_schedules/midweek_container';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import WeekendContainer from '@features/meetings/weekly_schedules/weekend_container';
import DutiesEditor from '@features/meetings/duties_schedule/duties_editor';
import MidweekEditor from '@features/meetings/midweek_editor';
import WeekendEditor from '@features/meetings/weekend_editor';
import MidweekMeeting from '../midweek';
import WeekendMeeting from '../weekend';
import MeetingDuties from '../duties';

const LOCALSTORAGE_KEY = 'organized_edit_schedules';

const scheduleType = localStorageGetItem(LOCALSTORAGE_KEY) as EditSchedulesType;

const useEditSchedules = () => {
  const { t } = useAppTranslation();

  const value = useMemo(() => {
    if (!scheduleType) return 0;

    if (scheduleType === 'midweek') return 0;
    if (scheduleType === 'weekend') return 1;
    if (scheduleType === 'duties') return 2;
  }, []);

  const { isAppointed } = useCurrentUser();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const outgoingVisible = useMemo(() => {
    if (isAppointed) return true;

    const weekend = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    return weekend.outgoing_talks_schedule_public.value;
  }, [isAppointed, settings, dataView]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_midweekMeeting'),
        Component: <MidweekMeeting />,
      },
      {
        label: t('tr_weekendMeeting'),
        Component: <WeekendMeeting />,
      },
      {
        label: t('tr_departments'),
        Component: <MeetingDuties />,
      },
    ];

    return result;
  }, [t]);

  const handleScheduleChange = (value: number) => {
    let type: EditSchedulesType;

    if (value === 0) type = 'midweek';
    if (value === 1) type = 'weekend';
    if (value === 2) type = 'duties';

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
  };

  return { value, handleScheduleChange, tabs };
};

export default useEditSchedules;
