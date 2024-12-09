import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

const OnboardingTour = ({ steps, pageName }) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`hasSeenTour_${pageName}`);
    if (!hasSeenTour) {
      setRun(true);
    }
  }, [pageName]);

  const handleTourCallback = (data) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem(`hasSeenTour_${pageName}`, 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleTourCallback}
      styles={{
        options: {
          primaryColor: 'rgb(88,28,135)',
          textColor: '#4a4a4a',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        buttonNext: {
          backgroundColor: 'rgb(88,28,135)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
        },
        buttonBack: {
          color: 'rgb(88,28,135)',
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#666666',
        },
        beacon: {
          inner: 'rgb(88,28,135)',
          outer: 'rgb(88,28,135)',
        },
      }}
    />
  );
};

export default OnboardingTour; 