import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import {
  disconnectCongAccount,
  setIsAboutOpen,
  setIsAppLoad,
  setIsContactOpen,
  setIsSetup,
  setIsSupportOpen,
  setOfflineOverride,
} from '@services/states/app';
import useStartup from '@features/app_start/vip/startup/useStartup';
import useInternetChecker from '@hooks/useInternetChecker';
import { displaySnackNotification } from '@services/states/app';
import { IconNoConnection } from '@components/icons';
import useAppTranslation from '@hooks/useAppTranslation';
import { useBreakpoints } from '@hooks/index';
import {
  congAccountConnectedState,
  isAppLoadState,
  navBarAnchorElState,
} from '@states/app';
import {
  accountTypeState,
  congNameState,
  fullnameState,
} from '@states/settings';
import { userSignOut } from '@services/firebase/auth';

const useNavbar = () => {
  const navigate = useNavigate();

  const { laptopUp, tabletDown, tabletUp } = useBreakpoints();

  const [anchorEl, setAnchorEl] = useAtom(navBarAnchorElState);

  const fullname = useAtomValue(fullnameState);
  const congName = useAtomValue(congNameState);
  const isCongAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);
  const accountType = useAtomValue(accountTypeState);

  const isOffline = isAppLoad ? false : !isCongAccountConnected;

  const { runStartupCheck } = useStartup();
  const { isNavigatorOnline } = useInternetChecker();
  const { t } = useAppTranslation();
  const openMore = Boolean(anchorEl);

  const handleOpenMoreMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleOpenMyProfile = () => {
    handleCloseMore();
    navigate(`/user-profile`);
  };

  const handleReconnectAccount = async () => {
    handleCloseMore();
    setIsSetup(true);
    setIsAppLoad(true);
    setOfflineOverride(true);
    //await runStartupCheck();
  };

  const handleReconnectExistingAccount = async () => {
    handleCloseMore();
    if (!isNavigatorOnline) {
      displaySnackNotification({
        header: t('tr_noInternetConnection'),
        message: t('tr_noInternetConnectionDesc'),
        icon: <IconNoConnection color="var(--always-white)" />,
        severity: 'error',
      });
      return;
    }
    await runStartupCheck();
  };

  const handleOpenContact = async () => {
    handleCloseMore();
    setIsContactOpen(true);
  };

  const handleOpenAbout = () => {
    handleCloseMore();
    setIsAboutOpen(true);
  };

  const handleOpenSupport = () => {
    handleCloseMore();
    setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    handleCloseMore();
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  const handleOpenRealApp = () => {
    handleCloseMore();
    window.open(`https://scn-organized.org`, '_blank');
  };

  const handleDisonnectAccount = async () => {
    handleCloseMore();

    await userSignOut();
    disconnectCongAccount();

    location.reload();
  };

  return {
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleReconnectExistingAccount,
    handleOpenRealApp,
    accountType,
    handleDisonnectAccount,
    isOffline,
  };
};

export default useNavbar;
