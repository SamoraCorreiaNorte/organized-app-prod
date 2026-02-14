import { useMemo, useState } from 'react';
import { useAppTranslation } from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import MidweekContainer from '@features/meetings/weekly_schedules/midweek_container';
import MeetingDutiesSchedule from '../duties';

type MidweekMeetingsTabType = 'meeting' | 'departments';

const LOCALSTORAGE_KEY = 'organized_midweek_meetings';

const useMidweekMeetings = () => {
  const { t } = useAppTranslation();

  const [value, setValue] = useState(() => {
    const tabType = localStorageGetItem(
      LOCALSTORAGE_KEY
    ) as MidweekMeetingsTabType;

    if (!tabType) return 0;

    if (tabType === 'meeting') return 0;
    if (tabType === 'departments') return 1;

    return 0;
  });

  const tabs = useMemo(
    () => [
      {
        label: t('tr_midweekMeeting'),
        Component: <MidweekContainer />,
      },
      {
        label: t('tr_departments'),
        Component: <MeetingDutiesSchedule />,
      },
    ],
    [t]
  );

  const handleTabChange = (newValue: number) => {
    let type: MidweekMeetingsTabType;

    if (newValue === 0) type = 'meeting';
    if (newValue === 1) type = 'departments';

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
    setValue(newValue);
  };

  return { value, tabs, handleTabChange };
};

export default useMidweekMeetings;
