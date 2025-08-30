import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import { useCallback, useState } from 'react';
import { stackDatesToOne } from '@utils/date';

const initialErrors = {
  type: false,
  group: false,
  conductor: false,
  materials: false,
};

const useFieldServiceMeetingForm = ({ data, onSave }) => {
  const [localMeeting, setLocalMeeting] =
    useState<FieldServiceMeetingDataType>(data);
  const [errors, setErrors] = useState(initialErrors);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const { getGroupHostName } = useFieldServiceGroups();

  const validateField = useCallback(
    (field, value) => {
      switch (field) {
        case 'type':
          return !value;
        case 'group':
          return (
            localMeeting.meeting_data.type === 'group' &&
            (!value || value.trim() === '')
          );
        case 'conductor':
          return !value || value.trim() === '';
        case 'materials':
          return !value || value.trim() === '';
        default:
          return false;
      }
    },
    [localMeeting]
  );

  const validateForm = useCallback(() => {
    const meetingData = localMeeting.meeting_data;
    const newErrors = {
      type: validateField('type', meetingData.type),
      group: validateField('group', meetingData.group),
      conductor: validateField('conductor', meetingData.conductor),
      assistant: validateField('assistant', meetingData.assistant),
      materials: validateField('materials', meetingData.materials),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [localMeeting, validateField]);

  // Individual field change handlers
  const handleChangeType = useCallback(
    (event) => {
      setLocalMeeting((prev) => {
        return {
          ...prev,
          meeting_data: { ...prev.meeting_data, type: event.target.value },
        };
      });

      if (wasSubmitted) setErrors((prev) => ({ ...prev, type: false }));
    },
    [wasSubmitted]
  );

  const handleChangeGroup = useCallback(
    (event) => {
      const host = getGroupHostName(event.target.value);
      setLocalMeeting((prev) => ({
        ...prev,
        meeting_data: {
          ...prev.meeting_data,
          group: event.target.value,
          ...(host && { location: host }),
        },
      }));

      if (wasSubmitted) setErrors((prev) => ({ ...prev, group: false }));
    },
    [wasSubmitted, getGroupHostName]
  );

  const handleChangeConductor = useCallback(
    (_, value) => {
      setLocalMeeting((prev) => ({
        ...prev,
        meeting_data: { ...prev.meeting_data, conductor: value },
      }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, conductor: false }));
    },
    [wasSubmitted]
  );

  const handleChangeAssistant = useCallback((_, value) => {
    setLocalMeeting((prev) => ({
      ...prev,
      meeting_data: { ...prev.meeting_data, assistant: value },
    }));
  }, []);

  // Only update date and time separately
  const handleChangeDate = useCallback((dateValue: Date) => {
    setLocalMeeting((prev) => ({
      ...prev,
      meeting_data: {
        ...prev.meeting_data,
        date: stackDatesToOne(
          dateValue,
          new Date(prev.meeting_data.date),
          true
        ).toISOString(),
      },
    }));
  }, []);

  const handleChangeTime = useCallback((timeValue: Date) => {
    setLocalMeeting((prev) => ({
      ...prev,
      meeting_data: {
        ...prev.meeting_data,
        date: stackDatesToOne(
          new Date(prev.meeting_data.date),
          timeValue,
          true
        ).toISOString(),
      },
    }));
  }, []);

  const handleChangeMaterials = useCallback(
    (event) => {
      setLocalMeeting((prev) => ({
        ...prev,
        meeting_data: { ...prev.meeting_data, materials: event.target.value },
      }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, materials: false }));
    },
    [wasSubmitted]
  );

  const handleSaveMeeting = useCallback(() => {
    setWasSubmitted(true);
    if (validateForm()) {
      const meeting: FieldServiceMeetingDataType =
        structuredClone(localMeeting);

      meeting.meeting_data.updatedAt = new Date().toISOString();

      onSave(meeting);
    }
  }, [localMeeting, onSave, validateForm]);

  const handleDeleteMeeting = useCallback(() => {
    const meeting = structuredClone(localMeeting);

    meeting.meeting_data._deleted = true;
    meeting.meeting_data.updatedAt = new Date().toISOString();

    onSave(meeting);
  }, [localMeeting, onSave]);

  return {
    localMeeting,
    errors,
    handleChangeType,
    handleChangeGroup,
    handleChangeConductor,
    handleChangeAssistant,
    handleChangeDate,
    handleChangeTime,
    handleChangeMaterials,
    handleSaveMeeting,
    handleDeleteMeeting,
  };
};

export default useFieldServiceMeetingForm;
