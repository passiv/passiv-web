import React from 'react';
import { CashReturn, SubHeader, toDollarString } from './Performance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCaretUp,
  faCaretDown,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectContributions } from '../../selectors/performance';
import { Contributions } from '../../types/performance';
import Tooltip from '../Tooltip';

type Props = {
  selectedTimeframe: string;
};

export const PerformanceContributions = (props: Props) => {
  const contributions: Contributions | undefined = useSelector(
    selectContributions,
  );
  const positive =
    contributions === undefined || !(contributions.contributions < 0);

  let contributionsString = 'loading...';
  if (contributions !== null && contributions !== undefined) {
    contributionsString = toDollarString(contributions.contributions);
  }

  if (contributionsString === 'loading...') {
    return (
      <div>
        <FontAwesomeIcon icon={faSpinner} spin />
        <br />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Tooltip label="Contributions made during selected timeframe">
        <div>
          <SubHeader>
            Net Contributions{' '}
            <FontAwesomeIcon icon={faQuestionCircle} style={{ fontSize: 12 }} />
          </SubHeader>

          <CashReturn className={positive ? 'positive' : 'negative'}>
            ${contributionsString}{' '}
            {positive ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </CashReturn>
        </div>
      </Tooltip>
    </React.Fragment>
  );
};

export default PerformanceContributions;
