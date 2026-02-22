import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { OrderFormModal } from '../OrderFormModal';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/hooks/useCurrentLang', () => ({
  useCurrentLang: () => 'fr',
}));

vi.mock('@/utils/fpixel', () => ({
  event: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockProduct = {
  _id: '1',
  name: { fr: 'Test Product' },
  price: 1500,
} as any;

const mockTranslations = {
  name: 'Nom complet',
  address: 'Adresse',
  phone: 'Téléphone',
  wilaya: 'Wilaya',
  commune: 'Commune',
  delivery: 'Mode de livraison',
  submit: 'Soumettre',
  submitting: 'Envoi...',
};

const mockMessages = {
  loading: 'Chargement...',
  selectWilayaFirst: "Sélectionnez une wilaya d'abord",
};

// Mock fetch
global.fetch = vi.fn();

describe('OrderFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_MAYSTRO_BASE_URL = 'https://api.test';
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/base/wilayas/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ code: 16, name_lt: 'Alger', name_ar: 'الجزائر' }]),
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  it('renders the modal with product information', async () => {
    render(
      <OrderFormModal
        onClose={vi.fn()}
        product={mockProduct}
        quantity={1}
        translations={mockTranslations}
        messages={mockMessages}
      />,
    );

    expect(screen.getByTestId('ProductName')).toHaveTextContent('Test Product');
    expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
  });

  it('shows validation error for invalid phone number', async () => {
    render(
      <OrderFormModal
        onClose={vi.fn()}
        product={mockProduct}
        quantity={1}
        translations={mockTranslations}
        messages={mockMessages}
      />,
    );

    const phoneInput = screen.getByLabelText('Téléphone');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.blur(phoneInput);

    const submitButton = screen.getByRole('button', { name: /Soumettre/i });
    fireEvent.click(submitButton);

    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/api/order'),
      expect.anything(),
    );
  });

  it('fetches wilayas on mount', async () => {
    render(
      <OrderFormModal
        onClose={vi.fn()}
        product={mockProduct}
        quantity={1}
        translations={mockTranslations}
        messages={mockMessages}
      />,
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/base/wilayas/'));
    });
  });
});
