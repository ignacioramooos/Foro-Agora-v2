import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "@/pages/AdminPage";

const mocks = vi.hoisted(() => ({
  deleteRegistrationEq: vi.fn(),
  toast: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isLoggedIn: true,
    loading: false,
    logout: vi.fn(),
  }),
}));

vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => ({ isAdmin: true, loading: false }),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: mocks.toast,
}));

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

const registration = {
  id: "registration-1",
  class_id: "july-22",
  name: "Ana Pérez",
  age: 17,
  school: "Liceo 1",
  department: "Montevideo",
  email: "ana@example.com",
  phone: "099123456",
  cedula: "12345672",
  user_id: "user-1",
  hear_about: "Instagram",
  why: "Aprender",
  created_at: "2026-07-15T15:00:00.000Z",
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "content_items") {
        return {
          select: () => ({ order: vi.fn().mockResolvedValue({ data: [] }) }),
        };
      }

      if (table === "class_sessions") {
        return {
          select: () => ({ order: vi.fn().mockResolvedValue({ data: [classSession] }) }),
        };
      }

      return {
        select: () => ({ order: vi.fn().mockResolvedValue({ data: [registration] }) }),
        delete: () => ({ eq: mocks.deleteRegistrationEq }),
      };
    },
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("eliminación de asistentes desde administración", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deleteRegistrationEq.mockResolvedValue({ error: null });
  });

  it("confirma la acción, elimina solo la inscripción y actualiza la lista", async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("1 / 90 inscriptos")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Eliminar la inscripción de Ana Pérez" }));

    expect(screen.getByRole("heading", { name: "¿Eliminar esta inscripción?" })).toBeInTheDocument();
    expect(screen.getByText(/Su cuenta no se eliminará/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar inscripción" }));

    await waitFor(() => expect(mocks.deleteRegistrationEq).toHaveBeenCalledWith("id", "registration-1"));
    await waitFor(() => expect(screen.queryByText("Ana Pérez")).not.toBeInTheDocument());
    expect(screen.getByText("0 / 90 inscriptos")).toBeInTheDocument();
    expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ title: "Inscripción eliminada" }));
  });
});
