import OAuthButtonBase from '../button_base';
import { authProvider } from '@services/firebase/auth';
import { useAppTranslation } from '@hooks/index';
import { IconMicrosoft } from '@icons/index';

const provider = authProvider.Microsoft;

const OAuthMicrosoft = () => {
  const { t } = useAppTranslation();

  return (
    <OAuthButtonBase
      provider={provider}
      text={t('tr_oauthMicrosoft')}
      logo={<IconMicrosoft />}
    />
  );
};

export default OAuthMicrosoft;
