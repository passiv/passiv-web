import React from 'react';
import styled from '@emotion/styled';
import PerformanceChart from './PerformanceChart';
import { useSelector } from 'react-redux';
import { loadContributionTimeframe } from '../../actions';
import { selectContributionTimeframe } from '../../selectors/performance';
import { PastValue } from '../../types/performance';

type Props = {
  selectedTimeframe: string;
};

export const PerformanceContributionChart = (props: Props) => {
  let contributionData = useSelector(selectContributionTimeframe);

  const data = React.useMemo(
    () => [
      {
        label: 'Contributions',
        data: contributionData?.map(a => {
          let date = new Date(Date.parse(a.date));
          return [
            new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            a.value,
          ];
        }),
        color: 'red',
      },
    ],
    [contributionData],
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  return <PerformanceChart data={data} axes={axes} />;
};

export default PerformanceContributionChart;