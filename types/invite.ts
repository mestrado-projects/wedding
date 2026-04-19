export type Guest = {
  id: string;
  name: string;
  gender?: "M" | "F";
  ageGroup?: "Adulto" | "Adolescente" | "Criança de colo";
};

export type InviteResponse = {
  inviteId: string;
  inviteName: string;
  group: string;
  guests: Guest[];
};

export type InviteSearchResult = {
  type: "single" | "multiple";
  invite?: InviteResponse;
  matches?: Array<{ inviteId: string; inviteName: string; group: string }>;
};

export type AttendanceOptions = {
  declined: boolean;
  ceremony: boolean;
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
