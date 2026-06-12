import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BridalJourneyTimeline from '../components/BridalJourneyTimeline';

describe('BridalJourneyTimeline Component', () => {
  it('renders section title and subtitle correctly', () => {
    render(<BridalJourneyTimeline />);
    expect(screen.getByText('The Atelier Process')).toBeInTheDocument();
    
    // Find the heading by targeting its h2 tag
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Our Bridal');
    expect(heading.textContent).toContain('Journey');
    
    expect(screen.getByText(/From the initial design spark to the final handover/i)).toBeInTheDocument();
  });

  it('renders all four timeline steps with correct title and description', () => {
    render(<BridalJourneyTimeline />);

    const steps = [
      { title: 'Consultation', desc: 'We listen to your vision and every detail that makes your celebration singular.' },
      { title: 'Design', desc: 'Our atelier crafts a bespoke concept that reflects your unique story.' },
      { title: 'Refinement', desc: 'Meticulous fitting sessions ensure every thread falls exactly as intended.' },
      { title: 'Delivery', desc: 'Your creation arrives in our signature packaging, ready for your moment.' }
    ];

    steps.forEach((step) => {
      // Find step title
      const titleElements = screen.getAllByText(step.title);
      expect(titleElements.length).toBeGreaterThan(0);
      
      // Find step description
      const descElements = screen.getAllByText(step.desc);
      expect(descElements.length).toBeGreaterThan(0);
    });
  });

  it('contains layout tags representing desktop and mobile timelines', () => {
    const { container } = render(<BridalJourneyTimeline />);
    
    // Desktop layout container has 'hidden md:block'
    const desktopContainer = container.querySelector('.hidden.md\\:block');
    expect(desktopContainer).toBeInTheDocument();

    // Mobile layout container has 'block md:hidden'
    const mobileContainer = container.querySelector('.block.md\\:hidden');
    expect(mobileContainer).toBeInTheDocument();
  });
});
