import { MeetingType } from '@definition/app';
import { SourcesFormattedType } from '@definition/sources';

export type MonthsContainerType = {
  months: SourcesFormattedType['months'];
  reverse?: boolean;
  meetingType: MeetingType;
};
