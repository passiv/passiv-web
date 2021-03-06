import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { selectSettings } from '../../selectors';
import { selectGlobalPreferredCurrency } from '../../selectors/groups';
import { loadSettings } from '../../actions';
import { putData } from '../../api';
import { ToggleButton, StateText } from '../../styled/ToggleButton';
import Number from './../Number';
import { NumericTextInput } from '../../styled/Form';
import { SmallButton } from '../../styled/Button';
import {
  Edit,
  SubSetting,
  OptionsTitle,
  DisabledBox,
} from '../../styled/GlobalElements';
import { Settings } from '../../types/settings';

const CashNotificationSettings = () => {
  const settings = useSelector(selectSettings);
  const preferredCurrency = useSelector(selectGlobalPreferredCurrency);
  const dispatch = useDispatch();
  const [editingThreshold, setEditingThreshold] = useState(false);
  const [cashThreshold, setCashThreshold] = useState('');

  useEffect(() => {
    if (settings) {
      setCashThreshold(
        settings && parseFloat(settings.cash_email_threshold).toString(),
      );
    }
  }, [settings]);

  const updateNotification = () => {
    if (!settings) {
      return;
    }
    let newSettings: Settings = { ...settings };
    newSettings.receive_cash_notifications = !settings.receive_cash_notifications;
    putData('/api/v1/settings/', newSettings)
      .then(() => {
        dispatch(loadSettings());
      })
      .catch(() => {
        dispatch(loadSettings());
      });
  };

  const finishEditingThreshold = () => {
    if (!settings) {
      return;
    }

    let newSettings: Settings = { ...settings };

    newSettings.cash_email_threshold = cashThreshold;

    putData('/api/v1/settings/', newSettings)
      .then(() => {
        dispatch(loadSettings());
      })
      .catch(() => {
        dispatch(loadSettings());
      });

    setEditingThreshold(false);
  };

  const updateSummaryThresholdNotification = () => {
    if (!settings) {
      return;
    }
    let newSettings: Settings = { ...settings };
    newSettings.apply_cash_email_threshold_to_summary_email = !settings.apply_cash_email_threshold_to_summary_email;
    putData('/api/v1/settings/', newSettings)
      .then(() => {
        dispatch(loadSettings());
      })
      .catch(() => {
        dispatch(loadSettings());
      });
  };

  if (!settings) {
    return null;
  }

  let contents = (
    <React.Fragment>
      <OptionsTitle>Cash Notifications:</OptionsTitle>
      {settings.receive_cash_notifications ? (
        <React.Fragment>
          <ToggleButton onClick={updateNotification}>
            <React.Fragment>
              <FontAwesomeIcon icon={faToggleOn} />
              <StateText>on</StateText>
            </React.Fragment>
          </ToggleButton>
          <SubSetting>
            <OptionsTitle>Cash Threshold:</OptionsTitle>
            {!editingThreshold ? (
              <React.Fragment>
                <Number
                  value={parseFloat(settings.cash_email_threshold)}
                  currency={preferredCurrency && preferredCurrency.code}
                  decimalPlaces={2}
                />
                <Edit onClick={() => setEditingThreshold(true)}>
                  <FontAwesomeIcon icon={faPen} />
                  Edit
                </Edit>
              </React.Fragment>
            ) : (
              <React.Fragment>
                $
                <NumericTextInput
                  value={cashThreshold}
                  onChange={(e) => setCashThreshold(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      finishEditingThreshold();
                    }
                  }}
                />{' '}
                <SmallButton onClick={finishEditingThreshold}>Done</SmallButton>
              </React.Fragment>
            )}
          </SubSetting>
          <SubSetting>
            <OptionsTitle>Apply Cash Threshold to Summary Emails:</OptionsTitle>
            {settings.apply_cash_email_threshold_to_summary_email ? (
              <ToggleButton onClick={updateSummaryThresholdNotification}>
                <React.Fragment>
                  <FontAwesomeIcon icon={faToggleOn} />
                  <StateText>on</StateText>
                </React.Fragment>
              </ToggleButton>
            ) : (
              <ToggleButton onClick={updateSummaryThresholdNotification}>
                <React.Fragment>
                  <FontAwesomeIcon icon={faToggleOff} />
                  <StateText>off</StateText>
                </React.Fragment>
              </ToggleButton>
            )}
          </SubSetting>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ToggleButton onClick={updateNotification}>
            <FontAwesomeIcon icon={faToggleOff} />
            <StateText>off</StateText>
          </ToggleButton>
        </React.Fragment>
      )}
      <DisabledBox>
        Receive an email notification when new cash or dividends arrive in your
        account.
      </DisabledBox>
    </React.Fragment>
  );

  return contents;
};

export default CashNotificationSettings;
