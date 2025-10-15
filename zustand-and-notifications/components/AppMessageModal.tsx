import React from 'react';

import { useAuth } from 'providers/AuthContextProvider';
import { AppMessageType, useAppMessageStore } from 'stores/useAppMessageStore';
import Button from 'ui/Button';
import DoubleButton from 'ui/DoubleButton';
import { ScreenNameValueType } from 'util/avo/Avo';
import openContactForm from 'util/openContactForm';

import InfoModal, { IconType } from './InfoModal';

interface AppMessage {
  title: string;
  subtitle: string;
  iconType: IconType;
  screenTrackingName: ScreenNameValueType;
  buttonText?: string;
  onPress?: () => void;
  useContactForm?: boolean;
}

function AppMessageModal() {
  const { authenticate } = useAuth();
  const messageType = useAppMessageStore(state => state.messageType);
  const clearMessage = useAppMessageStore(state => state.clearMessage);

  const messageDetails: Record<AppMessageType, AppMessage> = {
    CHANGE_EMAIL_SUCCESS: {
      title: 'Email updated',
      subtitle: 'Your new email address is now verified and saved.',
      iconType: 'done',
      screenTrackingName: 'change_email_verified',
    },
    REGISTER_SUCCESS: {
      title: 'Email verified',
      subtitle: "You're now ready to use the app.",
      iconType: 'done',
      screenTrackingName: 'sign_up_email_verified',
    },
    LINK_FAILED_ERROR: {
      title: 'Sign-in link failed',
      subtitle:
        'Please try to sign in again. If you still have problems, please contact support.',
      iconType: 'warning',
      screenTrackingName: 'sign_in_failed',
      useContactForm: true,
    },
    OFFLINE_WARNING: {
      title: 'Internet unavailable',
      subtitle:
        "We're having trouble reaching our system. Please check your Internet connection.",
      iconType: 'disconnected',
      screenTrackingName: 'internet_outage',
      buttonText: 'Retry',
      onPress: () => authenticate(),
    },
    AUTHENTICATION_FAILED_ERROR: {
      title: 'Sign-in link failed',
      subtitle:
        'Please tap the link in your email again. If that fails, please force-quit the app and tap the link again.',
      iconType: 'warning',
      screenTrackingName: 'sign_in_failed',
      useContactForm: true,
    },
    KID_DEVICE_SETUP_COMPLETE: {
      title: 'This device is good to go! Now head back to the parent app.',
      subtitle:
        "You'll choose all screen time settings and content restrictions from the parent app.",
      iconType: 'party',
      screenTrackingName: 'kid_app_setup_complete',
      buttonText: 'Close',
    },
  };

  if (!messageType) {
    return null;
  }

  function buttonPressHandler() {
    clearMessage();
    messageDetails[messageType].onPress?.();
  }

  const message = messageDetails[messageType];

  return (
    <InfoModal
      visible={Boolean(messageType)}
      iconType={message.iconType}
      title={message.title}
      subtitle={message.subtitle}
      screenTrackingName={message.screenTrackingName}
    >
      {message.useContactForm ? (
        <DoubleButton
          topButtonText={message.buttonText || 'Continue'}
          topButtonTestID="continue-button"
          onPressTopButton={buttonPressHandler}
          bottomButtonText="Contact us"
          bottomButtonType="link"
          onPressBottomButton={() =>
            openContactForm({
              screenTrackingName: message.screenTrackingName,
            })
          }
        />
      ) : (
        <Button onPress={buttonPressHandler} testID="continue-button">
          {message.buttonText || 'Continue'}
        </Button>
      )}
    </InfoModal>
  );
}

export default AppMessageModal;
