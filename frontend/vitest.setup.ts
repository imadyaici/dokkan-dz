import '@testing-library/jest-dom';

// Mock ResizeObserver which is missing in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
