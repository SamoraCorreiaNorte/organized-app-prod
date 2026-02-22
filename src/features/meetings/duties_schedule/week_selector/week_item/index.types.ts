import { MeetingType } from '@definition/app';

export type WeekItemType = {
  day: {
    date: string;
    locale: string;
  };
  week: string;
  meetingType: MeetingType;
  dayType: 'midweek' | 'weekend';
};
