import { useMemo, useState } from 'react';
import {
  useAppTranslation,
  useCurrentUser,
  useBreakpoints,
} from '@hooks/index';
import { localStorageGetItem } from '@utils/common';
import { EditSchedulesType } from './index.types';
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
import MidweekMeetingSchedule from '../midweek';
import WeekendMeetingSchedule from '../weekend';
import MeetingDutiesSchedule from '../duties';

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

  const { isMidweekEditor, isWeekendEditor, isDutiesEditor } = useCurrentUser();

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
        title: t('tr_midweekMeetingScheduling'),
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
        handleOpenQuickSettings,
        handleOpenPublish: handleOpenPublishWeekend,
      } = weekendState;

      return {
        title: t('tr_weekendMeetingScheduling'),
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
      const {
        handleOpenQuickSettings,
        handleOpenExport,
        handleOpenPublish,
        hasWeeks,
        isConnected,
      } = dutiesState;

      return {
        title: t('tr_meetingDutiesScheduling'),
        quickAction: handleOpenQuickSettings,
        buttons: hasWeeks && (
          <>
            <Button
              variant="secondary"
              onClick={handleOpenExport}
              startIcon={<IconPrint />}
            >
              {t('tr_export')}
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
  }, [value, midweekState, weekendState, dutiesState, desktopUp, t]);

  const tabs = useMemo(() => {
    const result = [];

    if (isMidweekEditor) {
      result.push({
        label: t('tr_midweekMeeting'),
        Component: (
          <MidweekMeetingSchedule openWeekView={midweekState.openWeekView} />
        ),
      });
    }

    if (isWeekendEditor) {
      result.push({
        label: t('tr_weekendMeeting'),
        Component: <WeekendMeetingSchedule />,
      });
    }
    if (isDutiesEditor) {
      result.push({
        label: t('tr_departments'),
        Component: <MeetingDutiesSchedule />,
      });
    }

    return result;
  }, [t, midweekState, isMidweekEditor, isWeekendEditor, isDutiesEditor]);

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
