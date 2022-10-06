export class ApiUrlConstants {

    // Authentication API URL
    public static OAUTH_TOKEN_API_URL = '/oauth/token';
    public static SIGN_IN_API_URL = '/um/auth/sign-in';

    // Dashboard API URL
    public static DASHBOARD_API_URL = '/dashboard/';

    // User Management API URLS
    public static USER_API_URL = '/um/user/';
    public static FORGOT_PASSWORD_API_URL = '/um/user/forgot-password';
    public static UPLOAD_IMAGE_API_URL = '/um/user/profile-picture';
    public static USER_STATUS_API_URL = '/um/user/update-user-status/';
    public static USER_RESET_PASS_API_URL = '/um/user/reset-password/';
    public static CHANGE_PASSWORD_API_URL = '/user/change-password';
    public static DEPARTMENT_API_URL = '/um/department/';
    public static ROLE_API_URL = '/um/role/';
    public static PERMISSIONS_API_URL = '/um/permission/';
    public static MODULE_API_URL = '/um/module/';
    public static GROUP_API_URL = '/um/group/';

    // Document Handling API URLS
    public static GET_RECENT_DOCUMENT_API_URL = '/dl/dl-document/recent/owner/';
    public static GET_ALL_DL_DOCUMENT_API_URL = '/dl/dl-document/?folderId={folderId}&archived={archived}';
    public static GET_META_DL_DOCUMENT_API_URL = '/dl/dl-document/meta/{dlDocumentId}';


}
