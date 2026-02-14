import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { settingsState, userDataViewState } from '@states/settings';
import WeekendContainer from '@features/meetings/weekly_schedules/weekend_container';
import OutgoingTalks from '@features/meetings/weekly_schedules/outgoing_talks';
import MeetingDutiesSchedule from '../duties';

type WeekendMeetingsTabType = 'meeting' | 'departments' | 'outgoing';

const LOCALSTORAGE_KEY = 'organized_weekend_meetings';

const useWeekendMeetings = () => {
  const { t } = useAppTranslation();
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

  const [value, setValue] = useState(() => {
    const tabType = localStorageGetItem(
      LOCALSTORAGE_KEY
    ) as WeekendMeetingsTabType;

    if (!tabType) return 0;

    if (tabType === 'meeting') return 0;
    if (tabType === 'departments') return 1;
    if (tabType === 'outgoing') return 2;

    return 0;
  });

  useEffect(() => {
    if (!outgoingVisible && value === 2) {
      localStorage.setItem(LOCALSTORAGE_KEY, 'meeting');
      setValue(0);
    }
  }, [outgoingVisible, value]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_weekendMeeting'),
        Component: <WeekendContainer />,
      },
      {
        label: t('tr_departments'),
        Component: <MeetingDutiesSchedule />,
      },
    ];

    if (outgoingVisible) {
      result.push({
        label: t('tr_outgoingTalks'),
        Component: <OutgoingTalks />,
      });
    }

    return result;
  }, [outgoingVisible, t]);

  const handleTabChange = (newValue: number) => {
    let type: WeekendMeetingsTabType;

    if (newValue === 0) type = 'meeting';
    if (newValue === 1) type = 'departments';
    if (newValue === 2) type = 'outgoing';

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
    setValue(newValue);
  };

  return { value, tabs, handleTabChange };
};

export default useWeekendMeetings;
