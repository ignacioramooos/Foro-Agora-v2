import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "@/components/Navbar";
import EventsPage from "@/pages/EventsPage";

const mocks = vi.hoisted(() => ({
  classOrder: vi.fn(),
  registrationEq: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isLoggedIn: true,
    user: { name: "Ana Pérez" },
    session: { user: { id: "user-1" } },
    logout: vi.fn(),
  }),
}));

vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("@/components/EventSignupButton", () => ({
  default: ({ label }: { label: string }) => <button type="button">{label}</button>,
}));

const activeClass = {
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

const inactiveClass = {
  ...activeClass,
  id: "june-14",
  title: "Encuentro de junio",
  class_date: "2026-06-14T17:00:00.000Z",
  end_date: "2026-06-14T19:00:00.000Z",
  is_active: false,
  is_featured: false,
};

vi.mock("@/integrations/supabase/client", () => {
  const channel = {
    on: () => channel,
    subscribe: () => channel,
  };

  return {
    supabase: {
      from: (table: string) => {
        if (table === "class_sessions") {
          return {
            select: () => ({
              order: (...args: unknown[]) => {
                mocks.classOrder(...args);
                return Promise.resolve({ data: [inactiveClass, activeClass] });
              },
            }),
          };
        }

        return {
          select: () => ({
            eq: (...args: unknown[]) => {
              mocks.registrationEq(...args);
              return Promise.resolve({ data: [{ class_id: "july-22" }] });
            },
          }),
        };
      },
      channel: () => channel,
      removeChannel: vi.fn(),
    },
  };
});

describe("página pública de eventos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds Eventos between Sobre nosotros and Clases in the public navigation", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const publicLinks = screen.getAllByRole("link");
    const aboutIndex = publicLinks.findIndex((link) => link.textContent === "Sobre nosotros");
    const eventsIndex = publicLinks.findIndex((link) => link.textContent === "Eventos");
    const classesIndex = publicLinks.findIndex((link) => link.textContent === "Clases");

    expect(eventsIndex).toBeGreaterThan(aboutIndex);
    expect(eventsIndex).toBeLessThan(classesIndex);
    expect(publicLinks[eventsIndex]).toHaveAttribute("href", "/eventos");
  });

  it("shows active events and confirms when the user is already registered", async () => {
    render(<EventsPage />);

    expect(await screen.findByRole("heading", { name: "Primer encuentro de Foro Agora" })).toBeInTheDocument();
    expect(mocks.classOrder).toHaveBeenCalledWith("class_date", { ascending: false });
    expect(mocks.registrationEq).toHaveBeenCalledWith("user_id", "user-1");
    expect(screen.getByText("Ya estás inscripto")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Inscribirme a este evento" })).not.toBeInTheDocument();
    expect(screen.getByText("Av. 18 de Julio 1865, 11200 Montevideo, Departamento de Montevideo")).toBeInTheDocument();
    expect(screen.getByTitle("Mapa de Instituto Nacional de la Juventud - INJU")).toHaveAttribute(
      "src",
      expect.stringContaining("output=embed")
    );
    expect(screen.getByRole("link", { name: /Abrir Instituto Nacional de la Juventud - INJU en Google Maps/i })).toHaveAttribute(
      "href",
      expect.stringContaining("google.com/maps/search")
    );
  });

  it("shows inactive events in grey as non-clickable past events with their date", async () => {
    render(<EventsPage />);

    const pastEvent = await screen.findByLabelText("Encuentro de junio, evento pasado");
    expect(pastEvent).toHaveClass("grayscale");
    expect(screen.getByText("Evento pasado")).toBeInTheDocument();
    expect(screen.getByText("Este evento ya pasó — domingo, 14 de junio de 2026.")).toBeInTheDocument();
    expect(within(pastEvent).queryByRole("button")).not.toBeInTheDocument();
    expect(within(pastEvent).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getAllByTitle("Mapa de Instituto Nacional de la Juventud - INJU")).toHaveLength(1);
  });
});
