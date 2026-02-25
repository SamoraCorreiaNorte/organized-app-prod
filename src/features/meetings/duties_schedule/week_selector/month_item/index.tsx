import { Box, Collapse } from '@mui/material';
import { IconCheck, IconCollapse } from '@components/icons';
import { MonthItemType } from './index.types';
import useMonthItem from './useMonthItem';
import { schedulesGetMeetingDate } from '@services/app/schedules';
import Typography from '@components/typography';
import WeekItem from '../week_item';

const parseMeetingDate = (value: string) => {
  const parts = value.split('/');
  if (parts.length !== 3 || parts.some((part) => part.trim().length === 0)) {
    return null;
  }

  const [yearStr, monthStr, dayStr] = parts;
  const year = Number(yearStr);
  const monthIndex = Number(monthStr);
  const dayOfMonth = Number(dayStr);

  if (
    Number.isNaN(year) ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(dayOfMonth) ||
    monthIndex < 1 ||
    monthIndex > 12 ||
    dayOfMonth < 1 ||
    dayOfMonth > 31
  ) {
    return null;
  }

  return new Date(year, monthIndex - 1, dayOfMonth);
};

const MonthItem = (props: MonthItemType) => {
  const { weeks, meetingType, month } = props;
  const days: {
    week: string;
    type: 'midweek' | 'weekend';
    date: {
      date: string;
      locale: string;
    };
  }[] = [];
  if (meetingType === 'duties') {
    weeks.forEach((week) => {
      const midweek = schedulesGetMeetingDate({ week, meeting: 'midweek' });
      const weekend = schedulesGetMeetingDate({ week, meeting: 'weekend' });
      const midweekDateObj = parseMeetingDate(midweek.date);
      if (midweekDateObj && midweekDateObj.getMonth() === month) {
        days.push({
          week,
          type: 'midweek',
          date: {
            date: midweekDateObj.toString(),
            locale: midweek.locale,
          },
        });
      }

      const weekendDateObj = parseMeetingDate(weekend.date);
      if (weekendDateObj && weekendDateObj.getMonth() === month) {
        days.push({
          week,
          type: 'weekend',
          date: {
            date: weekendDateObj.toString(),
            locale: weekend.locale,
          },
        });
      }
    });
  }

  const { monthName, expanded, handleToggleExpand, assignComplete } =
    useMonthItem(props);

  return (
    <Box>
      <Box
        sx={{
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={handleToggleExpand}
      >
        <Typography className="h4">{monthName}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {assignComplete && (
            <Box
              sx={{
                borderRadius: 'var(--radius-max)',
                width: '18.4px',
                height: '18.4px',
                padding: '2px',
                backgroundColor: 'var(--accent-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck color="var(--white)" height={14.4} width={14.4} />
            </Box>
          )}

          <IconCollapse
            color="var(--black)"
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {days.map((day) => (
          <WeekItem
            key={day.week + '-' + day.type}
            day={day.date}
            week={day.week}
            meetingType={meetingType}
            dayType={day.type}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default MonthItem;
