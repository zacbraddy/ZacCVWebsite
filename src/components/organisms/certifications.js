import React from 'react';

import TimelineItem from './timeline-item';

const Certifications = () => (
  <div className="overflow-hidden">
    <TimelineItem
      startDate="2003"
      endDate="2007"
      companyName="La Trobe University"
    >
      Bachelor of Business(Accounting)/Bachelor of Computing(Software
      Engineering)
    </TimelineItem>
    <TimelineItem startDate="2015" companyName="MonogoDB">
      MongoDB for .NET Developers
    </TimelineItem>
    <TimelineItem startDate="2016" endDate="2018" companyName="Microsoft">
      MSCD: Web Applications
    </TimelineItem>
    <TimelineItem startDate="2016" endDate="2018" companyName="Microsoft">
      MCSP: Microsoft Certified Professional
    </TimelineItem>
    <TimelineItem startDate="2016" endDate="2018" companyName="Microsoft">
      Developing Microsoft Azure Web Services
    </TimelineItem>
    <TimelineItem startDate="2016" endDate="2018" companyName="Microsoft">
      MS: Developing ASP.NET MVC Applications
    </TimelineItem>
    <TimelineItem startDate="2016" endDate="2018" companyName="Microsoft">
      MS: Programming in C#
    </TimelineItem>
  </div>
);
export default Certifications;
