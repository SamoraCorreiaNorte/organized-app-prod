import { MeetingType } from '@definition/app';

export type MonthItemType = {
  month: number;
  weeks: string[];
  currentExpanded: string;
  onChangeCurrentExpanded: (value: string) => void;
  meetingType: MeetingType;
};
