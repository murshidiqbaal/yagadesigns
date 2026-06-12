import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeddingDatePlanner from '../components/WeddingDatePlanner';

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockOpen });

describe('WeddingDatePlanner Component', () => {
  beforeEach(() => {
    mockOpen.mockClear();
    localStorage.clear();
  });

  it('renders initial prompt state when no date is selected', () => {
    render(<WeddingDatePlanner />);
    expect(screen.getByText('Plan Your Bridal Journey')).toBeInTheDocument();
    expect(screen.getByText('Build your timeline')).toBeInTheDocument();
    expect(screen.getByText(/Enter your wedding date on the left/i)).toBeInTheDocument();
    expect(screen.queryByText('Book Bridal Consultation')).not.toBeInTheDocument();
  });

  it('calculates and shows the timeline when a future date (15 December 2026) is selected', () => {
    render(<WeddingDatePlanner />);
    
    const input = document.querySelector('input[type="date"]');
    expect(input).toBeInTheDocument();

    // Select 15 December 2026
    fireEvent.change(input!, { target: { value: '2026-12-15' } });

    // Verify calculated dates on the UI
    expect(screen.getByText('Initial Consultation')).toBeInTheDocument();
    expect(screen.getByText('Before 15 August 2026')).toBeInTheDocument();

    expect(screen.getByText('Design Finalization')).toBeInTheDocument();
    expect(screen.getByText('Before 15 September 2026')).toBeInTheDocument();

    expect(screen.getByText('Bespoke Measurements')).toBeInTheDocument();
    expect(screen.getByText('Before 1 October 2026')).toBeInTheDocument();

    expect(screen.getByText('Artisan Stitching')).toBeInTheDocument();
    expect(screen.getByText('October-November 2026')).toBeInTheDocument();

    expect(screen.getByText('Final Trial & Handover')).toBeInTheDocument();
    expect(screen.getByText('8 December 2026')).toBeInTheDocument();

    // Book consultation CTA should be visible
    const ctaBtn = screen.getByText('Book Bridal Consultation');
    expect(ctaBtn).toBeInTheDocument();

    // Click CTA and verify WhatsApp redirection
    fireEvent.click(ctaBtn);
    expect(mockOpen).toHaveBeenCalled();
    const callUrl = mockOpen.mock.calls[0][0];
    expect(callUrl).toContain('wa.me');
    expect(callUrl).toContain('15%20December%202026'); // URL-encoded 15 December 2026
  });

  it('displays urgency warning when wedding date is less than 4 months away', () => {
    render(<WeddingDatePlanner />);
    const input = document.querySelector('input[type="date"]');
    
    // Set a date close to now (2 months in the future)
    const urgentDate = new Date();
    urgentDate.setMonth(urgentDate.getMonth() + 2);
    const dateStr = urgentDate.toISOString().split('T')[0];

    fireEvent.change(input!, { target: { value: dateStr } });

    // Expect to see the urgent mode banner
    expect(screen.getByText('Urgent Preparation Mode')).toBeInTheDocument();
    expect(screen.getByText(/Your wedding is less than 4 months away/i)).toBeInTheDocument();
  });
});
