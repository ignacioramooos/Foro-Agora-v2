import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContentLibrary from "@/components/dashboard/ContentLibrary";
import DashboardHome from "@/components/dashboard/DashboardHome";
import { useClassRegistrationStatus } from "@/hooks/useClassRegistrationStatus";

vi.mock("@/hooks/useClassRegistrationStatus", () => ({
  useClassRegistrationStatus: vi.fn(),
}));

vi.mock("@/hooks/useUpcomingClassSession", () => ({
  useUpcomingClassSession: () => ({
    classSession: {
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
    },
    loading: false,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      name: "Ana Pérez",
      email: "ana@example.com",
      streak: 0,
      completedClasses: 0,
      totalClasses: 5,
      publishedTheses: 0,
      onboardingCompleted: true,
    },
    session: { user: { id: "user-1" } },
    loading: false,
  }),
}));

vi.mock("@/components/EventSignupButton", () => ({
  default: ({ label }: { label: string }) => <button type="button">{label}</button>,
}));

vi.mock("@/integrations/supabase/client", () => {
  const createQuery = () => {
    const query = {
      select: () => query,
      eq: () => query,
      in: () => query,
      gte: () => query,
      not: () => query,
      order: () => query,
      limit: () => query,
      then: (resolve: (value: { data: never[]; error: null }) => unknown) =>
        Promise.resolve({ data: [], error: null }).then(resolve),
    };
    return query;
  };

  const channel = {
    on: () => channel,
    subscribe: () => channel,
  };

  return {
    supabase: {
      from: () => createQuery(),
      channel: () => channel,
      removeChannel: vi.fn(),
    },
  };
});

const mockedRegistrationStatus = vi.mocked(useClassRegistrationStatus);

describe("banners de inscripción del dashboard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("no muestra banners de inscripción cuando el usuario ya está inscripto", async () => {
    mockedRegistrationStatus.mockReturnValue({ isRegistered: true, registrationChecked: true });

    const home = render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );
    expect(screen.queryByText("Registrarme al encuentro")).not.toBeInTheDocument();
    expect(screen.queryByText("Clases presenciales")).not.toBeInTheDocument();
    home.unmount();

    render(<ContentLibrary />);
    await screen.findByText("Aún no hay contenido disponible.");
    expect(screen.queryByText("Inscribirme")).not.toBeInTheDocument();
    expect(screen.queryByText("Próximo encuentro presencial")).not.toBeInTheDocument();
  });

  it("mantiene los banners para usuarios que todavía no se inscribieron", async () => {
    mockedRegistrationStatus.mockReturnValue({ isRegistered: false, registrationChecked: true });

    const home = render(
      <MemoryRouter>
        <DashboardHome />
      </MemoryRouter>
    );
    expect(screen.getByText("Registrarme al encuentro")).toBeInTheDocument();
    home.unmount();

    render(<ContentLibrary />);
    await screen.findByText("Aún no hay contenido disponible.");
    expect(screen.getByText("Próximo encuentro presencial")).toBeInTheDocument();
    expect(screen.getByText("Inscribirme")).toBeInTheDocument();
  });
});
