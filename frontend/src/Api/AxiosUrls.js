//BaseUrl
// export const BaseUrl = "http://localhost:7878/api/";
export const BaseUrl = "https://backaffotax.robbito.com/api/";

//Auth / Users
export const Login = "login";
export const addEmployeeUrl = "users/add";
export const getEmployeeUrl = "users/get/all";
export const getUsersRolesUrl = "users/roles/get";
export const UserDeleteUrl = "users/delete/one";
export const UserGetOneUrl = "users/get/one";
export const UserEditOneUrl = "users/edit/one";
export const UserInactiveOneUrl = "users/one/inactive";

//Clients
export const getDashboardDataUrl = "admin/dashoard/get";

//Clients
export const getClientsUrl = BaseUrl + "clients/get/all";
export const updateClientPreData = "client/get/one/predata/";
export const updateClient = "client/one/update/";
export const deleteClientUrl = "client/one/delete";
export const ActiveInactiveUrl = "client/one/active/inactive";

//JobPlanning
export const jobPlanning = BaseUrl + "job/get/all";
export const addJobPreData = "job/add/predata";
export const addJob = "job/client/add";
export const JobPlaning_Update_One_Url = "job/planing/edit";
export const JobPlaning_Update_Many_Url = "job/planing/edit/many";

//Get All Clients
export const GetAllClients = "clients/get/all";
export const GetAllClientsWthBaseUrl = BaseUrl + "clients/get/all";

//Timer
export const timerStateUrl = "timer/check";
export const timerStartStopUrl = "timer/start_stop";
export const timerReportUrl = "timer/report";
export const timerAddManualEntryUrl = "timer/add/manual";
export const timerDeleteOneEntryUrl = "timer/delete/one";

//Leads
export const LeadsGetAllUrl = "leads/get/all";
export const leadEditUrl = "leads/add/edit";
export const leadDeleteUrl = "leads/delete";
export const wonLostUrl = "leads/won/lost";
export const CopyLeadUrl = "leads/copy/one";

//Roles
export const rolesPredataUrl = "roles/predata/get";
export const AddRoleUrl = "roles/add";
export const deleteOneRoleUrl = "roles/delete/one";
export const savePermissionsUrl = "roles/permissoins/save";
export const getUserRolesUrl = "roles/users/get";
export const assignRoleToUserUrl = "roles/users/assign/role";

//Tasks
export const addProjectName = "tasks/add/project/name";
export const editProjectName = "tasks/edit/project/name";
export const deleteProjectName = "tasks/delete/project/name";
export const getAllTasksUrl = "tasks/all/get";
export const addOneTasksUrl = "tasks/add/project";
export const addMainTaskUrl = "tasks/add/maintask";
export const addSubTaskUrl = "tasks/add/subtask";
export const subTaskCheckChangeUrl = "tasks/subtask/change/iscompleted";
export const subTaskDeleteUrl = "tasks/subtask/delete/one";
export const mainTaskDeleteUrl = "tasks/maintask/delete/one";
export const ProjDeleteUrl = "tasks/project/delete/one";
export const Tasks_Update_One_Url = "tasks/project/edit/one";
export const ProjCopyUrl = "tasks/project/copy/one";

//Qucik Notes
export const QuickNotesgetAllUrl = "quick/task/get/all";
export const QuickNotesAddOneUrl = "quick/task/add/one";
export const QuickNotesCompleteOneUrl = "quick/task/complete/one";

//Recurring Notes
export const RecurringNotesgetAllUrl = "recurring/task/get/all";
export const RecurringNotesAddOneCategoryUrl =
  "recurring/task/add/one/category";
export const RecurringNotesAddOneTaskUrl = "recurring/task/add/one/task";
export const RecurringNotesCompleteOneUrl = "recurring/task/complete/one";
export const RecurringNotesDeleteOneUrl = "recurring/task/delete/one";
export const RecurringNotesDeleteOneCategoryUrl =
  "recurring/task/delete/one/category";

