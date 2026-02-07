import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  useAppTranslation,
  useCurrentUser,
  useBreakpoints,
} from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { EditSchedulesType } from './index.types';
import { settingsState, userDataViewState } from '@states/settings';
import Button from '@components/button';
import {
  IconGenerate,
  IconPrint,
  IconPublish,
  IconCalendarMonth,
  IconCalendarWeek,
} from '@components/icons';
import useMidweek from '../midweek/useMidweek';
import useWeekend from '../weekend/useWeekend';
import useDuties from '../duties/useDuties';
import MidweekMeeting from '../midweek';
import WeekendMeeting from '../weekend';
import MeetingDuties from '../duties';

const LOCALSTORAGE_KEY = 'organized_edit_schedules';

const useEditSchedules = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const [value, setValue] = useState(() => {
    const scheduleType = localStorageGetItem(
      LOCALSTORAGE_KEY
    ) as EditSchedulesType;

    if (!scheduleType) return 0;

    if (scheduleType === 'midweek') return 0;
    if (scheduleType === 'weekend') return 1;
    if (scheduleType === 'duties') return 2;

    return 0;
  });

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

  const midweekState = useMidweek();
  const weekendState = useWeekend();
  const dutiesState = useDuties();

  const titleProps = useMemo(() => {
    if (value === 0) {
      const {
        hasWeeks,
        openWeekView,
        handleCloseWeekView,
        handleOpenWeekView,
        handleOpenExport,
        handleOpenAutofill,
        isConnected,
        handleOpenPublish,
        handleOpenQuickSettings,
      } = midweekState;

      return {
        title: t('tr_midweekMeeting'),
        quickAction: handleOpenQuickSettings,
        buttons: hasWeeks && (
          <>
            {openWeekView
              ? desktopUp && (
                  <Button
                    variant="secondary"
                    onClick={handleCloseWeekView}
                    startIcon={<IconCalendarMonth />}
                  >
                    {t('tr_monthlyView')}
                  </Button>
                )
              : desktopUp && (
                  <Button
                    variant="secondary"
                    onClick={handleOpenWeekView}
                    startIcon={<IconCalendarWeek />}
                  >
                    {t('tr_weeklyView')}
                  </Button>
                )}

            <Button
              variant="secondary"
              onClick={handleOpenExport}
              startIcon={<IconPrint />}
            >
              {t('tr_export')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleOpenAutofill}
              startIcon={<IconGenerate />}
            >
              {t('tr_autofill')}
            </Button>
            {isConnected && (
              <Button
                variant="main"
                startIcon={<IconPublish />}
                onClick={handleOpenPublish}
              >
                {t('tr_publish')}
              </Button>
            )}
          </>
        ),
      };
    }

    if (value === 1) {
      const {
        hasWeeks,
        handleOpenExport,
        handleOpenAutofill,
        isConnected,
        handleOpenPublish,
        handleOpenQuickSettings,
        handleOpenPublish: handleOpenPublishWeekend,
      } = weekendState;

      return {
        title: t('tr_weekendMeeting'),
        quickAction: handleOpenQuickSettings,
        buttons: hasWeeks && (
          <>
            <Button
              variant="secondary"
              startIcon={<IconPrint />}
              onClick={handleOpenExport}
            >
              {t('tr_export')}
            </Button>
            <Button
              variant="secondary"
              startIcon={<IconGenerate />}
              onClick={handleOpenAutofill}
            >
              {t('tr_autofill')}
            </Button>
            {isConnected && (
              <Button
                variant="main"
                startIcon={<IconPublish />}
                onClick={handleOpenPublishWeekend}
              >
                {t('tr_publish')}
              </Button>
            )}
          </>
        ),
      };
    }

    if (value === 2) {
      const { handleOpenQuickSettings } = dutiesState;

      return {
        title: t('tr_meetingDutiesSchedules'),
        quickAction: handleOpenQuickSettings,
      };
    }
  }, [value, midweekState, weekendState, dutiesState, desktopUp, t]);

  const tabs = useMemo(() => {
    const result = [
      {
        label: t('tr_midweekMeeting'),
        Component: <MidweekMeeting {...midweekState} />,
      },
      {
        label: t('tr_weekendMeeting'),
        Component: <WeekendMeeting {...weekendState} />,
      },
      {
        label: t('tr_departments'),
        Component: <MeetingDuties {...dutiesState} />,
      },
    ];

    return result;
  }, [t, midweekState, weekendState, dutiesState]);

  const handleScheduleChange = (value: number) => {
    let type: EditSchedulesType;

    if (value === 0) type = 'midweek';
    if (value === 1) type = 'weekend';
    if (value === 2) type = 'duties';

    localStorage.setItem(LOCALSTORAGE_KEY, type!);
    setValue(value);
  };

  return {
    value,
    handleScheduleChange,
    tabs,
    titleProps,
    midweekState,
    weekendState,
    dutiesState,
  };
};

export default useEditSchedules;
