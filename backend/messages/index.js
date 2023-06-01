/**
 * @namespace APIs._MESSAGE
 */

/**
 * -----------------------------------------
 * 200 Success
 * 요청 성공
 * -----------------------------------------
 */

/**
 * @tag 200 Success
 *
 * @alias LOGIN_SUCCESS
 * @description 로그인 성공
 *
 * @memberof APIs._MESSAGE
 */
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

/**
 * -----------------------------------------
 * 400 Bad Request
 * 유효하지 않은 요청
 * -----------------------------------------
 */

/**
 * @tag 400 Bad Request
 *
 * @function FIELD_REQUIRED
 * @description 필드 필요함
 * @param {string} field - 필요한 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const FIELD_REQUIRED = (field) => `${field.toUpperCase()}_REQUIRED`;

/**
 * @tag 400 Bad Request
 *
 * @function FIELD_INVALID
 * @description 필드가 유효하지 않음
 * @param {string} field - 유효하지 않은 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const FIELD_INVALID = (field) => `${field.toUpperCase()}_INVALID`;

/**
 * -----------------------------------------
 * 401 Unauthorized
 * 사용자 검증 실패
 * -----------------------------------------
 */

export const ACADEMY_INACTIVATED = "ACADEMY_INACTIVATED";
export const PASSWORD_INCORRECT = "PASSWORD_INCORRECT";

/**
 * -----------------------------------------
 * 403 Forbidden
 * 사용자 접근 거부
 * -----------------------------------------
 */

/**
 * @tag 403 Forbidden
 *
 * @alias NOT_LOGGED_IN
 *
 * @memberof APIs._MESSAGE
 */
export const NOT_LOGGED_IN = "NOT_LOGGED_IN";

/**
 * @tag 403 Forbidden
 *
 * @alias ALREADY_LOGGED_IN
 *
 * @memberof APIs._MESSAGE
 */
export const ALREADY_LOGGED_IN = "ALREADY_LOGGED_IN";

/**
 * @tag 403 Forbidden
 *
 * @alias PERMISSION_DENIED
 *
 * @memberof APIs._MESSAGE
 */
export const PERMISSION_DENIED = "PERMISSION_DENIED";

/**
 * -----------------------------------------
 * 404 Not Found
 * 리소스 없음
 * -----------------------------------------
 */

/**
 * @tag 404 Not Found
 *
 * @function __NOT_FOUND
 * @param {string} field - 찾지 못한 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const __NOT_FOUND = (field) => `${field.toUpperCase()}_NOT_FOUND`;

/**
 * -----------------------------------------
 * 409 Conflict
 * 허용할 수 없는 요청
 * -----------------------------------------
 */

/**
 * @tag 409 Conflict
 *
 * @function _FIELD_IN_USE
 * @description 사용 중인 필드
 * @param {string} field - 사용 중인 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const FIELD_IN_USE = (field) => `${field.toUpperCase()}_IN_USE`;

/**
 * @tag 409 Conflict
 *
 * @function CONNECTED_ALREADY
 * @description 이미 연결된 필드
 * @param {string} field - 연결된 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const CONNECTED_ALREADY = (field) =>
  `${field.toUpperCase()}_CONNECTED_ALREADY`;

/**
 * @tag 409 Conflict
 *
 * @function DISCONNECTED_ALREADY
 * @description 이미 해제된 필드
 * @param {string} field - 해제된 필드명
 *
 * @memberof APIs._MESSAGE
 */
export const DISCONNECTED_ALREADY = (field) =>
  `${field.toUpperCase()}_DISCONNECTED_ALREADY`;