//Sales
export const SalesgetAllUrl = "sales/get/all";
export const SalesAddOneUrl = "sales/add/one";
export const SalesDeleteOneUrl = "sales/delete/one";
export const SalesEditOneUrl = "sales/edit/one";
export const SalesEditOneNoteUrl = "sales/edit/one/note";
export const SalesEditOneMarkPaidUrl = "sales/edit/one/mark/paid";

// Chart of Account
export const ChartsOfAccountsGetAllUrl = "chart_of_account/get/all";
export const ChartsOfAccountsAddOneUrl = "chart_of_account/add/one";

// Hr Attendance
export const GetAllAttendance = "hr/attendance/get/all";

//Construction
export const ConstructionAddProjectHouseNo = "construction/add/houseno";
export const ConstructionDeleteHouseNo = "construction/delete/houseno";
export const ConstructionGetAllTasksUrl = "construction/all/get";
export const ConstructionAddOneTasksUrl = "construction/add/one";
export const ConstructionTaslDeleteUrl = "/construction/task/delete/one";
export const ConstructionTasks_Update_One_Url = "construction/task/edit/one";
export const ConstructionTaskCopyUrl = "construction/task/copy/one";
export const ConstructionTaskSetCompletedUrl =
  "construction/task/set/completed/one";

//Templates
export const TemplatesCategoryAddOneUrl = "template/category/add/one";
export const TemplatesCategoryDeleteOneUrl = "template/category/delete/one";
export const TemplatesGetAllUrl = "template/get/all";
export const TemplatesAddOneUrl = "template/add/one";
export const TemplatesEditOneUrl = "template/edit/one";
export const deleteTemplateUrl = "template/delete/one";
export const copyTemplateUrl = "template/copy/one";
export const usersListAddUrl = "template/users/list/add";

//Goals
export const GoalsAddOneUrl = "goals/add/one";
export const GoalsGetAllUrl = "goals/get/all";
export const GoalsEditOneUrl = "goals/edit/one";
export const GoalsDeleteOneUrl = "goals/delete/one";

//Tickets
export const getAllTickets = "tickets/email/get/all";
export const markMailAsRead = "tickets/email/markasread";
export const createNewTicket = "tickets/create/new";
export const createNewTicketWithAttachments = "tickets/create/new/attachments";
export const replyToTicket = "tickets/thread/reply";
export const replyToTicketWithAttachments = "tickets/thread/reply/attachments";
export const markMailAsCompleted = "tickets/thread/complete";
export const markMailAsDeleted = "tickets/thread/delete";
export const downloadAttachment = "tickets/thread/attachment/download";
export const EditOneTicketUrl = "tickets/edit/one";

//Notifications
export const getAllNotificationsUrl = "notifications/get/all";
export const markAllNotificationsReadUrl = "notifications/mark/all/read";
export const markOneNotificationsReadUrl = "notifications/mark/one/read";

//Companies
export const companiesGetAllUrl = "companies/get/all";
export const companiesAddOneUrl = "companies/add/one";
export const companiesEditOneUrl = "companies/edit/one";
export const companiesDeleteOneUrl = "companies/delete/one";

//User Recurring Task
export const UserRecurringTasksGetAllUrl = "user/recurring/tasks/get/all";
export const UserRecurringTasksAddOneUrl = "user/recurring/tasks/add/one";
export const UserRecurringTasksEditOneUrl = "user/recurring/tasks/edit/one";
export const UserRecurringTasksDeleteOneUrl = "user/recurring/tasks/delete/one";
export const UserRecurringTasksCopyOneUrl = "user/recurring/tasks/copy/one";
export const UserRecurringTasksMarkCompleteOneUrl =
  "user/recurring/tasks/mark_complete/one";

//Proposals
export const proposalsGetAllUrl = "proposals/get/all";
export const proposalsAddOneUrl = "proposals/add/one";
export const proposalsUpdateOneUrl = "proposals/edit/one";
export const proposalsDeleteUrl = "proposals/delete/one";
export const proposalsCopyOneUrl = "proposals/copy/one";

//Search
export const searchAllUrl = "user/search/all";

// My List
export const myListPredataUrl = "mylist/get/predata";
// User List
export const userListDataSave = "userlist/data/save";
