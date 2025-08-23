import { Box } from '@mui/material';
import { IconCheck, IconClose, IconSearch } from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Autocomplete from '@components/autocomplete';
import usePersons from '@features/persons/hooks/usePersons';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import { formatDate } from '@utils/date';
import { buildPersonFullname } from '@utils/common';
import useFieldServiceMeetingForm from './useFieldServiceMeetingForm';
import { FieldServiceMeetingFormProps } from './index.types';

const FieldServiceMeetingForm = (props: FieldServiceMeetingFormProps) => {
  const { t } = useAppTranslation();
  const { laptopDown, tabletDown } = useBreakpoints();
  const {
    localMeeting,
    errors,
    handleChangeMeetingType,
    handleChangeSelectedGroup,
    handleChangeConductor,
    handleChangeAssistant,
    handleChangeDate,
    handleChangeTime,
    handleChangeMaterials,
    handleSaveMeeting,
  } = useFieldServiceMeetingForm(props);

  // Meeting type list with localized labels
  const meetingTypeList = [
    { value: 'joint', label: t('tr_jointMeeting') },
    { value: 'group', label: t('tr_groupMeeting') },
    { value: 'zoom', label: t('tr_zoom') },
  ];
  // Use initialValues for edit mode, fallback to defaults for add mode
  const meetingType = localMeeting.type ?? 'joint';
  const selectedGroup = localMeeting.group ?? '';

  // Get all groups and persons
  const { groups_list } = useFieldServiceGroups();
  const { getAppointedBrothers } = usePersons();
  const currentMonth = formatDate(new Date(), 'yyyy/MM');
  const appointedBrothers = getAppointedBrothers(currentMonth);

  // Conductor options logic
  let brotherOptions: string[] = [];
  if (meetingType === 'group' && selectedGroup) {
    const group = groups_list.find((g) => g.group_data.name === selectedGroup);
    if (group) {
      const groupMemberUIDs = group.group_data.members.map((m) => m.person_uid);
      brotherOptions = appointedBrothers
        .filter((person) => groupMemberUIDs.includes(person.person_uid))
        .map((person) =>
          buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value
          )
        );
    }
  } else {
    brotherOptions = appointedBrothers.map((person) =>
      buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value
      )
    );
  }

  // Get all group names from field service groups
  const groupOptions = groups_list.map((group) => group.group_data.name);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Typography className="h3" color="var(--black)">
        {props.type === 'add'
          ? t('tr_addFieldServiceMeeting')
          : t('tr_editFieldServiceMeeting')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexDirection: laptopDown ? 'column' : 'row',
        }}
      >
        <Select
          label={t('tr_type')}
          value={meetingType}
          onChange={handleChangeMeetingType}
          error={errors.meetingType}
          helperText={errors.meetingType && t('tr_fillRequiredField')}
          sx={{ minWidth: 180 }}
        >
          {meetingTypeList.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
        {meetingType === 'group' && (
          <Select
            label={t('tr_group')}
            value={selectedGroup}
            onChange={handleChangeSelectedGroup}
            error={errors.selectedGroup}
            helperText={errors.selectedGroup && t('tr_fillRequiredField')}
            sx={{ minWidth: 180 }}
          >
            {groupOptions.length === 0 ? (
              <MenuItem value="">{t('tr_noOptions')}</MenuItem>
            ) : (
              groupOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))
            )}
          </Select>
        )}

        <Autocomplete
          label={t('tr_conductor')}
          value={localMeeting.conductor ?? ''}
          options={brotherOptions}
          onChange={handleChangeConductor}
          error={errors.conductor}
          helperText={errors.conductor && t('tr_fillRequiredField')}
          endIcon={<IconSearch />}
        />
        {meetingType === 'joint' && (
          <Autocomplete
            label={t('tr_assistant')}
            value={localMeeting.assistant ?? ''}
            options={brotherOptions}
            onChange={handleChangeAssistant}
            error={errors.assistant}
            helperText={errors.assistant && t('tr_fillRequiredField')}
            endIcon={<IconSearch />}
          />
        )}
      </Box>
      <Divider color="var(--accent-200)" />
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_details')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="space-between"
          flex={1}
          flexDirection={tabletDown ? 'column' : 'row'}
        >
          <DatePicker
            sx={{ flex: 1, height: '48px' }}
            label={t('tr_date')}
            value={localMeeting.date}
            onChange={handleChangeDate}
          />
          <TimePicker
            sx={{ flex: 1, height: '48px' }}
            label={t('tr_time')}
            ampm={false}
            value={localMeeting.time}
            onChange={handleChangeTime}
          />
        </Box>
        {/* Removed location and address fields */}
      </Box>
      <TextField
        label={t('tr_material')}
        height={48}
        value={localMeeting.materials}
        onChange={handleChangeMaterials}
        error={errors.materials}
        helperText={errors.materials && t('tr_fillRequiredField')}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Button
          variant="secondary"
          startIcon={<IconClose />}
          color="red"
          onClick={props.onCancel}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleSaveMeeting}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetingForm;
