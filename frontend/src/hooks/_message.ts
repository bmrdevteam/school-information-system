export const MESSAGE = new Map<string, string>([
  ["UNKNOWN", "알 수 없는 에러가 발생했습니다."],
  ["ACADEMYID_INVALID", "아카데미 ID가 형식에 맞지 않습니다."],
  ["ACADEMYNAME_INVALID", "아카데미 이름이 형식에 맞지 않습니다."],
  ["ADMINID_INVALID", "관리자  ID가 형식에 맞지 않습니다."],
  ["ADMINNAME_INVALID", "관리자 이름이 형식에 맞지 않습니다."],
  ["EMAIL_INVALID", "이메일이 형식에 맞지 않습니다."],
  ["TEL_INVALID", "전화번호가 형식에 맞지 않습니다."],
  ["ACADEMYID_IN_USE", "사용 중인 아카데미 ID입니다."],
  ["ACADEMY_NOT_FOUND", "아카데미를 찾을 수 없습니다."],
  ["ACADEMY_INACTIVATED", "이 아카데미에 로그인 할 수 없습니다."],
  ["USER_NOT_FOUND", "사용자를 찾을 수 없습니다."],
  ["PASSWORD_INCORRECT", "비밀번호가 틀렸습니다."],
  ["EMAIL_CONNECTED_ALREADY", "이메일이 이미 연결되어있습니다."],
  ["EMAIL_IN_USE", "사용 중인 이메일입니다."],
  ["SCHOOL_CONNECTED_ALREADY", "이미 등록된 학교입니다."],
  ["SCHOOL_DISCONNECTED_ALREADY", "등록되지 않은 학교입니다."],
  ["USERID_IN_USE", "사용 중인 아이디입니다."],
  ["SNSID.GOOGLE_IN_USE", "사용 중인 구글 로그인 이메일입니다."],
  ["LIMIT_FILE_SIZE", "파일 사이즈가 커서 업로드할 수 없습니다."],
  ["INVALID_FILE_TYPE", "파일 형식이 맞지 않아 업로드할 수 없습니다."],
  ["YEAR_TERM_IN_USE", `해당 학년도에 동일한 이름의 학기가 존재합니다.`],
  [
    "SEASON_ALREADY_ACTIVATED_FIRST",
    `한 번 활성화된 학기의 양식을 변경할 수 없습니다.`,
  ],
  ["FORM_LABEL_DUPLICATED", "양식에 중복된 항목이 있습니다."],
  ["REGISTRATION_IN_USE", "이미 등록되었습니다."],
  ["CLASSROOM_IN_USE", "해당 시간에 강의실이 사용 중입니다."],
  [
    "SYLLABUS_CONFIRMED_ALREADY",
    "승인이 완료된 강의계획서는 수정할 수 없습니다.",
  ],
  [
    "SYLLABUS_ENROLLED_ALREADY",
    "수강생이 있는 강의계획서(또는 강의실, 시간 및 승인 상태)는 수정(삭제)할 수 없습니다.",
  ],
  ["SYLLABUS_COUNT_EXCEEDS_LIMIT", "수강생 수가 수강정원을 초과합니다."],
  ["SYLLABUS_NOT_FOUND", "강의계획서를 찾을 수 없습니다."],
  ["ENROLLMENT_IN_USE", "이미 신청한 수업입니다."],
  ["STUDENTS_FULL", "수강정원이 다 찼습니다."],
  ["TIME_DUPLICATED", "시간표가 중복되었습니다."],
  ["SYLLABUS_NOT_CONFIRMED", "승인되지 않은 수업입니다."],
  ["PERMISSION_DENIED", "권한이 없습니다."],
]);
