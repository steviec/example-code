import { act, render } from '@testing-library/react-native';

import { appMessageStore } from 'stores/useAppMessageStore';

import AppMessageModal from './AppMessageModal';

// https://testing-library.com/docs/example-react-context/
// const renderWithAuthProviderState = (ui, value = {}) =>
//   render(<AuthContext.Provider value={value}>{ui}</AuthContext.Provider>);

describe('AuthStatusModal', () => {
  afterEach(async () => {
    // Clear the app message store after each test
    await act(async () => {
      appMessageStore.setState({ messageType: undefined });
    });
  });

  test('Shows success modal for registration', async () => {
    appMessageStore.setState({ messageType: 'REGISTER_SUCCESS' });
    const { findByText } = render(<AppMessageModal />);
    await findByText(/Email verified/i);
  });

  test('Shows success modal for change email', async () => {
    await act(() => {
      appMessageStore.setState({ messageType: 'CHANGE_EMAIL_SUCCESS' });
    });

    const { findByText } = render(<AppMessageModal />);
    await findByText(/Email updated/i);
  });

  test('Shows error modal for link failed errors', async () => {
    await act(() => {
      appMessageStore.setState({ messageType: 'LINK_FAILED_ERROR' });
    });
    const { findByText } = render(<AppMessageModal />);
    await findByText(/Sign-in link failed/i);
  });

  test('Shows error modal for offline errors', async () => {
    appMessageStore.setState({ messageType: 'OFFLINE_WARNING' });
    const { findByText } = render(<AppMessageModal />);
    await findByText(/Internet unavailable/i);
  });

  test('Shows error modal for authentication failed errors', async () => {
    appMessageStore.setState({ messageType: 'AUTHENTICATION_FAILED_ERROR' });
    const { findByText } = render(<AppMessageModal />);
    await findByText(/Sign-in link failed/i);
  });
});
