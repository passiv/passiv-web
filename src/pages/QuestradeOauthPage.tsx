import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { push, replace } from 'connected-react-router';
import { postData } from '../api';
import { reloadEverything } from '../actions';
import ShadowBox from '../styled/ShadowBox';
import { H1, H2, P, A } from '../styled/GlobalElements';
import { Button } from '../styled/Button';
import { Step } from '../styled/SignupSteps';
import { selectQueryTokens } from '../selectors/router';
import { selectBrokerages, selectMaintenanceBrokerages } from '../selectors';
import { selectIsPaid } from '../selectors/subscription';
import { selectQuestradeOfferFeature } from '../selectors/features';
import { Error } from '../types/groupInfo';
import styled from '@emotion/styled';
import { Brokerage as BrokerageType } from '../types/brokerage';
import { toast } from 'react-toastify';
import PreLoadLink from '../components/PreLoadLink';
import { HELP_PATH } from '../apps/Paths';

const H2Padded = styled(H2)`
  padding-bottom: 20px;
`;

const QuestradeOauthPage = () => {
  const [loading, setLoading] = useState(true);
  const [showUpgradeOffer, setShowUpgradeOffer] = useState(false);
  const [error, setError] = useState<Error>();
  const queryParams = useSelector(selectQueryTokens);
  const isPaid = useSelector(selectIsPaid);
  const questradeOfferFeatureActive = useSelector(selectQuestradeOfferFeature);
  const dispatch = useDispatch();
  const brokerages = useSelector(selectBrokerages);
  const maintenanceBrokerages = useSelector(selectMaintenanceBrokerages);

  useEffect(() => {
    const token = queryParams.code;

    if (token === null) {
      setLoading(false);
      setError({ code: '0000' });
    } else {
      postData('/api/v1/brokerages/authComplete/', { token: token })
        .then(() => {
          dispatch(reloadEverything());
          if (isPaid || !questradeOfferFeatureActive) {
            setTimeout(() => {
              dispatch(replace('/app/setup-groups'));
            }, 1000);
          } else {
            setLoading(false);
            setShowUpgradeOffer(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error.response.data);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkBrokerageMaintenance = (brokerage: BrokerageType) => {
    if (
      maintenanceBrokerages.find((b: BrokerageType) => b.id === brokerage.id)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const startConnection = () => {
    const brokerage =
      brokerages &&
      brokerages.find((brokerage) => brokerage.name === 'Questrade');
    if (brokerage) {
      if (checkBrokerageMaintenance(brokerage) === true) {
        toast.error(
          `${brokerage.name} is currently undergoing maintenance and cannot establish new connections at this time. Please try again later.`,
        );
      } else {
        postData(`/api/v1/brokerages/${brokerage.id}/authorize/`, {
          type: 'read',
        }).then((response) => {
          window.location = response.data.url;
        });
      }
    }
  };

  let errorDisplay = null;
  if (error) {
    switch (error.code) {
      case '1006':
        errorDisplay = (
          <P>This connection code is invalid, please try again.</P>
        );
        break;
      case '1007':
        errorDisplay = (
          <P>This connection code has expired, please try again.</P>
        );
        break;
      case '1017':
        errorDisplay = (
          <React.Fragment>
            <P>
              The brokerage account you tried to link is already connected with
              Passiv.
            </P>
            <P>
              If you are trying to add a new connection for another account,
              please make sure that you are logged out of Questrade's dashboard.{' '}
              <A
                href="https://my.questrade.com/clients/signout.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Logout Questrade
              </A>
            </P>
            <P>
              If you are trying to change your connection type (for example,
              switching from read-access to trade-access), check out our
              tutorial on{' '}
              <A
                href="https://passiv.com/help/tutorials/how-to-manage-your-brokerage-connections/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Managing your Brokerage Connections
              </A>
              .
            </P>
            <Button onClick={() => startConnection()}>Try Again</Button>
          </React.Fragment>
        );
        break;
      case '1023':
        errorDisplay = (
          <P>
            The brokerage account linked to this connection is different from
            the account you're trying to link. This is not allowed because it
            would leave existing portfolios without a functional connection.
            Instead, create a new connection and delete this one if desired.
          </P>
        );
        break;
      case '0000':
        errorDisplay = (
          <P>
            No access code was provided by Questrade. Did you approve the
            connection request?
          </P>
        );
        break;
      default:
        errorDisplay = (
          <React.Fragment>
            <P>
              We encountered an unexpected error while attempting to establish a
              connection. Please try again later or{' '}
              <PreLoadLink path={HELP_PATH}>contact support</PreLoadLink> if
              this persists.
            </P>
            <P>
              Note that in order for a connection to be established, you must
              make sure that your brokerage account is fully opened and funded.
              If your brokerage account is new or the initial funding has not
              been finalized by the brokerage, then you may not be able to link
              your account to Passiv until it is fully opened.
            </P>
          </React.Fragment>
        );
        break;
    }
  }

  return (
    <ShadowBox background="#04a287">
      <H1 color="white">SETUP</H1>
      {loading ? (
        <React.Fragment>
          <Step>
            Establishing connection to Questrade...{' '}
            <FontAwesomeIcon icon={faSpinner} spin />
          </Step>
        </React.Fragment>
      ) : showUpgradeOffer ? (
        <React.Fragment>
          <Step>Questrade connection established.</Step>
          <ShadowBox>
            <H2Padded>
              You're eligible for a <strong>free</strong> upgrade to Passiv
              Elite!
            </H2Padded>
            <P>
              <A
                href="https://www.questrade.com/self-directed-investing/tools/partners/passiv"
                target="_blank"
                rel="noopener noreferrer"
              >
                Questrade
              </A>{' '}
              offers Passiv Elite as a free tool for Questrade customers. It's
              available for free as long as you keep your Questrade account
              connected to Passiv.
            </P>
            <P>
              You’ll get access to all basic features plus the option to{' '}
              <A
                href="https://passiv.com/help/tutorials/how-to-use-one-click-trades/"
                target="_blank"
                rel="noopener noreferrer"
              >
                place orders through Passiv
              </A>{' '}
              in just one click.
            </P>
            <Button onClick={() => dispatch(push('/app/questrade-offer'))}>
              Upgrade Now
            </Button>
          </ShadowBox>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Step>Failed to establish connection :(</Step>
          <ShadowBox>
            {errorDisplay}
            <Button onClick={() => dispatch(push('/app/settings'))}>
              Go to Settings
            </Button>
          </ShadowBox>
        </React.Fragment>
      )}
    </ShadowBox>
  );
};

export default QuestradeOauthPage;
