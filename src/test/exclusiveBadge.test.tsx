import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../lib/appwrite';

// Mock useFavorites hook
vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: () => false,
    toggleFavorite: () => {},
  }),
}));

const mockProduct: Product = {
  $id: '123',
  name: 'Exclusive Lehenga',
  description: 'A beautiful luxury lehenga',
  category: 'Bridal',
  image_url: 'https://example.com/image.jpg',
  price: '75000',
  is_exclusive: true,
  exclusive_badge: 'Limited Bridal Collection',
  created_at: new Date().toISOString(),
};

const mockRegularProduct: Product = {
  $id: '456',
  name: 'Regular Saree',
  description: 'An elegant silk saree',
  category: 'Reception',
  image_url: 'https://example.com/image2.jpg',
  price: '25000',
  is_exclusive: false,
  exclusive_badge: 'Exclusive Design',
  created_at: new Date().toISOString(),
};

describe('Exclusive Collection Badge System', () => {
  it('renders ProductCard with premium badge when product is exclusive', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    // Verify name and category
    expect(screen.getByText('Exclusive Lehenga')).toBeInTheDocument();
    expect(screen.getByText('Bridal')).toBeInTheDocument();

    // Verify exclusive badge and content
    const badgeElement = screen.getByText('Limited Bridal Collection');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement.className).toContain('font-heading');
    expect(badgeElement.className).toContain('text-[#D4AF37]');
  });

  it('renders ProductCard WITHOUT premium badge when product is not exclusive', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockRegularProduct} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Limited Bridal Collection')).not.toBeInTheDocument();
    expect(screen.queryByText('Exclusive Design')).not.toBeInTheDocument();
    expect(screen.getByText('Regular Saree')).toBeInTheDocument();
  });
});
