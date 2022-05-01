import React from 'react';
import SpiderChart from './SpiderChart';

export default {
    title: 'Example/SpiderChart',
    component: SpiderChart,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
      backgroundColor: { control: 'color' },
    },
  };
  const argument = {
     data :[{'Communication':8,'Technical Knowledge':5,'Team Player':7,'Problem Solving':6,'Passion':5,'Politeness':1}],
     showTooltipLabel:true,
     showTooltipMeta:true
  }
  const Template = (args) => <SpiderChart {...argument} />;

export const Small = Template.bind({});
