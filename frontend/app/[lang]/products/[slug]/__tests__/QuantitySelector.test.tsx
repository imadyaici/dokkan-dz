import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuantitySelector } from '../QuantitySelector';

// Mock fpixel to avoid errors during testing
vi.mock('@/utils/fpixel', () => ({
  event: vi.fn(),
}));

// Mock useCurrentLang
vi.mock('@/hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'fr',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

const mockProduct = {
  _id: '1',
  name: { fr: 'Product 1' },
  price: 1500,
} as any;

const mockTranslations = {
  addToCart: 'Ajouter au panier',
  orderNow: 'Commander maintenant',
  payOnDelivery: 'Payer à la livraison',
  orderForm: {},
  messages: {
    loading: 'Chargement...',
    selectWilayaFirst: "Sélectionnez une wilaya d'abord",
  },
  trust: {
    cod: 'Paiement à la livraison',
    fastShipping: 'Livraison rapide',
    returns: '7 jours de retour',
  },
};

describe('QuantitySelector', () => {
  it('renders initial quantity of 1', () => {
    render(<QuantitySelector product={mockProduct} translations={mockTranslations} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments quantity when + is clicked', () => {
    render(<QuantitySelector product={mockProduct} translations={mockTranslations} />);
    const incrementButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements quantity when - is clicked', () => {
    render(<QuantitySelector product={mockProduct} translations={mockTranslations} />);
    const incrementButton = screen.getByLabelText('Increase quantity');
    const decrementButton = screen.getByLabelText('Decrease quantity');

    // Increment to 2 first
    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    // Then decrement back to 1
    fireEvent.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not decrement below 1', () => {
    render(<QuantitySelector product={mockProduct} translations={mockTranslations} />);
    const decrementButton = screen.getByLabelText('Decrease quantity');

    fireEvent.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('opens order form modal when "Commander maintenant" is clicked', () => {
    render(<QuantitySelector product={mockProduct} translations={mockTranslations} />);
    const orderButtons = screen.getAllByText('Commander maintenant');

    // Click the first button (there's one for desktop and one sticky for mobile)
    const firstButton = orderButtons[0];
    if (firstButton) {
      fireEvent.click(firstButton);
    }

    // The modal is rendered via Headless UI Dialog
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
