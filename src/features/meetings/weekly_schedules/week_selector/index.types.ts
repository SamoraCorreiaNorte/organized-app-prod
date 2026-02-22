export type WeekSelectorProps = {
  value: number | boolean;
  onChange?: (value: number) => void;
  meetingType: WeeklySchedulesType;
};

export type WeeklySchedulesType = 'midweek' | 'weekend';
