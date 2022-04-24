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

  const Template = (args) => <SpiderChart {...args} />;

export const Small = Template.bind({});
