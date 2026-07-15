import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventSignupButton from "@/components/EventSignupButton";
import { useAuth } from "@/contexts/AuthContext";
import { useClassRegistrationStatus } from "@/hooks/useClassRegistrationStatus";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useClassRegistrationStatus", () => ({
  useClassRegistrationStatus: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedRegistrationStatus = vi.mocked(useClassRegistrationStatus);

describe("EventSignupButton", () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
    mockedRegistrationStatus.mockReturnValue({ isRegistered: false, registrationChecked: true });
  });

  it("takes a logged-in user straight to the event form", () => {
    mockedUseAuth.mockReturnValue({ isLoggedIn: true } as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter>
        <EventSignupButton classId="july-22" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Inscribirme gratis/i })).toHaveAttribute(
      "href",
      "/registro?class=july-22"
    );
  });

  it("asks a visitor to create an account or log in and preserves the event", () => {
    mockedUseAuth.mockReturnValue({ isLoggedIn: false } as ReturnType<typeof useAuth>);

    render(
      <MemoryRouter>
        <EventSignupButton classId="july-22" />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Inscribirme gratis/i })).toHaveAttribute(
      "href",
      "/auth?mode=event&returnTo=%2Fregistro%3Fclass%3Djuly-22"
    );
  });

  it("replaces the signup link with a confirmation for a registered user", () => {
    mockedUseAuth.mockReturnValue({ isLoggedIn: true } as ReturnType<typeof useAuth>);
    mockedRegistrationStatus.mockReturnValue({ isRegistered: true, registrationChecked: true });

    render(
      <MemoryRouter>
        <EventSignupButton classId="july-22" label="Inscribirme al encuentro" />
      </MemoryRouter>
    );

    expect(screen.queryByRole("link", { name: /Inscribirme al encuentro/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ya estás inscripto/i })).toBeDisabled();
  });
});
