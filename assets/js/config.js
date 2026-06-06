/** @typedef {'small' | 'big'} PopupType */

/**
 * @typedef {Object} StudyMode
 * @property {string} endpoint
 * @property {string} name
 * @property {PopupType} [popup]
 * @property {string[]} [securityKeywords]
 */

/** @type {Record<string, StudyMode>} */
const STUDY_MODES = {
  "1": {
    endpoint: "/autocompleteNLtoCode/vul",
    name: "Baseline (Vulnerable Code)",
  },
  "2": {
    endpoint: "/autocompleteNLtoCode/ske",
    name: "Skeleton Code",
  },
  "3": {
    endpoint: "/autocompleteNLtoCode/vul",
    name: "Popup Warning",
    popup: "small",
  },
  "4": {
    endpoint: "/autocompleteNLtoCode/vul",
    name: "Security Highlight",
    securityKeywords: ["AES.new", "key", "sql_query =", "shell="],
  },
  "5": {
    endpoint: "/autocompleteNLtoCode/vul",
    name: "Full Security Panel",
    popup: "big",
  },
};

const API_BASE_URL = "http://localhost:5059";

const TASK_PREFIX =
  "# User study task #Encrypt sensitive user data # Write your program requirements:\n";

const SECURITY_WARNING_TEXT =
  "⚠️ 이 코드는 공개된 오픈소스 코드 데이터셋을 기반으로 생성되었으며, 코드의 보안을 보장하지 않습니다.";
