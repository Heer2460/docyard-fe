export class ApiUrlConstants {

    // Authentication API URL
    public static OAUTH_TOKEN_API_URL = '/oauth/token';
    public static SIGN_IN_API_URL = '/um/auth/sign-in';

    // Un Auth API URL
    public static UN_AUTH_RESET_PASSWORD_API_URL = '/um/un-auth/reset-password';
    public static UN_AUTH_CHECK_TOKEN_EXPIRY_API_URL = '/um/un-auth/check-token-expiry?token=';
    public static FORGOT_PASSWORD_API_URL = '/um/un-auth/forgot-password';
    public static UNSUCCESSFUL_ATTEMPT_API_URL = '/um/un-auth//un-success/{username}';

    // Dashboard API URL
    public static DASHBOARD_API_URL = '/dashboard/';
    public static DASHBOARD_STATS_API_URL = '/dl/dashboard/{userId}';

    // User Management API URLS
    public static USER_API_URL = '/um/user/';
    public static USER_EMAIL_API_URL = '/um/user/email/{email}';
    public static UPLOAD_IMAGE_API_URL = '/um/user/profile-picture';
    public static USER_STATUS_API_URL = '/um/user/update-user-status/';
    public static USER_RESET_PASS_API_URL = '/um/user/reset-password/';
    public static CHANGE_PASSWORD_API_URL = '/um/user/change-password';
    public static DEPARTMENT_API_URL = '/um/department/';
    public static ROLE_API_URL = '/um/role/';
    public static MODULE_API_URL = '/um/module/';
    public static GROUP_API_URL = '/um/group/';
    public static USER_ACTIVITY_LOGS_API_URL = '/dl/dl-doc-activity/?userId={userId}';

    // Document Handling API URLS
    public static GET_RECENT_DOCUMENT_API_URL = '/dl/dl-document/recent/owner/';
    public static GET_ALL_DL_DOCUMENT_API_URL = '/dl/dl-document/?folderId={folderId}&archived={archived}';
    public static GET_ALL_DL_DOCUMENT_BY_OWNER_API_URL = '/dl/dl-document/owner/{ownerId}?folderId={folderId}&archived={archived}';
    public static GET_ALL_SHARED_PREVIEW_DL_DOCUMENT_API_URL = '/dl/dl-document/folder/{folderId}?archived={archived}';
    public static GET_ALL_FAVOURITE_DL_DOCUMENT_BY_OWNER_API_URL = '/dl/dl-document/favourite/owner/{ownerId}?folderId={folderId}&archived={archived}';
    public static CREATE_FOLDER_API_URL = '/dl/dl-document/folder';
    public static DL_DOCUMENT_API_URL = '/dl/dl-document/{dlDocumentId}';
    public static DL_DOCUMENT_VIEW_FILE_URL = '/dl/dl-document/file/view/{dlDocumentId}';
    public static DL_DOCUMENT_ARCHIVED_API_URL = '/dl/dl-document/archive/{dlDocumentId}?archive={archived}';
    public static DL_DOCUMENT_RENAME_API_URL = '/dl/dl-document/rename/';
    public static GET_ALL_TRASH_DL_DOCUMENTS_API_URL = '/dl/dl-document/trash/owner/';
    public static DOWNLOAD_DL_DOCUMENT_API_URL = '/dl/dl-document/download/{dlDocumentId}';
    public static DOWNLOAD_DL_FOLDER_API_URL = '/dl/dl-document/download/folder/{dlDocumentId}';
    public static DOWNLOAD_IMAGE_TO_DOCX_DL_DOCUMENT_API_URL = '/dl/dl-document/convert/docx/download/{dlDocumentId}/{extension}';
    public static DOWNLOAD_IMAGE_TO_TXT_DL_DOCUMENT_API_URL = '/dl/dl-document/convert/txt/download/{dlDocumentId}/{extension}';
    public static DOWNLOAD_IMAGE_TO_PP_DL_DOCUMENT_API_URL = '/dl/dl-document/convert/ppt/download/{dlDocumentId}/{extension}';
    public static DOWNLOAD_IMAGE_TO_EXCEL_DL_DOCUMENT_API_URL = '/dl/dl-document/convert/excel/download/{dlDocumentId}/{extension}';
    public static ARCHIVE_DOCUMENT_API_URL = '/dl/dl-document/archive/{dlDocumentId}';
    public static DOCUMENT_CHECK_IN_OUT_API_URL = '/dl/dl-document/check-in-out/{dlDocumentId}?userId={userId}&flag={flag}';
    public static UN_ARCHIVE_DOCUMENT_API_URL = '/dl/dl-document/un-archive/{dlDocumentId}';
    public static UPLOAD_FILES_API_URL = '/dl/dl-document/upload';
    public static UPLOAD_FOLDER_API_URL = '/dl/dl-document/upload/folder';
    public static RESTORE_DOCUMENT_API_URL = '/dl/dl-document/restore-archived';
    public static DL_DOCUMENT_COMMENT_API_URL = '/dl/dl-doc-comment/';
    public static DL_DOCUMENT_TAG_API_URL = '/dl/dl-doc-tag/';
    public static DL_DOCUMENT_DELETE_API_URL = '/dl/dl-document/delete';
    public static DL_DOCUMENT_SEARCH_API_URL = '/dl/dl-document/search/{userid}?searchKey={searchKey}';
    public static DL_DOCUMENT_SEARCH_TAG_API_URL = '/dl/dl-doc-tag/tag/search/{userid}?searchKey={tagValue}';
    public static DL_DOCUMENT_SEARCH_FAVORITES_API_URL = '/dl/dl-doc-tag/favorite/search/{userid}?searchKey={flagValue}';
    public static DL_DOCUMENT_SEARCH_SHARED_API_URL = '/dl/dl-doc-tag/shared/search/{userid}?searchKey={flagValue}';
    public static DL_DOCUMENT_SHARE_API_URL = '/dl/share/';
    public static DL_DOCUMENT_REMOVE_SHARE_API_URL = '/dl/share/remove';
    public static DL_DOCUMENT_SHARE_DETAIL_API_URL = '/dl/share/dl-document/';
    public static DL_DOCUMENT_UN_AUTH_FILE_DETAIL_API_URL = '/dl/un-auth/document/';
    public static DL_DOCUMENT_UN_AUTH_FOLDER_DETAIL_API_URL = '/dl/un-auth/folder/{folderId}';
    public static DOWNLOAD_UN_AUTH_DL_DOCUMENT_API_URL = '/dl/un-auth/document/download/{dlDocumentId}';
    public static GET_ALL_SBM_DL_DOCUMENT_BY_USER_API_URL = '/dl/dl-document/shared-by-me/user/{userId}?folderId={folderId}';
    public static GET_ALL_SWM_DL_DOCUMENT_BY_USER_API_URL = '/dl/dl-document/shared-with-me/user/{userId}?folderId={folderId}';
    public static GET_DL_DOCUMENT_SHARE_DETAIL_API_URL = '/dl/share/{dlDocumentId}';
    public static REMOVE_COLLABORATOR_SHARE_API_URL = '/dl/share/dl-document/{dlDocId}/collaborator/{collabId}';
    public static DL_DOCUMENT_SHARE_UPDATE_PERMISSION_API_URL = '/dl/share/update-access-permission?dlDocId={dlDocId}&collId={collId}&accessRight={accessRight}';
    public static GET_DL_DOCUMENT_HIERARCHY_API_URL = '/dl/dl-document/hierarchy/{dlDocumentId}';


}
