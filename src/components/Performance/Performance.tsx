import React, { useState } from 'react';
import styled from '@emotion/styled';
import TotalHoldings from '../TotalHoldings';
import PerformanceRateOfReturn from './PerformanceRateOfReturn';
import PerformanceGroups from './PerformanceGroups';
import PerformanceContributions from './PerformanceContributions';
import { Timeframe } from './Timeframe';

const Header = styled.div`
  font-size: 20pt;
`;

// Below doesn't work right now
const AlignLeft = styled.div`
  text-align: left !important;
`;

export const PercentReturn = styled.span`
  padding: 10px;
  margin: 5px;
  color: white;
  font-weight: bold;
  &.positive {
    background-color: #04a287 !important;
  }
  &.negative {
    background-color: #ad4629 !important;
  }
`;

export const CashReturn = styled.span`
  padding: 10px;
  background-color: #ffffff !important;
  margin: 5px;
  color: #04a287;
  font-weight: bold;
  &.positive {
    color: #04a287;
  }
  &.negative {
    color: #ad4629;
  }
`;

const TimespanStyle = styled.span`
  padding: 5px;
  background-color: #cccccc !important;
  margin: 5px;
  color: black;
  font-weight: bold;
  font-size: 10pt;
  text-align: center;
  &.selected {
    background-color: #aaaaaa !important;
  }
`;

export const SubHeader = styled.div`
  font-size: 14pt;
`;

type Props = {
  timeframe: Timeframe;
  selectedTimeframe: Timeframe;
  setTimeframe: (newTimeFrame: Timeframe) => void;
};

export const TimespanSelector = (props: Props) => {
  let timeframeString: string = '1Y';
  if (props.timeframe === Timeframe.YearToDate) {
    timeframeString = 'YTD';
  } else if (props.timeframe === Timeframe.ThirtyDays) {
    timeframeString = '30D';
  }

  let selected = props.timeframe === props.selectedTimeframe;

  return (
    <TimespanStyle className={selected ? 'selected' : ''}>
      <button onClick={() => props.setTimeframe(props.timeframe)}>
        {timeframeString}
      </button>
    </TimespanStyle>
  );
};

export const Performance = () => {
  const [currentTimeframe, setTimeframe] = useState(Timeframe.OneYear);

  return (
    <React.Fragment>
      <Header>Performance:</Header> <br />
      <AlignLeft>
        <TotalHoldings />
      </AlignLeft>
      <SubHeader>
        Rate of Return
        <TimespanSelector
          timeframe={Timeframe.OneYear}
          selectedTimeframe={currentTimeframe}
          setTimeframe={(t: Timeframe) => setTimeframe(t)}
        />
        <TimespanSelector
          timeframe={Timeframe.YearToDate}
          selectedTimeframe={currentTimeframe}
          setTimeframe={(t: Timeframe) => setTimeframe(t)}
        />
        <TimespanSelector
          timeframe={Timeframe.ThirtyDays}
          selectedTimeframe={currentTimeframe}
          setTimeframe={(t: Timeframe) => setTimeframe(t)}
        />
      </SubHeader>
      <br /> <br />
      <PerformanceRateOfReturn selectedTimeframe={currentTimeframe} />
      <br />
      <PerformanceContributions selectedTimeframe={currentTimeframe} />
      <br />
      <br />
      <PerformanceGroups selectedTimeframe={currentTimeframe} />
    </React.Fragment>
  );
};

export default Performance;
