/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../axios";

export type CreateNotePayload = {
  title: string;
  content: string; // plain text
  color?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
};

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  color: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;  
  editedAt: string | null; // tambahan field
  deletedAt: string | null; // tambahan field
};

export type UpdateNotePayload = Partial<{
  title: string;
  content: string;
  color: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
}>;

// =============== CREATE ===============
export const createNoteApi = async (payload: CreateNotePayload) => {
  try {
    const res = await api.post("/note", payload);
    return res.data.note; // backend return { note }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create note");
  }
};

// =============== GET NOTES (active + archived) ===============
export const getNotesApi = async (params?: {
  archived?: boolean;
  page?: number;
  pageSize?: number;
  q?: string;
  tag?: string;
  pinned?: boolean;
}) => {
  try {
    const res = await api.get<{ items: NoteItem[] }>("/note", { params });
    return res.data.items;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to get notes");
  }
};

// =============== UPDATE ===============
export const updateNoteApi = async (id: string, payload: UpdateNotePayload) => {
  try {
    const res = await api.patch<{ note: NoteItem }>(`/note/${id}`, payload);
    return res.data.note;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update note");
  }
};

// =============== DELETE ===============
export const deleteNoteApi = async (id: string, hard = false) => {
  try {
    const res = await api.delete(`/note/${id}`, {
      params: { hard },
    });
    return res.data; // backend return { success, message, data: { id, deletedAt, hard } }
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete note");
  }
};


// List trash
export const listTrashApi = async (params: { page: number; pageSize: number }) => {
  const res = await api.get("/note/trash/list", { params });
  return res.data.data; // { total, page, pageSize, items }
};

// Restore note
export const restoreNoteApi = async (id: string) => {
  const res = await api.post(`/note/${id}/restore`);
  return res.data.data;
};

// Hard delete note
export const hardDeleteNoteApi = async (id: string, options?: { hard?: boolean }) => {
  const res = await api.delete(`/note/${id}`, { params: options });
  return res.data.data;
};
