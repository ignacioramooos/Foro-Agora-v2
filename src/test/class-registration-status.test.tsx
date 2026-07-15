import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/contexts/AuthContext";
import { useClassRegistrationStatus } from "@/hooks/useClassRegistrationStatus";

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({ maybeSingle: mocks.maybeSingle }),
        }),
      }),
    }),
  },
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("useClassRegistrationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      loading: false,
      session: { user: { id: "user-1" } },
    } as ReturnType<typeof useAuth>);
  });

  it("recognizes an existing registration for the signed-in user", async () => {
    mocks.maybeSingle.mockResolvedValue({ data: { id: "registration-1" }, error: null });

    const { result } = renderHook(() => useClassRegistrationStatus("class-1"));

    await waitFor(() => expect(result.current.registrationChecked).toBe(true));
    expect(result.current.isRegistered).toBe(true);
  });

  it("does not query registrations for a visitor", async () => {
    mockedUseAuth.mockReturnValue({ loading: false, session: null } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useClassRegistrationStatus("class-1"));

    await waitFor(() => expect(result.current.registrationChecked).toBe(true));
    expect(result.current.isRegistered).toBe(false);
    expect(mocks.maybeSingle).not.toHaveBeenCalled();
  });
});
