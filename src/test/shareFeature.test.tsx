import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductDetail from '../pages/ProductDetail';
import * as appwrite from '../lib/appwrite';
import { FavoritesProvider } from '../context/FavoritesContext';
import { HelmetProvider } from 'react-helmet-async';

// Mock getProductById
const mockProduct = {
  $id: '123',
  name: 'Elegant Lehenga',
  description: 'Handcrafted luxury lehenga',
  category: 'Bridal',
  image_url: 'https://example.com/lehenga.jpg',
  price: '75000',
  is_exclusive: true,
  exclusive_badge: 'Exclusive Design',
  created_at: new Date().toISOString(),
};

vi.spyOn(appwrite, 'getProductById').mockResolvedValue(mockProduct);

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

// Mock navigator share & clipboard
const mockShare = vi.fn().mockResolvedValue(undefined);
const mockWriteText = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, 'share', {
  value: mockShare,
  writable: true,
  configurable: true
});

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
  configurable: true
});

// Setup Tanstack Query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('Share with Family Feature', () => {
  beforeEach(() => {
    mockOpen.mockClear();
    mockShare.mockClear();
    mockWriteText.mockClear();
    localStorage.clear();
  });

  const renderComponent = () => {
    const queryClient = createTestQueryClient();
    return render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            <MemoryRouter initialEntries={['/product/123']}>
              <Routes>
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
            </MemoryRouter>
          </FavoritesProvider>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };

  it('renders Share Design buttons on the page after loading product', async () => {
    renderComponent();
    
    // Wait for product load
    await waitFor(() => {
      expect(screen.getByText('Elegant Lehenga')).toBeInTheDocument();
    });

    // Check both desktop and mobile Share buttons
    const shareBtns = screen.getAllByRole('button', { name: /Share Design/i });
    expect(shareBtns).toHaveLength(2);
  });

  it('opens Share Modal when clicking Share Design button', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Elegant Lehenga')).toBeInTheDocument();
    });

    const shareBtn = screen.getAllByRole('button', { name: /Share Design/i })[0];
    fireEvent.click(shareBtn);

    // Dialog title should appear
    expect(screen.getByRole('heading', { name: /Share With Family/i })).toBeInTheDocument();
    expect(screen.getByText(/Involve your loved ones in designing/i)).toBeInTheDocument();

    // Verification of sharing channels
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('System Share')).toBeInTheDocument();
    expect(screen.getByText('Copy Link')).toBeInTheDocument();
  });

  it('handles WhatsApp share option correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Elegant Lehenga')).toBeInTheDocument();
    });

    const shareBtn = screen.getAllByRole('button', { name: /Share Design/i })[0];
    fireEvent.click(shareBtn);

    const whatsappBtn = screen.getByRole('button', { name: /WhatsApp/i });
    fireEvent.click(whatsappBtn);

    // Verify window.open was triggered with Yaga Design sharing message
    expect(mockOpen).toHaveBeenCalled();
    const shareUrl = mockOpen.mock.calls[0][0];
    expect(shareUrl).toContain('api.whatsapp.com/send');
    expect(shareUrl).toContain('text=');
    
    // Verify analytics logged WhatsApp share
    const analyticsRaw = localStorage.getItem('yaga_share_analytics');
    expect(analyticsRaw).not.toBeNull();
    const analytics = JSON.parse(analyticsRaw!);
    expect(analytics.totalShares).toBe(1);
    expect(analytics.whatsappShares).toBe(1);
    expect(analytics.shareDetails[0].type).toBe('whatsapp');
  });

  it('handles Copy Link option correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Elegant Lehenga')).toBeInTheDocument();
    });

    const shareBtn = screen.getAllByRole('button', { name: /Share Design/i })[0];
    fireEvent.click(shareBtn);

    const copyBtn = screen.getByRole('button', { name: /Copy Link/i });
    fireEvent.click(copyBtn);

    // Verify copy to clipboard was triggered
    expect(mockWriteText).toHaveBeenCalled();

    // Verify analytics logged Copy Link share
    const analyticsRaw = localStorage.getItem('yaga_share_analytics');
    expect(analyticsRaw).not.toBeNull();
    const analytics = JSON.parse(analyticsRaw!);
    expect(analytics.totalShares).toBe(1);
    expect(analytics.linkCopies).toBe(1);
    expect(analytics.shareDetails[0].type).toBe('copy');
  });
});
