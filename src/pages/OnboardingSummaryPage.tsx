import React from 'react';
import { Link } from 'react-router-dom';
import OnboardingProgress from '../components/OnboardingProgress';

const OnboardingSummaryPage = () => (
  <div>
    <h1>Summary</h1>
    <p>
      We have now setup your groups, imported your targets from your existing
      portfolio and set everything up. Let's take you to your dashboard now.
    </p>
    <OnboardingProgress step={5} />
    <Link to="/dashboard">Go to my dashboard</Link>
  </div>
);

export default OnboardingSummaryPage;
