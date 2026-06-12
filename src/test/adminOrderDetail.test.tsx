import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminOrderDetail from '../pages/admin/AdminOrderDetail';
import * as appwrite from '../lib/appwrite';
import { HelmetProvider } from 'react-helmet-async';

// Mock getOrderById
const mockOrder: appwrite.Order = {
  $id: 'order-123',
  order_id: 'YAGA-9999',
  customer_name: 'Ananya Sharma',
  phone_number: '+919876543210',
  email: 'ananya@example.com',
  wedding_date: '2026-12-15',
  product_id: 'gown-456',
  product_name: 'Bespoke Velvet Lehenga',
  product_image: 'image-id',
  selected_color: 'Crimson Red',
  selected_size: 'Custom M',
  quantity: 1,
  customization_notes: 'Please add extra heavy zardozi border work',
  status: 'New',
  created_at: new Date().toISOString(),
};

const getOrderByIdSpy = vi.spyOn(appwrite, 'getOrderById').mockResolvedValue(mockOrder);
const updateOrderStatusSpy = vi.spyOn(appwrite, 'updateOrderStatus').mockResolvedValue({
  ...mockOrder,
  status: 'Contacted',
});
const deleteOrderSpy = vi.spyOn(appwrite, 'deleteOrder').mockResolvedValue(undefined);

// Mock window.open
const mockOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockOpen, writable: true });

// Mock navigator share & clipboard
const mockWriteText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
  configurable: true
});

// Setup Query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AdminOrderDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = createTestQueryClient();
    return render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/admin/orders/order-123']}>
            <Routes>
              <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );
  };

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText(/Loading Order Details.../i)).toBeInTheDocument();
  });

  it('renders order details once fetched', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();
    });

    expect(screen.getByText(/YAGA-9999/)).toBeInTheDocument();
    expect(screen.getByText('Bespoke Velvet Lehenga')).toBeInTheDocument();
    expect(screen.getByText('+919876543210')).toBeInTheDocument();
    expect(screen.getByText('ananya@example.com')).toBeInTheDocument();
    expect(screen.getByText('2026-12-15')).toBeInTheDocument();
    expect(screen.getByText('Crimson Red')).toBeInTheDocument();
    expect(screen.getByText('Custom M')).toBeInTheDocument();
    expect(screen.getByText('Please add extra heavy zardozi border work')).toBeInTheDocument();
  });

  it('handles status updates correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();
    });

    const contactedBtn = screen.getByRole('button', { name: 'Contacted' });
    fireEvent.click(contactedBtn);

    await waitFor(() => {
      expect(updateOrderStatusSpy).toHaveBeenCalledWith('order-123', 'Contacted');
    });
  });

  it('handles external contact shortcuts correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();
    });

    const callBtn = screen.getByRole('button', { name: /Call Client/i });
    fireEvent.click(callBtn);
    expect(mockOpen).toHaveBeenCalledWith('tel:+919876543210');

    const whatsappBtn = screen.getByRole('button', { name: /WhatsApp Direct/i });
    fireEvent.click(whatsappBtn);
    expect(mockOpen).toHaveBeenCalledWith(expect.stringContaining('wa.me/919876543210'), '_blank');

    const copyBtn = screen.getByRole('button', { name: /Copy Number/i });
    fireEvent.click(copyBtn);
    expect(mockWriteText).toHaveBeenCalledWith('+919876543210');
  });

  it('handles order deletion flow with confirmation', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ananya Sharma')).toBeInTheDocument();
    });

    // Danger zone delete button
    const deleteBtn = screen.getByRole('button', { name: /Delete Record/i });
    fireEvent.click(deleteBtn);

    // Confirmation text should show up
    expect(screen.getByText(/This action will permanently delete/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Delete Permanently/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteOrderSpy).toHaveBeenCalledWith('order-123');
    });
  });
});
