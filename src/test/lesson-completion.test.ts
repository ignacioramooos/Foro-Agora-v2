import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("Lesson Completion Tracking", () => {
  const mockSupabaseFrom = supabase.from as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("markLessonComplete - New Lesson", () => {
    it("should insert a new lesson progress record when lesson not previously attempted", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-1";
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });
      const mockUpdate = vi.fn();
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            insert: mockInsert,
            update: mockUpdate,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        const response = await result.current.markLessonComplete(userId, lessonId);
        expect(response.success).toBe(true);
      });

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: userId,
        lesson_id: lessonId,
        completed_at: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
      });
    });

    it("should insert with ISO timestamp format", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-2";
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });
      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        await result.current.markLessonComplete(userId, lessonId);
      });

      const insertedData = mockInsert.mock.calls[0][0];
      // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(new Date(insertedData.completed_at).getTime()).not.toBeNaN();
    });
  });

  describe("markLessonComplete - Existing Lesson", () => {
    it("should update existing lesson progress when lesson already attempted", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-3";
      const existingId = "progress-123";

      const mockUpdate = vi
        .fn()
        .mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: { id: existingId }, error: null }),
          }),
        }),
      });

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        const response = await result.current.markLessonComplete(userId, lessonId);
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).toHaveBeenCalled();
      const updateChain = mockUpdate.mock.results[0].value;
      expect(updateChain.eq).toHaveBeenCalledWith("id", existingId);
    });
  });

  describe("markLessonComplete - Error Handling", () => {
    it("should return error when insert fails", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-4";
      const errorMessage = "Database error";

      const mockInsert = vi
        .fn()
        .mockReturnValue({
          then: vi.fn(),
        })
        .mockRejectedValue(new Error(errorMessage));

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        const response = await result.current.markLessonComplete(userId, lessonId);
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });
    });

    it("should handle missing user ID gracefully", async () => {
      const { result } = renderHook(() => useProfile());

      await act(async () => {
      await result.current.markLessonComplete("", "lesson-5");
        // Should attempt the call but may fail at database level
        // Implementation will determine exact behavior
      });
    });
  });

  describe("fetchLessonStats", () => {
    it("should fetch completed lesson count", async () => {
      const userId = "test-user-id";

      const mockCompletedQuery = vi
        .fn()
        .mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({
              data: [
                { completed_at: "2024-01-01T10:00:00Z" },
                { completed_at: "2024-01-02T10:00:00Z" },
                { completed_at: "2024-01-03T10:00:00Z" },
              ],
              count: 3,
              error: null,
            }),
          }),
        });

      const mockLessonsQuery = {
        select: vi.fn().mockResolvedValue({
          data: null,
          count: 5,
          error: null,
        }),
      };

      const mockCertificatesQuery = {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            count: 2,
            error: null,
          }),
        }),
      };

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockCompletedQuery,
          };
        } else if (table === "lessons") {
          return mockLessonsQuery;
        } else if (table === "certificates") {
          return mockCertificatesQuery;
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      let stats;
      await act(async () => {
        stats = await result.current.fetchLessonStats(userId);
      });

      expect(stats.completedClasses).toBe(3);
      expect(stats.totalClasses).toBe(5);
      expect(stats.publishedTheses).toBe(2);
      expect(stats.completedAt).toHaveLength(3);
    });

    it("should handle query errors gracefully", async () => {
      const userId = "test-user-id";

      const mockFrom = vi.fn().mockImplementation((table) => {
        return {
          select: vi.fn().mockRejectedValue(new Error("Network error")),
        };
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      let stats;
      await act(async () => {
        stats = await result.current.fetchLessonStats(userId);
      });

      expect(stats.completedClasses).toBe(0);
      expect(stats.totalClasses).toBe(0);
      expect(stats.publishedTheses).toBe(0);
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data consistency across insert and fetch", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-persistence";

      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        const response = await result.current.markLessonComplete(userId, lessonId);
        expect(response.success).toBe(true);
      });

      const insertedData = mockInsert.mock.calls[0][0];
      expect(insertedData.user_id).toBe(userId);
      expect(insertedData.lesson_id).toBe(lessonId);
      expect(insertedData.completed_at).toBeDefined();
    });
  });

  describe("Timestamp Validation", () => {
    it("should use current UTC time for completion", async () => {
      const userId = "test-user-id";
      const lessonId = "lesson-timestamp";

      const beforeTime = new Date();

      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const mockFrom = vi.fn().mockImplementation((table) => {
        if (table === "lesson_progress") {
          return {
            select: mockSelect,
            insert: mockInsert,
          };
        }
      });

      mockSupabaseFrom.mockImplementation(mockFrom);

      const { result } = renderHook(() => useProfile());

      await act(async () => {
        await result.current.markLessonComplete(userId, lessonId);
      });

      const afterTime = new Date();
      const insertedData = mockInsert.mock.calls[0][0];
      const completedTime = new Date(insertedData.completed_at);

      expect(completedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(completedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });
});
