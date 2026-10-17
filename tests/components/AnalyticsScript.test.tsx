import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AnalyticsScript from '@/components/AnalyticsScript';

vi.mock('next/script', () => ({
  default: ({ id, src, strategy }: { id: string; src: string; strategy: string }) => (
    <div data-async="true" data-src={src} data-strategy={strategy} data-testid={id} />
  ),
}));

describe('AnalyticsScript', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('loads analytics lazily after the first user interaction', () => {
    render(<AnalyticsScript />);

    expect(screen.queryByTestId('analytics-script')).not.toBeInTheDocument();

    fireEvent.pointerDown(window);

    expect(screen.getByTestId('analytics-script')).toHaveAttribute('data-strategy', 'lazyOnload');
    expect(screen.getByTestId('analytics-script')).toHaveAttribute('data-async', 'true');
    expect(screen.getByTestId('analytics-script')).toHaveAttribute(
      'data-src',
      'https://www.google-analytics.com/analytics.js'
    );
  });

  it('also starts analytics after keyboard interaction', () => {
    render(<AnalyticsScript />);

    fireEvent.keyDown(window, { key: 'Tab' });

    expect(screen.getByTestId('analytics-script')).toHaveAttribute('data-strategy', 'lazyOnload');
  });

  it('does not load analytics when tracking is disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', 'false');

    render(<AnalyticsScript />);
    fireEvent.pointerDown(window);

    expect(screen.queryByTestId('analytics-script')).not.toBeInTheDocument();
  });
});
