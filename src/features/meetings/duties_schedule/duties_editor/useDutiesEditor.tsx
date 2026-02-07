import { useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { selectedDayState } from '@states/schedules';
//import { formatMediumDateWithFullMonth } from '@utils/date';

const useDutiesEditor = () => {
  const [selectedWeek] = useAtom(selectedDayState);

  const weekDateLocale = useMemo(() => {
    return selectedWeek?.locale;
  }, [selectedWeek]);

  const dayType = useMemo(() => {
    return selectedWeek?.dayType;
  }, [selectedWeek]);

  return {
    weekDateLocale,
    dayType,
  };
};

export default useDutiesEditor;
