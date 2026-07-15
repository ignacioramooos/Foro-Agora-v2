import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LandingEventPopup } from "@/components/FeaturedEvent";
import { useClassRegistrationStatus } from "@/hooks/useClassRegistrationStatus";
import { useUpcomingClassSession } from "@/hooks/useUpcomingClassSession";

vi.mock("@/hooks/useClassRegistrationStatus", () => ({
  useClassRegistrationStatus: vi.fn(),
}));

vi.mock("@/hooks/useUpcomingClassSession", () => ({
  useUpcomingClassSession: vi.fn(),
}));

vi.mock("@/components/EventSignupButton", () => ({
  default: () => <button type="button">Inscribirme</button>,
}));

const mockedRegistrationStatus = vi.mocked(useClassRegistrationStatus);
const mockedUpcomingClass = vi.mocked(useUpcomingClassSession);

const classSession = {
  id: "july-22",
  title: "Primer encuentro de Foro Agora",
  module_number: 1,
  class_date: "2026-07-22T21:00:00.000Z",
  end_date: "2026-07-22T23:00:00.000Z",
  location: "Sala audiovisual de Casa INJU",
  max_capacity: 80,
  registration_limit: 90,
  is_active: true,
  is_featured: true,
  notes: null,
};

describe("LandingEventPopup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedUpcomingClass.mockReturnValue({ classSession, loading: false });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("stays hidden when the user is already registered", async () => {
    mockedRegistrationStatus.mockReturnValue({ isRegistered: true, registrationChecked: true });
    render(<LandingEventPopup />);

    await act(async () => vi.advanceTimersByTime(1_000));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens for a user who has not registered", async () => {
    mockedRegistrationStatus.mockReturnValue({ isRegistered: false, registrationChecked: true });
    render(<LandingEventPopup />);

    await act(async () => vi.advanceTimersByTime(1_000));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("80 lugares")).toBeInTheDocument();
  });
});
