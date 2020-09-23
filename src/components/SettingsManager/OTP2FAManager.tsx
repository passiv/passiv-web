import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faClipboard,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  selectIsDemo,
  selectOTP2FAEnabled,
  selectOTP2FAFeature,
} from '../../selectors';
import { Edit, OptionsTitle, P } from '../../styled/GlobalElements';
import { Button } from '../../styled/Button';
import { InputTarget } from '../../styled/Form';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { loadSettings } from '../../actions';
import { postData, deleteData } from '../../api';
import styled from '@emotion/styled';

import {
  MiniInputNonFormik,
  Active2FABadge,
  Disabled2FABadge,
  ErrorMessage,
  ChoiceBox,
} from '../../styled/TwoFAManager';

const SecretBox = styled.div`
  padding-top: 20px;
  width: 100%;
  display: flex;
`;

const InputBox = styled.div`
  flex-grow: 1;
`;

const IconBox = styled.div`
  width: 20px;
  padding-top: 5px;
  margin-right: 20px;
  margin-left: 10px;
`;

const ReadOnlyInput = styled(InputTarget)`
  padding: 18px 15px 18px 15px;
  width: 100%;
  text-align: center;
  font-size: 12px;
`;

const IconButton = styled.button`
  font-size: 1.3em;
`;

const OTP2FAManager = () => {
  const isDemo = useSelector(selectIsDemo);
  const OTP2FAFeatureEnabled = useSelector(selectOTP2FAFeature);
  const is2FAEnabled = useSelector(selectOTP2FAEnabled);
  const dispatch = useDispatch();

  const [verificationCode, setVerificationCode] = useState('');
  const [secret2FA, setSecret2FA] = useState();
  const [editing2FA, setEditing2FA] = useState(false);
  const [confirming2FA, setConfirming2FA] = useState(false);
  const [error2FA, setError2FA] = useState();
  const [loading2FA, setLoading2FA] = useState(false);
  const [copied, setCopied] = useState(false);

  // const startEditing2FA = () => {
  //   setEditing2FA(true);
  //
  //   setError2FA(null);
  // };

  const cancelEditing2FA = () => {
    setEditing2FA(false);
    setConfirming2FA(false);
    setVerificationCode('');
    setError2FA(null);
    setLoading2FA(false);
  };

  const initOTPAuth = () => {
    setEditing2FA(true);
    setVerificationCode('');
    setLoading2FA(true);
    setError2FA(null);
    postData('/api/v1/auth/otp/', {})
      .then(response => {
        setConfirming2FA(true);
        setLoading2FA(false);
        setSecret2FA(response.data.mfa_required.secret);
      })
      .catch(error => {
        setError2FA(error.response && error.response.data.detail);
        setLoading2FA(false);
      });
  };

  console.log('secret2FA', secret2FA);

  const submitCode = () => {
    setLoading2FA(true);
    setError2FA(null);
    postData('/api/v1/auth/otpVerify/', {
      token: verificationCode,
    })
      .then(() => {
        dispatch(loadSettings());
        cancelEditing2FA();
      })
      .catch(error => {
        setError2FA(error.response.data.detail);
        setLoading2FA(false);
      });
  };

  const disable2FA = () => {
    setLoading2FA(true);
    deleteData('/api/v1/auth/otp/')
      .then(() => {
        setLoading2FA(false);
        dispatch(loadSettings());
      })
      .catch(error => {
        setError2FA(error.response.data.detail);
        setLoading2FA(false);
      });
  };

  let error2FAMessage = null;
  if (error2FA != null) {
    error2FAMessage = <ErrorMessage>{error2FA}</ErrorMessage>;
  }

  let opt_2fa = null;

  //
  // let sms_2fa = null;
  if (is2FAEnabled) {
    opt_2fa = (
      <React.Fragment>
        <Active2FABadge>Active</Active2FABadge>
        <Edit onClick={() => !isDemo && disable2FA()} disabled={isDemo}>
          {loading2FA ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Disable'}
        </Edit>
        {error2FAMessage}
      </React.Fragment>
    );
  } else {
    if (editing2FA === false) {
      opt_2fa = (
        <React.Fragment>
          <Disabled2FABadge>Not Enabled</Disabled2FABadge>
          <Edit
            onClick={() => !isDemo && initOTPAuth()}
            disabled={isDemo || loading2FA}
          >
            Enable
          </Edit>
        </React.Fragment>
      );
    } else {
      if (!confirming2FA) {
        opt_2fa = (
          <React.Fragment>
            <P>
              Activating this option will require you to enter a 6-digit code
              each time you login. If you lose access to your authenticator, you
              will be unable to login in the future.
            </P>
            {error2FA}
            <Edit
              onClick={() => !isDemo && cancelEditing2FA()}
              disabled={isDemo}
            >
              Cancel
            </Edit>
          </React.Fragment>
        );
      } else {
        opt_2fa = (
          <React.Fragment>
            <P>Copy the following code into your authenticator app:</P>
            <SecretBox>
              <InputBox>
                <ReadOnlyInput value={secret2FA} readOnly={true} />
              </InputBox>
              <IconBox>
                <CopyToClipboard
                  text={secret2FA}
                  onCopy={() => {
                    setCopied(true);
                  }}
                >
                  {copied ? (
                    <IconButton>
                      <FontAwesomeIcon icon={faClipboardCheck} />
                    </IconButton>
                  ) : (
                    <IconButton>
                      <FontAwesomeIcon icon={faClipboard} />
                    </IconButton>
                  )}
                </CopyToClipboard>
              </IconBox>
            </SecretBox>
            <P>
              Now enter the 6-digit code provided by your authenticator app to
              finalize the activation of 2FA on your account.
            </P>
            <MiniInputNonFormik
              value={verificationCode}
              placeholder={'Your verification code'}
              onChange={e => setVerificationCode(e.target.value)}
            />
            {error2FA}
            <Edit
              onClick={() => !isDemo && cancelEditing2FA()}
              disabled={isDemo}
            >
              Cancel
            </Edit>
            <Button onClick={submitCode}>
              {loading2FA ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                'Verify'
              )}
            </Button>
          </React.Fragment>
        );
      }
    }
  }

  return (
    <ChoiceBox>
      {OTP2FAFeatureEnabled && (
        <React.Fragment>
          <OptionsTitle>Authenticator App:</OptionsTitle> {opt_2fa}
        </React.Fragment>
      )}
    </ChoiceBox>
  );
};

export default OTP2FAManager;
