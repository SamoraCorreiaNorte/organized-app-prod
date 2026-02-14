import { SourcesFormattedType } from '@definition/sources';
import { MeetingType } from '@definition/app';

export type MonthsContainerType = {
  months: SourcesFormattedType['months'];
  reverse?: boolean;
  meetingType: MeetingType;
};
