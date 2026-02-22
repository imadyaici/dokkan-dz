import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductElement } from '../ProductElement';

const mockUseCurrentLang = vi.fn();
vi.mock('@/hooks/useCurrentLang', () => ({
  useCurrentLang: () => mockUseCurrentLang(),
}));

const mockProduct = {
  _id: '1',
  name: { fr: 'Mon Produit', ar: 'منتجي' },
  price: 1500,
  slug: 'mon-produit',
  images: [
    {
      asset: {
        url: 'http://example.com/image.jpg',
      },
    },
  ],
} as any;

describe('ProductElement', () => {
  it('renders product in French correctly', () => {
    mockUseCurrentLang.mockReturnValue('fr');
    render(<ProductElement product={mockProduct} loading="eager" />);

    expect(screen.getByText('Mon Produit')).toBeInTheDocument();
    // formatMoney(1500, 'fr') should produce something containing '1', '500' and 'DA'
    const price = screen.getByTestId('ProductElement_PriceRange');
    expect(price.textContent).toContain('1');
    expect(price.textContent).toContain('500');
    expect(price.textContent).toContain('DA');
  });

  it('renders product in Arabic correctly', () => {
    mockUseCurrentLang.mockReturnValue('ar');
    render(<ProductElement product={mockProduct} loading="eager" />);

    expect(screen.getByText('منتجي')).toBeInTheDocument();
    const price = screen.getByTestId('ProductElement_PriceRange');
    expect(price.textContent).toContain('د.ج.');
  });

  it('renders nothing if product is missing', () => {
    const { container } = render(<ProductElement product={null as any} loading="eager" />);
    expect(container.firstChild).toBeNull();
  });
});
