export type Guest = {
  id: string;
  name: string;
};

export type InviteResponse = {
  inviteId: string;
  guests: Guest[];
};

export type AttendanceOptions = {
  ceremony: boolean;
  hotelFriday: boolean;
  hotelSaturday: boolean;
  hotelSunday: boolean;
};

export type AttendanceIntentPayload = {
  inviteId: string;
  selectedGuestIds: string[];
  attendanceIntent: AttendanceOptions;
};

export type SearchQuery = {
  query: string;
  queryType?: "name" | "phone";
};
