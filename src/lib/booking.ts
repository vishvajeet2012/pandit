/** Shape of the consultation form's action state — shared by client and server. */
export type BookingState = {
  status: "idle" | "sent" | "error";
  errors: Partial<Record<string, "required" | "email">>;
};

export const EMPTY_BOOKING: BookingState = { status: "idle", errors: {} };
