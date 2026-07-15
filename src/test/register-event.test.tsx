import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RegisterPage from "@/pages/RegisterPage";
import { useAuth } from "@/contexts/AuthContext";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  profileMaybeSingle: vi.fn(),
  registrationMaybeSingle: vi.fn(),
  classOrder: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({ updateProfile: mocks.updateProfile }),
}));

vi.mock("@/components/SectionFade", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({ maybeSingle: mocks.profileMaybeSingle }),
          }),
        };
      }

      if (table === "class_sessions") {
        return {
          select: () => ({
            eq: () => ({
              gte: () => ({ order: mocks.classOrder }),
            }),
          }),
        };
      }

      return {
        select: () => ({
          eq: () => ({
            eq: () => ({ maybeSingle: mocks.registrationMaybeSingle }),
          }),
        }),
        insert: mocks.insert,
      };
    },
  },
}));

const mockedUseAuth = vi.mocked(useAuth);

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

describe("registro autenticado al encuentro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      loading: false,
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
    } as ReturnType<typeof useAuth>);
    mocks.profileMaybeSingle.mockResolvedValue({
      data: {
        full_name: "Ana Pérez",
        age: 17,
        department: "Montevideo",
        institution: "Liceo 1",
        how_found_us: "Instagram",
      },
    });
    mocks.classOrder.mockResolvedValue({ data: [classSession], error: null });
    mocks.registrationMaybeSingle.mockResolvedValue({ data: null });
    mocks.insert.mockResolvedValue({ error: null });
  });

  it("exige una cédula válida y guarda el identificador autenticado normalizado", async () => {
    render(
      <MemoryRouter initialEntries={["/registro?class=july-22"]}>
        <Routes>
          <Route path="/registro" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByDisplayValue("Liceo 1");
    await waitFor(() => expect(screen.getByRole("button", { name: "Inscribirme" })).toBeEnabled());

    const cedula = screen.getByPlaceholderText("Ej: 4.567.890-1");
    fireEvent.change(cedula, { target: { value: "1.234.567-3" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Inscribirme" }));

    expect(await screen.findByText("Ingresá una cédula uruguaya válida")).toBeInTheDocument();
    expect(mocks.insert).not.toHaveBeenCalled();

    fireEvent.change(cedula, { target: { value: "1.234.567-2" } });
    fireEvent.click(screen.getByRole("button", { name: "Inscribirme" }));

    await waitFor(() => expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      class_id: "july-22",
      user_id: "user-1",
      cedula: "12345672",
      email: "ana@example.com",
      consent: true,
    })));
    expect(await screen.findByRole("heading", { name: "Inscripción recibida" })).toBeInTheDocument();
    expect(screen.getByText("Sala audiovisual de Casa INJU")).toBeInTheDocument();
  });
});
